import { createContext, useEffect, useContext, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  async function signUp(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        favShows: [],
      });
      setUser(user); // Optionally update user state
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  }

  async function logIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user); // Optionally update user state
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  async function logOut() {
    try {
      await signOut(auth);
      setUser(null); // Clear user state
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }

  return (
    <AuthContext.Provider value={{ user, signUp, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function UserAuth() {
  return useContext(AuthContext);
}
