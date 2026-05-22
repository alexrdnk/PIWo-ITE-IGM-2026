"use client";

import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stop = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setReady(true);
    });

    return stop;
  }, []);

  return (
    <AuthContext.Provider value={{ user, ready }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth musi być użyty wewnątrz AuthProvider");
  }

  return context;
}
