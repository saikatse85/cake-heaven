"use client";

import { useEffect, useState } from "react";

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      // Update UI instantly
      setOrders((prev) =>
        prev.map((order) => (order._id === id ? { ...order, status } : order)),
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">All Orders 📦</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">User Email</th>
              <th className="border p-2">Cake Name</th>
              <th className="border p-2">Price ($)</th>

              <th className="border p-2">Status</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Update</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="text-center">
                  <td className="border p-2">{order.userName}</td>
                  <td className="border p-2">{order.phone}</td>
                  <td className="border p-2">{order.userEmail}</td>
                  <td className="border p-2">{order.cakeName}</td>
                  <td className="border p-2">{order.price}</td>

                  {/* STATUS BADGE */}
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
                      {order?.status || "pending"}
                    </span>
                  </td>

                  {/* DATE */}
                  <td className="border p-2">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "N/A"}
                  </td>

                  {/* STATUS DROPDOWN */}
                  <td className="border p-2">
                    <select
                      value={order?.status || "pending"}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="border p-1 rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center">
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
