import { Link } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

export const Navbar = () => {
  const [user] = useAuthState(auth);
  

  const signUserOut = async () => {
    await signOut(auth);
  };
  return (
    <header className="sticky top-0 z-40 border-b border-purple-200 bg-purple-600/90 backdrop-blur supports-[backdrop-filter]:bg-purple-600/70">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="h-14 flex items-center justify-between">
        {/* Home Tab */}
        <div className="flex items-center gap-6">
          <Link
            to={"/"}
            className="text-[17px] font-semibold tracking-tight text-white hover:text-purple-100 transition"
          >
            Home
          </Link>
        </div>

        {/* Action Tab */}
        <div className="flex items-center gap-3">
          {!user && (
            <Link
              to={"/login"}
              className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium
                         text-white bg-purple-600 hover:bg-purple-500 active:scale-[0.98] 
                         transition shadow-sm"
            >
              Login
            </Link>
          )}

          {user && (
            <>
              <Link
                to={"/createpost"}
                className="hidden sm:inline-flex items-center rounded-full px-3 py-2 text-sm font-semibold
                           text-purple-700 bg-white hover:bg-purple-50 transition"
              >
                New Post
              </Link>

              <div className="flex items-center gap-2 pl-2">
                <img
                  src={auth.currentUser?.photoURL || ""}
                  className="w-8 h-8 rounded-full ring-2 ring-white"
                />
                <p className="hidden md:block text-sm text-white font-medium">
                  {user.displayName}
                </p>
              </div>

              <button
                onClick={signUserOut}
                className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium
                           text-purple-700 bg-white hover:bg-purple-50 active:scale-[0.98] 
                           transition shadow-sm"
              >
                Log Out
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  </header>
  );
};
