import {
  addDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  doc,
} from "firebase/firestore";
import type { Post as IPost } from "./main";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";

interface Props {
  post: IPost;
}

interface Like {
  likeId: string;
  userId: string;
}

export const Post = (props: Props) => {
  const { post } = props;
  const [user] = useAuthState(auth);

  const [likes, setLikes] = useState<Like[] | null>(null);

  const likesRef = collection(db, "likes");

  const likesDoc = query(likesRef, where("postId", "==", post.id));

  const getLikes = async () => {
    const data = await getDocs(likesDoc);
    setLikes(
      data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id }))
    );
  };

  const addLike = async () => {
    try {
      const newDoc = await addDoc(likesRef, {
        userId: user?.uid,
        postId: post.id,
      });
      if (user) {
        setLikes((prev) =>
          prev
            ? [...prev, { userId: user?.uid, likeId: newDoc.id }]
            : [{ userId: user?.uid, likeId: newDoc.id }]
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const removeLike = async () => {
    try {
      const likesToDeleteQuery = query(
        likesRef,
        where("postId", "==", post.id),
        where("userId", "==", user?.uid)
      );

      const likeToDeleteData = await getDocs(likesToDeleteQuery);
      const likeId = likeToDeleteData.docs[0].id;
      const likeToDelete = doc(db, "likes", likeId);
      await deleteDoc(likeToDelete);
      if (user) {
        setLikes(
          (prev) => prev && prev.filter((like) => like.likeId === likeId)
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const hasUserLiked = likes?.find((like) => like.userId === user?.uid);

  useEffect(() => {
    getLikes();
  });

  return (
    <div>
      <div >
        <h1 className="text-xl font-semibold text-gray-900 mb-2 whitespace-normal break-words">{post.title}</h1>
      </div>
      <div className="bg-purple-50 py-8 rounded-xl shadow-md p-6 mb-6 border border-purple-100 hover:shadow-lg transition">
        <p className="text-gray-700 mb-4 whitespace-normal break-words">{post.description}</p>
      </div>
      <div className="flex items-center justify-between  text-sm text-gray-500">
        <p >@{post.username}</p>
        <div className="flex items-center gap-2">
        <button onClick={hasUserLiked ? removeLike : addLike} className="text-purple-600 hover:text-purple-800 transition">
          {hasUserLiked ? <>&#128078;</> : <>&#128077;</>}
        </button>
        {likes && <span className="text-gray-700">Likes:{likes?.length}</span>}
        </div>
      </div>
    </div>
  );
};
