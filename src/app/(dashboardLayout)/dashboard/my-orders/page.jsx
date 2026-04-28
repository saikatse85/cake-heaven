"use client";

import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  // Load user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.email) {
      setUserEmail(user.email.trim().toLowerCase());
    }
  }, []);

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

  // Delete
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
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-bold">My Orders 📦</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Cake</th>
              <th className="border p-2">Image</th>

              <th className="border p-2">Name</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Email</th>

              <th className="border p-2">Size</th>
              <th className="border p-2">Flavor</th>
              <th className="border p-2">Message</th>
              <th className="border p-2">Address</th>

              <th className="border p-2">Qty</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Total</th>

              <th className="border p-2">Delivery</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="text-center">
                  <td className="border p-2">{order.cakeName}</td>

                  {/* IMAGE */}
                  <td className="border p-2">
                    <img
                      src={order.image}
                      alt="cake"
                      className="w-12 h-12 object-cover mx-auto rounded"
                    />
                  </td>

                  <td className="border p-2">{order.userName}</td>
                  <td className="border p-2">{order.phone}</td>
                  <td className="border p-2">{order.userEmail}</td>

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

                  <td className="border p-2 font-bold text-pink-500">
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
                      {order.status || "pending"}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="border p-2">
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
                <td colSpan="14" className="p-4 text-center">
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
