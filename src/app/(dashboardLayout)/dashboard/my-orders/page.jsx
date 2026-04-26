"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">All Orders 📦</h1>

      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order._id} className="p-4">
            <CardContent className="space-y-2">
              <h2 className="text-lg font-semibold">{order.cakeName}</h2>

              <p className="text-gray-600">👤 {order.userEmail}</p>

              <p className="text-pink-500 font-bold">💰 ${order.price}</p>

              <p>
                📦 Status:{" "}
                <span className="font-semibold text-yellow-600">
                  {order.status}
                </span>
              </p>

              <p className="text-sm text-gray-400">
                🕒 {new Date(order.createdAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
