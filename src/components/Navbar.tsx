import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { FaTasks } from "react-icons/fa";

const Navbar = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    avatar: "",
  });

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.displayName || "User",
        avatar: user.photoURL || "https://via.placeholder.com/150",
      });
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/"); // Redirect to the main page after logout
  };

  return (
    <nav className="p-4 text-black">
      {/* Task Buddy and User info in one line with justify-between */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <FaTasks className="text-xl" />
          <h1 className="font-bold">Task Buddy</h1>
        </div>
        {user && (
          <div className="flex items-center gap-2">
            <img
              src={userData.avatar}
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            <span className="font-bold">{userData.name}</span>
          </div>
        )}
      </div>

      {/* Task List, Task Board links, and Logout in second line */}
      <div className="flex justify-between gap-4">
        <div className="flex gap-2">

        <Link
          to="/task-list"
          className="p-2 text-black underline "
          >
          TaskList
        </Link>
        <Link
          to="/task-board"
          className="p-2 text-black underline"
          >
          TaskBoard
        </Link>
            </div>

        {user && (
          <button
            onClick={handleLogout}
            className="px-1 py-1 bg-pink-100 text-black rounded shadow"
          >
            Log Out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


