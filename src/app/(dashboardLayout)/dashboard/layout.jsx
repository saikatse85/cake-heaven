"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

import AdminSidebar from "./sidebar/AdminSidebar";
import ClientSidebar from "./sidebar/ClientSidebar";

export default function DashboardLayout({ children }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        // 👉 Get role from backend (example: Firestore / API)
        const res = await fetch(`/api/users/${user.uid}`);
        const data = await res.json();

        setUserRole(data.role); // "admin" or "client"
        setLoading(false);
      } catch (error) {
        console.log(error);
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-100">
      {/* ROLE BASED SIDEBAR */}
      {userRole === "admin" ? <AdminSidebar /> : <ClientSidebar />}

      <main className="flex-1 p-6 ml-64">{children}</main>
    </div>
  );
}
