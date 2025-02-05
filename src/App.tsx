import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom"; 
import { onAuthStateChanged, User } from "firebase/auth"; 
import { auth } from "./utils/firebase"; 
import Homepage from "./pages/HomePage";
import Profile from "./pages/Profile";
import TaskList from "./pages/task-list/TaskList";
import TaskBoard from "./pages/task-board/TaskBoard";
import Navbar from "./components/Navbar";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser); 
      setUser(currentUser); 
      setLoading(false); 

      if (!currentUser) {
        navigate("/"); 
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
  }

  return (
    <>
      {user ? <Navbar /> : null} 

      <Routes>
        <Route path="/" element={<Homepage />} />
        {user && <Route path="/profile" element={<Profile />} />}
        {user && <Route path="/task-list" element={<TaskList />} />}
        {user && <Route path="/task-board" element={<TaskBoard />} />}
      </Routes>
    </>
  );
};

export default App;





