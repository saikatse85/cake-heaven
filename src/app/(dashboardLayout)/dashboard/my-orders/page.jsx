"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.email) {
      setUserEmail(user.email.trim().toLowerCase());
    }
  }, []);

  useEffect(() => {
    if (!userEmail) return;

    const loadOrders = async () => {
      const res = await fetch(`/api/orders?email=${userEmail}`);
      const data = await res.json();
      setOrders(data || []);
    };

    loadOrders();

    const interval = setInterval(loadOrders, 3000);
    return () => clearInterval(interval);
  }, [userEmail]);

  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ec4899",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmDelete.isConfirmed) return;

    try {
      await fetch(`/api/orders/${id}`, { method: "DELETE" });

      setOrders((prev) => prev.filter((order) => order._id !== id));

      // optional success alert (does not change logic)
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Order has been removed.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Delete failed:", error);

      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Delete failed.",
      });
    }
  };

  return (
    <div
      className="space-y-6 p-4 min-h-screen 
      bg-gradient-to-br 
      from-pink-200/60 via-rose-100/50 to-pink-300/60
      dark:from-[#1a0f14] dark:via-[#2a121c] dark:to-[#14080d]
      backdrop-blur-2xl 
      text-black dark:text-white 
      transition-all duration-500"
    >
      {/* TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold"
      >
        My Orders 📦
      </motion.h1>

      {/* TABLE CONTAINER */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="overflow-x-auto rounded-2xl 
        bg-pink-100/40 dark:bg-pink-500/10 
        backdrop-blur-2xl 
        border border-pink-200/40 dark:border-pink-400/10 
        shadow-[0_8px_32px_rgba(255,105,180,0.2)]"
      >
        <table className="min-w-full text-sm">
          {/* HEADER */}
          <thead className="bg-pink-200/40 dark:bg-pink-500/10 backdrop-blur-md">
            <tr>
              <th className="border p-2 dark:border-zinc-800">Cake</th>
              <th className="border p-2 dark:border-zinc-800">Image</th>
              <th className="border p-2 dark:border-zinc-800">Name</th>
              <th className="border p-2 dark:border-zinc-800">Phone</th>
              <th className="border p-2 dark:border-zinc-800">Email</th>
              <th className="border p-2 dark:border-zinc-800">Size</th>
              <th className="border p-2 dark:border-zinc-800">Flavor</th>
              <th className="border p-2 dark:border-zinc-800">Message</th>
              <th className="border p-2 dark:border-zinc-800">Address</th>
              <th className="border p-2 dark:border-zinc-800">Qty</th>
              <th className="border p-2 dark:border-zinc-800">Price</th>
              <th className="border p-2 dark:border-zinc-800">Total</th>
              <th className="border p-2 dark:border-zinc-800">Delivery</th>
              <th className="border p-2 dark:border-zinc-800">Status</th>
              <th className="border p-2 dark:border-zinc-800">Action</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="text-center hover:bg-pink-200/30 dark:hover:bg-pink-500/10 transition"
                >
                  <td className="border p-2 dark:border-zinc-800">
                    {order.cakeName}
                  </td>

                  <td className="border p-2 dark:border-zinc-800">
                    <img
                      src={order.image}
                      alt="cake"
                      className="w-12 h-12 object-cover mx-auto rounded-lg shadow-md"
                    />
                  </td>

                  <td className="border p-2 dark:border-zinc-800">
                    {order.userName}
                  </td>
                  <td className="border p-2 dark:border-zinc-800">
                    {order.phone}
                  </td>
                  <td className="border p-2 dark:border-zinc-800">
                    {order.userEmail}
                  </td>

                  <td className="border p-2 dark:border-zinc-800">
                    {order.size}
                  </td>
                  <td className="border p-2 dark:border-zinc-800">
                    {order.flavor}
                  </td>

                  <td className="border p-2 text-xs max-w-[120px] dark:border-zinc-800">
                    {order.message}
                  </td>

                  <td className="border p-2 text-xs max-w-[120px] dark:border-zinc-800">
                    {order.address}
                  </td>

                  <td className="border p-2 dark:border-zinc-800">
                    {order.quantity}
                  </td>
                  <td className="border p-2 dark:border-zinc-800">
                    ${order.price}
                  </td>

                  <td className="border p-2 font-bold text-pink-600 dark:text-pink-400 dark:border-zinc-800">
                    ${order.totalPrice}
                  </td>

                  <td className="border p-2 dark:border-zinc-800">
                    {order.deliveryDate}
                  </td>

                  {/* STATUS */}
                  <td className="border p-2 dark:border-zinc-800">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs shadow ${
                        order.status === "pending"
                          ? "bg-yellow-500"
                          : order.status === "processing"
                            ? "bg-blue-500"
                            : order.status === "delivered"
                              ? "bg-green-500"
                              : "bg-red-500"
                      }`}
                    >
                      {order.status || "pending"}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="border p-2 dark:border-zinc-800">
                    <button
                      onClick={() => handleDelete(order._id)}
                      disabled={order.status !== "pending"}
                      className={`px-3 py-1 rounded text-white text-xs transition ${
                        order.status !== "pending"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="14"
                  className="p-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
