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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">All Orders 📦</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
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
              orders.map((order) => (
                <tr key={order._id} className="text-center">
                  <td className="border p-2">{order.userName}</td>
                  <td className="border p-2">{order.userEmail}</td>
                  <td className="border p-2">{order.phone}</td>

                  <td className="border p-2">{order.cakeName}</td>

                  <td className="border p-2">
                    <img
                      src={order.image}
                      alt="cake"
                      className="w-12 h-12 object-cover mx-auto rounded"
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

                  <td className="border p-2 font-bold text-pink-600">
                    ${order.totalPrice}
                  </td>

                  <td className="border p-2">{order.deliveryDate}</td>

                  {/* STATUS */}
                  <td className="border p-2">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs ${
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
                      className="border p-1 rounded text-xs"
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
                <td colSpan="15" className="p-4 text-center">
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
