"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        setLoading(true);

        // =========================
        // NO FIREBASE USER
        // =========================
        if (!currentUser) {
          const stored = localStorage.getItem("user");

          if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            setDbUser(parsed);
          } else {
            setUser(null);
            setDbUser(null);
          }

          setLoading(false);
          return;
        }

        // =========================
        // FIREBASE USER → MongoDB
        // =========================
        const res = await fetch(`/api/users/${currentUser.uid}`);
        const data = await res.json();

        console.log("PROFILE DATA:", data);

        // ✅ FIX: strict validation
        if (res.ok && data && data.uid) {
          setDbUser(data);
          setUser(currentUser);
        } else {
          const stored = localStorage.getItem("user");

          if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            setDbUser(parsed);
          } else {
            setUser(null);
            setDbUser(null);
          }
        }

        setLoading(false);
      } catch (error) {
        console.log(error);

        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          setDbUser(parsed);
        } else {
          setUser(null);
          setDbUser(null);
        }

        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // =========================
  // LOADING (UNCHANGED STYLE)
  // =========================
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500 dark:text-gray-300">
        Loading profile...
      </div>
    );
  }

  // =========================
  // NO USER (UNCHANGED STYLE)
  // =========================
  if (!dbUser) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500 dark:text-gray-300">
        user not find
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-pink-50 via-white to-rose-100 dark:from-zinc-900 dark:via-black dark:to-zinc-900">
      {/* MAIN CARD (NO CHANGE) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto rounded-3xl backdrop-blur-xl 
        bg-white/40 dark:bg-zinc-900/40 
        border border-white/30 dark:border-zinc-700/40 
        shadow-2xl overflow-hidden"
      >
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-white/20 dark:border-zinc-700/40">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Personal Information
          </h2>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT IMAGE */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center justify-center gap-4"
          >
            <img
              src={dbUser?.image || "/asset/img/logo.png"}
              className="w-32 h-32 rounded-full object-cover"
              style={{
                width: "8rem",
                height: "8rem",
                objectFit: "cover",
              }}
            />
          </motion.div>

          {/* RIGHT FORM */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Name
              </label>
              <input
                defaultValue={dbUser?.name || ""}
                className="w-full mt-1 px-4 py-2 rounded-xl 
                bg-white/60 dark:bg-zinc-800/60 
                backdrop-blur-md border border-white/30 dark:border-zinc-700/40
                outline-none text-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Email
              </label>
              <input
                defaultValue={dbUser?.email || ""}
                className="w-full mt-1 px-4 py-2 rounded-xl 
                bg-white/60 dark:bg-zinc-800/60 
                backdrop-blur-md border border-white/30 dark:border-zinc-700/40
                outline-none text-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Phone
              </label>
              <input
                defaultValue={dbUser?.phone || ""}
                className="w-full mt-1 px-4 py-2 rounded-xl 
                bg-white/60 dark:bg-zinc-800/60 
                backdrop-blur-md border border-white/30 dark:border-zinc-700/40
                outline-none text-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Address
              </label>
              <input
                defaultValue={dbUser?.address || ""}
                className="w-full mt-1 px-4 py-2 rounded-xl 
    bg-white/60 dark:bg-zinc-800/60 
    backdrop-blur-md border border-white/30 dark:border-zinc-700/40
    outline-none text-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Role
              </label>
              <input
                defaultValue={dbUser?.role || ""}
                disabled
                className="w-full mt-1 px-4 py-2 rounded-xl 
                bg-gray-100 dark:bg-zinc-700 
                text-gray-500 dark:text-gray-300"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
