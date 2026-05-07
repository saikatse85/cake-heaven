"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import OrderDetailsModal from "@/components/Shared/OrderDetailsModal";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

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

    await fetch(`/api/orders/${id}`, { method: "DELETE" });

    setOrders((prev) => prev.filter((o) => o._id !== id));

    Swal.fire({
      icon: "success",
      title: "Deleted!",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <div className="space-y-6 p-4 min-h-screen bg-gradient-to-br from-pink-200/60 via-rose-100/50 to-pink-300/60 dark:from-[#1a0f14] dark:via-[#2a121c] dark:to-[#14080d] text-black dark:text-white">
      <h1 className="text-3xl font-bold">My Orders 📦</h1>

      <motion.div className="overflow-x-auto rounded-2xl bg-pink-100/40 dark:bg-pink-500/10 backdrop-blur-2xl border border-pink-200/40 dark:border-pink-400/10 shadow-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-pink-200/40 dark:bg-pink-500/10">
            <tr>
              <th className="border p-2">Image</th>
              <th className="border p-2">Cake</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, i) => {
              // ✅ ONLY ADDED LOGIC (no design change)
              const isDeletable = order.status === "pending";

              return (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="text-center"
                >
                  <td className="border p-2">
                    {order.image ? (
                      <img
                        src={order.image}
                        alt="cake"
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">N/A</span>
                    )}
                  </td>

                  <td className="border p-2">{order.cakeName}</td>
                  <td className="border p-2">{order.quantity}</td>

                  <td className="border p-2 text-pink-500 font-bold">
                    ${order.totalPrice}
                  </td>

                  <td className="border p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold text-white shadow ${
                        order.status === "pending"
                          ? "bg-yellow-500"
                          : order.status === "processing"
                            ? "bg-blue-500"
                            : order.status === "confirmed"
                              ? "bg-purple-500"
                              : order.status === "out-for-delivery"
                                ? "bg-indigo-500"
                                : order.status === "delivered"
                                  ? "bg-green-500"
                                  : order.status === "cancelled"
                                    ? "bg-red-500"
                                    : "bg-gray-500"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="border p-2 flex gap-2 justify-center">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
                    >
                      Details
                    </button>

                    {/* ✅ ONLY LOGIC UPDATED HERE */}
                    <button
                      onClick={() => handleDelete(order._id)}
                      disabled={!isDeletable}
                      className={`px-3 py-1 text-white rounded text-xs ${
                        isDeletable
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>

      {/* MODAL */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
