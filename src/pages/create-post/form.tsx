import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

interface CreateFormData {
  title: string;
  description: string;
}

export const CreateForm = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const schema = yup.object().shape({
    title: yup.string().required("You must add a title."),
    description: yup.string().required("Say something."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, touchedFields },
  } = useForm<CreateFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const postsRef = collection(db, "post");

  const onCreatePost = async (data: CreateFormData) => {
    await addDoc(postsRef, {
      ...data,
      username: user?.displayName,
      userId: user?.uid,
    });
    {/* Navigate to home page after posting */}
    navigate("/");
  };

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <form
        onSubmit={handleSubmit(onCreatePost)}
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Create a new post
        </h2>

        {/* Title */}
        <label
          htmlFor="title"
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Title
        </label>
        <input
          id="title"
          placeholder="Title.."
          {...register("title")}
          aria-invalid={!!errors.title}
          className={[
            "w-full rounded-xl border bg-white px-3 py-2 text-sm text-gray-900 outline-none",
            "placeholder:text-gray-400",
            "focus:ring-2 focus:ring-gray-900 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500",
            errors.title
              ? "border-red-500 focus:ring-red-600"
              : "border-gray-300 dark:border-gray-700",
          ].join(" ")}
        />
        <p className="mt-1 min-h-[1.25rem] text-xs text-red-600">
          {errors.title?.message}
        </p>
        {/* Description */}
        <label
          htmlFor="description"
          className="mb-1 mt-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          What's new today?
        </label>
        <textarea
          placeholder="Write something..."
          {...register("description")}
          aria-invalid={!!errors.description}
          className={[
            "w-full resize-y rounded-xl border bg-white px-3 py-2 text-sm text-gray-900 outline-none",
            "placeholder:text-gray-400",
            "focus:ring-2 focus:ring-gray-900 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500",
            errors.description
              ? "border-red-500 focus:ring-red-600"
              : "border-gray-300 dark:border-gray-700",
          ].join(" ")}
        />
        <p className="mt-1 min-h-[1.25rem] text-xs text-red-600">
          {errors.description?.message}
        </p>
        <button
          type="submit"
          disabled={
            isSubmitting ||
            !isValid ||
            (!touchedFields.title && !touchedFields.description)
          }
          className={[
            "rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition active:scale-[0.98]",
            "hover:opacity-90",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "dark:bg-white dark:text-gray-900",
          ].join(" ")}
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};
