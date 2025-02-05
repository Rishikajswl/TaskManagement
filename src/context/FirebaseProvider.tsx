import React, { createContext, ReactNode, useContext } from 'react';
import { Auth, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../utils/firebase';

type FirebaseContextType = {
  auth: Auth;
  user: User | null;
};

const FirebaseContext = createContext<FirebaseContextType | undefined>(
  undefined
);

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  return (
    <FirebaseContext.Provider value={{ auth, user }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within FirebaseProvider');
  }
  return context;
};
