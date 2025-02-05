// import { createContext, useContext, useEffect, useState } from "react";
// import { auth, googleProvider } from "../utils/firebase";
// import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     onAuthStateChanged(auth, (user) => {
//       setUser(user);
//     });
//   }, []);

//   const signInWithGoogle = async () => {
//     await signInWithPopup(auth, googleProvider);
//   };

//   const logout = async () => {
//     await signOut(auth);
//   };

//   return (
//     <AuthContext.Provider value={{ user, signInWithGoogle, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
