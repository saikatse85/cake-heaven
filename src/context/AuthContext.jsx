"use client";

import { createContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [mongoUser, setMongoUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // =========================
    // 1. FIREBASE LISTENER
    // =========================
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser);
      setLoading(false);
    });

    // =========================
    // 2. LOCALSTORAGE (MONGO USERS)
    // =========================
    const stored = localStorage.getItem("user");

    if (stored) {
      try {
        setMongoUser(JSON.parse(stored));
      } catch (e) {
        console.log("Invalid stored user");
      }
    }

    return () => unsubscribe();
  }, []);

  // =========================
  // FINAL USER (HYBRID)
  // =========================
  const user = firebaseUser || mongoUser;

  return (
    <AuthContext.Provider value={{ user, firebaseUser, mongoUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
