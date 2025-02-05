import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
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
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow">
      <div className="flex items-center gap-4">
        <img
          src={userData.avatar}
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h2 className="text-xl font-bold">{userData.name}</h2>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="mt-4 p-2 bg-red-500 text-white rounded shadow"
      >
        Log Out
      </button>
    </div>
  );
};

export default Profile;
