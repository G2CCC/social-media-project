import { auth, provider } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    console.log(result);
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-purple-50 p-8 rounded-lg shadow-md w-[320px] text-center">
        <h1 className="text-xl font-semibold text-gray-800 mb-3">Login</h1>
        <p className="text-gray-500 text-sm mb-6">
          Sign in with Google to continue
        </p>

        <button
          onClick={signInWithGoogle}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition text-gray-700 text-sm font-medium"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google Logo"
            className="w-5 h-5"
          />
          Sign In with Google
        </button>
      </div>
    </div>
  );
};
