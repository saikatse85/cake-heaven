"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/button";

export default function OrderPage() {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [cake, setCake] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsubscribe();
  }, []);

  // fetch cake
  useEffect(() => {
    fetch(`/api/cakes/${id}`)
      .then((res) => res.json())
      .then((data) => setCake(data));
  }, [id]);

  const createOrder = async () => {
    const orderData = {
      userEmail: user.email,
      cakeId: cake._id,
      cakeName: cake.name,
      price: cake.price,
      status: "pending",
      createdAt: new Date(),
    };

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (res.ok) {
      alert("Order placed successfully 🎉");
      router.push("/dashboard");
    }
  };

  if (!cake) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto py-10 space-y-4">
      <h1 className="text-2xl font-bold">Confirm Order</h1>

      <h2 className="text-lg">{cake.name}</h2>
      <p className="text-pink-500">${cake.price}</p>

      <Button
        onClick={createOrder}
        className="bg-pink-500 hover:bg-pink-600 w-full"
      >
        Confirm Order
      </Button>
    </div>
  );
}
