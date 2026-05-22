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
      let activeRole = null;
      let identifier = null;

      if (user) {
        identifier = user.uid;
      } else {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          router.push("/login");
          return;
        }

        try {
          const parsedUser = JSON.parse(storedUser);
          identifier = parsedUser.uid || parsedUser.email || parsedUser.phone;
          activeRole = parsedUser.role?.toLowerCase();
        } catch (parseError) {
          console.log("Stored user parse error:", parseError);
          router.push("/login");
          return;
        }
      }

      try {
        const res = await fetch(`/api/users/${identifier}`);
        const data = await res.json();
        const roleFromDB =
          data?.user?.role?.toLowerCase() || activeRole || "user";

        setUserRole(roleFromDB);
        setLoading(false);

        const path = window.location.pathname;

        if (path === "/dashboard") {
          if (roleFromDB === "admin") {
            router.replace("/dashboard/admin");
          } else {
            router.replace("/dashboard/user");
          }
        }

        if (roleFromDB !== "admin" && path.startsWith("/dashboard/admin")) {
          router.replace("/dashboard/user");
        }
      } catch (error) {
        console.log("Role fetch error:", error);

        setUserRole(activeRole || "user");
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

      <main
        className="
  flex-1 ml-64 overflow-x-hidden
  bg-pink-50/40 dark:bg-zinc-900
  text-black dark:text-white backdrop-blur-xl
  transition-all duration-300
"
      >
        {children}
      </main>
    </div>
  );
}
