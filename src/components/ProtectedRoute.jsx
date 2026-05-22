"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // wait firebase loading
    if (loading) return;

    // =========================
    // 1. FIREBASE USER
    // =========================
    if (user) {
      setAuthorized(true);
      return;
    }

    // =========================
    // 2. LOCALSTORAGE USER
    // =========================
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setAuthorized(true);
      return;
    }

    // =========================
    // 3. NO USER
    // =========================
    router.push("/login");
  }, [user, loading, router]);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  // =========================
  // BLOCK PAGE
  // =========================
  if (!authorized) {
    return null;
  }

  return children;
}
