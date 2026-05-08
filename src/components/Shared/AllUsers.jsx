"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import Swal from "sweetalert2";

export default function AllUsers({ users }) {
  const [localUsers, setLocalUsers] = useState(users);
  const tableRef = useRef();

  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Role Change
  const handleRoleChange = async (uid, role) => {
    const updatedUsers = localUsers.map((user) =>
      user.uid === uid ? { ...user, role } : user,
    );

    setLocalUsers(updatedUsers);

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

      if (!data.success) {
        setLocalUsers(previousUsers);
      }
    } catch (error) {
      setLocalUsers(previousUsers);
    }
  };

  // Block User
  const handleBlock = async (uid, blocked) => {
    const updatedUsers = localUsers.map((user) =>
      user.uid === uid ? { ...user, blocked: !blocked } : user,
    );

    setLocalUsers(updatedUsers);

    try {
      await fetch("/api/users/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid,
          blocked: !blocked,
        }),
      });
    } catch (error) {
      setLocalUsers(users);
    }
  };

  // GSAP animation
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

  // pagination logic
  const totalPages = Math.ceil(localUsers.length / perPage);

  const startIndex = (currentPage - 1) * perPage;
  const paginatedUsers = localUsers.slice(startIndex, startIndex + perPage);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="p-6 text-gray-900 dark:text-gray-100"
    >
      <h1 className="text-3xl font-bold mb-5">All User 👤</h1>

      {/* PAGE SIZE SELECTOR */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm">Show:</span>

        <select
          value={perPage}
          onChange={(e) => {
            setPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border rounded-lg px-2 py-1 text-sm"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select>
      </div>

      <div
        className="overflow-x-auto rounded-2xl shadow-xl
        bg-white dark:bg-gray-900"
      >
        <table
          ref={tableRef}
          className="min-w-full text-sm text-left
          text-gray-800 dark:text-gray-200"
        >
          <thead className="bg-pink-500 text-white uppercase text-xs tracking-wider">
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
            {paginatedUsers.map((user) => (
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

                <td className="px-6 py-4 capitalize">{user.role}</td>

                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.uid, e.target.value)}
                    className="border rounded-lg px-3 py-1.5 text-xs"
                  >
                    <option value="client">Client</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>

                <td className="px-6 py-4">
                  <button onClick={() => handleBlock(user.uid, user.blocked)}>
                    {user.blocked ? "Unblock" : "Block"}
                  </button>

                  <button onClick={() => handleDelete(user.uid)}>Delete</button>
                </td>

                <td className="px-6 py-4">
                  {new Date(user.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-2 mt-4 flex-wrap">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 bg-pink-500 text-white rounded disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={`px-3 py-1 rounded ${
              currentPage === num
                ? "bg-pink-600 text-white"
                : "bg-white dark:bg-zinc-800"
            }`}
          >
            {num}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 bg-pink-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}
