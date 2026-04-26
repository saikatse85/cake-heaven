"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  // Load user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.email) {
      const email = user.email.trim().toLowerCase();
      setUserEmail(email);
    }
  }, [userEmail]);

  // Fetch orders
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

  // Handle Delete

  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this order?",
    );
    if (!confirmDelete) return;

    try {
      await fetch(`/api/orders/${id}`, {
        method: "DELETE",
      });

      // update UI instantly
      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Orders 📦</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Cake</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Price ($)</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="text-center">
                  <td className="border p-2">{order.userName}</td>
                  <td className="border p-2">{order.phone}</td>
                  <td className="border p-2">{order.cakeName}</td>
                  <td className="border p-2">{order.userEmail}</td>
                  <td className="border p-2">${order.price}</td>

                  {/* ✅ STATUS BADGE */}
                  <td className="border p-2">
                    <span
                      className={`px-2 py-1 rounded text-white ${
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

                  {/* DELETE BUTTON */}
                  <td className="border p-2">
                    <button
                      onClick={() => handleDelete(order._id)}
                      disabled={order.status !== "pending"}
                      className={`px-3 py-1 rounded text-white ${
                        order.status !== "pending"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
