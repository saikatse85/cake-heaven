"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import Swal from "sweetalert2";

export default function AllUsers({ users }) {
  const [localUsers, setLocalUsers] = useState(users);
  const tableRef = useRef();

  // Role Change
  const handleRoleChange = async (uid, role) => {
    const updatedUsers = localUsers.map((user) =>
      user.uid === uid ? { ...user, role } : user,
    );

    setLocalUsers(updatedUsers);

    // API call
    const res = await fetch("/api/users/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid, role }),
    });

    const data = await res.json();

    if (data.success) {
      Swal.fire({
        icon: "success",
        title: "Role Updated",
        text: `User role changed to ${role}`,
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      console.error("Update failed");

      setLocalUsers(users);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Could not update role",
      });
    }
  };

  // Delete User
  const handleDelete = async (uid) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This user will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
    });

    if (!result.isConfirmed) return;

    const previousUsers = [...localUsers];

    // instant UI update
    setLocalUsers(localUsers.filter((user) => user.uid !== uid));

    try {
      const res = await fetch("/api/users/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid }),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "User deleted successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        setLocalUsers(previousUsers);

        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: "Could not delete user",
        });
      }
    } catch (error) {
      console.error(error);

      setLocalUsers(previousUsers);

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong",
      });
    }
  };

  // Block User
  const handleBlock = async (uid, blocked) => {
    const updatedUsers = localUsers.map((user) =>
      user.uid === uid ? { ...user, blocked: !blocked } : user,
    );

    setLocalUsers(updatedUsers);

    try {
      const res = await fetch("/api/users/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid,
          blocked: !blocked,
        }),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: !blocked ? "User Blocked" : "User Unblocked",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        setLocalUsers(users);

        Swal.fire({
          icon: "error",
          title: "Action Failed",
          text: "Could not update block status",
        });
      }
    } catch (error) {
      console.error(error);

      setLocalUsers(users);

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong",
      });
    }
  };

  useEffect(() => {
    const rows = tableRef.current.querySelectorAll("tbody tr");

    gsap.fromTo(
      rows,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power3.out",
      },
    );
  }, [localUsers]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="p-6 text-gray-900 dark:text-gray-100"
    >
      <h1 className="text-3xl font-bold mb-5">All User 👤</h1>

      <div
        className="overflow-x-auto rounded-2xl shadow-xl
        bg-white dark:bg-gray-900"
      >
        <table
          ref={tableRef}
          className="min-w-full text-sm text-left
          text-gray-800 dark:text-gray-200"
        >
          <thead
            className="bg-pink-500 text-white uppercase text-xs
            tracking-wider"
          >
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Assign Role</th>
              <th className="px-6 py-4 text-center">Action</th>
              <th className="px-6 py-4">Created At</th>
            </tr>
          </thead>

          <tbody>
            {localUsers.map((user) => (
              <tr
                key={user._id}
                className="border-b
                border-gray-200 dark:border-gray-700
                hover:bg-gray-50 dark:hover:bg-gray-800
                transition duration-300"
              >
                <td className="px-6 py-4 font-medium whitespace-nowrap">
                  {user.name}
                </td>

                <td className="px-6 py-4">{user.email}</td>

                <td className="px-6 py-4 capitalize">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      user.role === "admin"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                {/* Assign Role */}
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.uid, e.target.value)}
                    className="border rounded-lg px-3 py-1.5 text-xs
                    bg-white dark:bg-gray-800
                    text-gray-900 dark:text-gray-100
                    border-gray-300 dark:border-gray-600
                    outline-none focus:ring-2 focus:ring-pink-400"
                  >
                    <option value="client">Client</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleBlock(user.uid, user.blocked)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition
                      ${
                        user.blocked
                          ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                          : "bg-gray-700 hover:bg-gray-800 text-white"
                      }`}
                    >
                      {user.blocked ? "Unblock" : "Block"}
                    </button>

                    <button
                      onClick={() => handleDelete(user.uid)}
                      className="px-3 py-1 rounded-lg text-xs font-medium
                      bg-red-500 hover:bg-red-600 text-white transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(user.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
