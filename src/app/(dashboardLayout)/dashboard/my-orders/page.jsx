"use client";

import { useEffect, useState } from "react";

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
    const confirmDelete = confirm(
      "Are you sure you want to delete this order?",
    );
    if (!confirmDelete) return;

    try {
      await fetch(`/api/orders/${id}`, { method: "DELETE" });

      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="space-y-6 p-4 min-h-screen bg-white dark:bg-zinc-950 text-black dark:text-white">
      <h1 className="text-3xl font-bold">My Orders 📦</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 dark:border-zinc-800 text-sm">
          {/* HEADER */}
          <thead className="bg-gray-100 dark:bg-zinc-900">
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
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="text-center hover:bg-gray-50 dark:hover:bg-zinc-900/60"
                >
                  <td className="border p-2 dark:border-zinc-800">
                    {order.cakeName}
                  </td>

                  <td className="border p-2 dark:border-zinc-800">
                    <img
                      src={order.image}
                      alt="cake"
                      className="w-12 h-12 object-cover mx-auto rounded"
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

                  <td className="border p-2 font-bold text-pink-500 dark:border-zinc-800">
                    ${order.totalPrice}
                  </td>

                  <td className="border p-2 dark:border-zinc-800">
                    {order.deliveryDate}
                  </td>

                  {/* STATUS */}
                  <td className="border p-2 dark:border-zinc-800">
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
                      {order.status || "pending"}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="border p-2 dark:border-zinc-800">
                    <button
                      onClick={() => handleDelete(order._id)}
                      disabled={order.status !== "pending"}
                      className={`px-3 py-1 rounded text-white text-xs ${
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
      </div>
    </div>
  );
}
