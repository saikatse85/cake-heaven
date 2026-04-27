"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function OrderPage() {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [cake, setCake] = useState(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

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
    if (!name || !phone) {
      alert("Please enter name and phone number");
      return;
    }

    if (phone.length < 11) {
      alert("Invalid phone number");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
      return;
    }
    const orderData = {
      userEmail: user.email,
      userName: name,
      phone: phone,
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
      router.push("/dashboard/my-orders");
    }
  };

  if (!cake) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto py-12 px-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 space-y-7 border">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">
            Confirm Your Order 🎂
          </h1>
          <p className="text-gray-500 text-sm">
            Please review your order before placing it
          </p>
        </div>

        {/* Cake Info */}
        <div className="bg-pink-50 rounded-xl p-5 border flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">{cake.name}</h2>
          <p className="text-pink-600 text-2xl font-bold">${cake.price}</p>
        </div>

        {/* Info Box */}
        <div className="bg-gray-50 border rounded-xl p-4 text-sm text-gray-600">
          <p className="font-medium mb-2">📦 Order Details:</p>
          <ul className="space-y-1 list-disc ml-5">
            <li>Customer Name</li>
            <li>Mobile Number</li>
            <li>Email Address</li>
          </ul>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-pink-400 transition"
          />

          <input
            type="text"
            placeholder="Enter mobile number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-pink-400 transition"
          />
        </div>

        {/* Button */}
        <button
          onClick={createOrder}
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition"
        >
          Confirm Order 🚀
        </button>

        {/* Footer */}
        <p className="text-xs text-center text-gray-400">
          By confirming, you agree to our terms & delivery policy.
        </p>
      </div>
    </div>
  );
}
