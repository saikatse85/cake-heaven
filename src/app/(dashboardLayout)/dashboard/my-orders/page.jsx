"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  // Load user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    console.log("🔵 LOCALSTORAGE USER:", user);

    if (user?.email) {
      const email = user.email.trim().toLowerCase();
      setUserEmail(email);
    }
    console.log("🟡 USER EMAIL STATE:", userEmail);
  }, [userEmail]);

  // Fetch orders
  useEffect(() => {
    if (!userEmail) return;
    console.log("🟠 FETCHING ORDERS FOR:", userEmail);

    const loadOrders = async () => {
      const res = await fetch(`/api/orders?email=${userEmail}`);
      const data = await res.json();
      console.log("🟢 API RESPONSE:", data);
      setOrders(data);
    };

    loadOrders();
  }, [userEmail]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Orders 📦</h1>

      <div className="grid gap-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <Card key={order._id} className="p-4">
              <CardContent>
                <h2 className="font-bold">{order.cakeName}</h2>
                <p>{order.userEmail}</p>
                <p>${order.price}</p>
                <p>Status: {order.status}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No orders found</p>
        )}
      </div>
    </div>
  );
}
