"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AllOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/all-orders")
      .then((res) => res.json())
      .then((data) => setOrders(data || []));
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      setOrders((prev) =>
        prev.map((order) => (order._id === id ? { ...order, status } : order)),
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <div
      className="p-6 min-h-screen 
      bg-gradient-to-br 
      from-pink-200/60 via-rose-100/50 to-pink-300/60
      dark:from-[#1a0f14] dark:via-[#2a121c] dark:to-[#14080d]
      backdrop-blur-2xl transition-all duration-500"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-4 text-gray-800 dark:text-white"
      >
        All Orders 📦
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="overflow-x-auto rounded-2xl 
        bg-pink-100/40 dark:bg-pink-500/10 
        backdrop-blur-2xl 
        border border-pink-200/40 dark:border-pink-400/10 
        shadow-[0_8px_32px_rgba(255,105,180,0.2)]"
      >
        <table className="min-w-full text-sm text-gray-800 dark:text-gray-200">
          <thead className="bg-pink-200/40 dark:bg-pink-500/10 backdrop-blur-md">
            <tr>
              <th className="border p-2">Customer</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>

              <th className="border p-2">Cake</th>
              <th className="border p-2">Image</th>

              <th className="border p-2">Size</th>
              <th className="border p-2">Flavor</th>
              <th className="border p-2">Message</th>
              <th className="border p-2">Address</th>

              <th className="border p-2">Qty</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Total</th>

              <th className="border p-2">Delivery</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Created</th>
              <th className="border p-2">Update</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="text-center hover:bg-pink-200/30 dark:hover:bg-pink-500/10 transition"
                >
                  <td className="border p-2">{order.userName}</td>
                  <td className="border p-2">{order.userEmail}</td>
                  <td className="border p-2">{order.phone}</td>

                  <td className="border p-2">{order.cakeName}</td>

                  <td className="border p-2">
                    <img
                      src={order.image}
                      alt="cake"
                      className="w-12 h-12 object-cover mx-auto rounded-lg shadow-md"
                    />
                  </td>

                  <td className="border p-2">{order.size}</td>
                  <td className="border p-2">{order.flavor}</td>

                  <td className="border p-2 text-xs max-w-[120px]">
                    {order.message}
                  </td>
                  <td className="border p-2 text-xs max-w-[120px]">
                    {order.address}
                  </td>

                  <td className="border p-2">{order.quantity}</td>
                  <td className="border p-2">${order.price}</td>

                  <td className="border p-2 font-bold text-pink-600 dark:text-pink-400">
                    ${order.totalPrice}
                  </td>

                  <td className="border p-2">{order.deliveryDate}</td>

                  {/* STATUS */}
                  <td className="border p-2">
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
                      {order.status}
                    </span>
                  </td>

                  {/* CREATED */}
                  <td className="border p-2 text-xs">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "N/A"}
                  </td>

                  {/* UPDATE */}
                  <td className="border p-2">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="border p-1 rounded text-xs 
                      bg-pink-100/60 dark:bg-pink-500/10 
                      backdrop-blur-md"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="15"
                  className="p-4 text-center text-gray-600 dark:text-gray-300"
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
