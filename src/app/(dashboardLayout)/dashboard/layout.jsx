"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

import AdminSidebar from "./sidebar/AdminSidebar";
import ClientSidebar from "./sidebar/ClientSidebar";
import Loading from "@/app/loading";

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
        const res = await fetch(`/api/users/${user.uid}`);

        const data = await res.json();
        const roleFromDB = data?.role?.toLowerCase();

        // if role missing, don't logout
        if (!roleFromDB) {
          setUserRole("user");
          setLoading(false);
          return;
        }

        setUserRole(roleFromDB);
        setLoading(false);

        const path = window.location.pathname;

        // redirect
        if (path === "/dashboard") {
          if (roleFromDB === "admin") {
            router.replace("/dashboard/admin");
          } else {
            router.replace("/dashboard/user");
          }
        }

        // protect admin
        if (roleFromDB !== "admin" && path.startsWith("/dashboard/admin")) {
          router.replace("/dashboard/user");
        }
      } catch (error) {
        console.log("Role fetch error:", error);

        setUserRole("user");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-100">
      {userRole === "admin" ? <AdminSidebar /> : <ClientSidebar />}

      <main className="flex-1 ml-64 overflow-x-hidden">{children}</main>
    </div>
  );
}
