"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Swal from "sweetalert2";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    image: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        setLoading(true);

        if (!currentUser) {
          const stored = localStorage.getItem("user");

          if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            setDbUser(parsed);
            setFormData(parsed);
          } else {
            setUser(null);
            setDbUser(null);
          }

          setLoading(false);
          return;
        }

        const res = await fetch(`/api/users/${currentUser.uid}`);
        const data = await res.json();

        if (res.ok && data && data.uid) {
          setDbUser(data);
          setUser(currentUser);
          setFormData(data);
        } else {
          const stored = localStorage.getItem("user");

          if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            setDbUser(parsed);
            setFormData(parsed);
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
          setFormData(parsed);
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
  // CLOUDINARY UPLOAD
  // =========================
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    setUploading(true);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formDataUpload,
    });

    const data = await res.json();

    if (data.url) {
      setFormData((prev) => ({
        ...prev,
        image: data.url,
      }));
    }

    setUploading(false);
  };

  // =========================
  // UPDATE PROFILE (SWEETALERT ADDED)
  // =========================
  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/users/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: dbUser.uid,
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          image: formData.image,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setDbUser((prev) => ({
          ...prev,
          ...formData,
        }));

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Profile updated successfully",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: data.message || "Something went wrong",
        });
      }
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong",
      });
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500 dark:text-gray-300">
        Loading profile...
      </div>
    );
  }

  if (!dbUser) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500 dark:text-gray-300">
        user not find
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-pink-50 via-white to-rose-100 dark:from-zinc-900 dark:via-black dark:to-zinc-900">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto rounded-3xl backdrop-blur-xl 
        bg-white/40 dark:bg-zinc-900/40 
        border border-white/30 dark:border-zinc-700/40 
        shadow-2xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-white/20 dark:border-zinc-700/40">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Personal Information
          </h2>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center justify-center gap-4"
          >
            <img
              src={formData.image || "/asset/img/logo.png"}
              className="w-32 h-32 rounded-full object-cover"
              style={{
                width: "8rem",
                height: "8rem",
                objectFit: "cover",
              }}
            />

            <div className="flex flex-col items-center gap-2">
              <label className="cursor-pointer px-3 py-1 rounded-md bg-white/60 dark:bg-zinc-800/60 border border-white/30 dark:border-zinc-700/40 text-sm text-gray-700 dark:text-gray-200">
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                {uploading ? "Uploading..." : "No file selected"}
              </p>
            </div>
          </motion.div>

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
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
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
                disabled
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
                value={formData.phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
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
                value={formData.address || ""}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
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

            <div className="col-span-2 mt-2">
              <button
                onClick={handleUpdate}
                className="w-full px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold"
              >
                Update
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
