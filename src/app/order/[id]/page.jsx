"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import ConfirmOrderButton from "@/components/Shared/ConfirmOrderButton";
import { motion } from "framer-motion";
import gsap from "gsap";
import Swal from "sweetalert2";
import Loading from "@/app/loading";

export default function OrderPage() {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [cake, setCake] = useState(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [size, setSize] = useState("Small");
  const [flavor, setFlavor] = useState("Chocolate");
  const [message, setMessage] = useState("");
  const [address, setAddress] = useState("");
  const [qty, setQty] = useState(1);
  const [date, setDate] = useState("");

  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const cardRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetch(`/api/cakes/${id}`)
      .then((res) => res.json())
      .then((data) => setCake(data));
  }, [id]);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" },
      );
    }
  }, [cake]);

  const totalPrice = cake ? cake.price * qty : 0;

  const createOrder = async () => {
    if (!name || !phone || !date) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill all required fields",
        confirmButtonColor: "#ec4899",
      });
      return;
    }

    if (!/^\d{11,}$/.test(phone)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Phone Number",
        text: "Phone number must be at least 11 digits",
        confirmButtonColor: "#ec4899",
      });
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      Swal.fire({
        icon: "info",
        title: "Login Required",
        text: "You need to login first",
        confirmButtonColor: "#ec4899",
      });
      router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    const orderData = {
      userEmail: user.email,
      userName: name,
      phone,
      cakeId: cake._id,
      cakeName: cake.name,
      image: cake.image,
      size,
      flavor,
      message,
      address,
      quantity: qty,
      price: cake.price,
      totalPrice,
      deliveryDate: date,
      status: "pending",
      createdAt: new Date(),
    };

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "Order Placed successfully 🎉",
        text: "Your cake order has been successfully placed!",
        confirmButtonColor: "#ec4899",
      });
      router.push("/dashboard/my-orders");
    } else {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Something went wrong. Try again!",
      });
    }
  };

  if (!cake)
    return (
      <div className="min-h-screen flex items-center justify-center text-black dark:text-white bg-white dark:bg-zinc-950">
        <Loading />
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-white dark:bg-zinc-950 text-black dark:text-white">
      <motion.div ref={cardRef} className="w-full max-w-xl">
        <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 p-8 rounded-2xl space-y-5">
          {/* 🍰 Cake Image */}
          <img
            src={cake.image}
            className="w-full h-56 object-cover rounded-xl"
          />

          {/* Name + Price */}
          <div className="flex justify-between">
            <h2 className="text-xl font-bold">{cake.name}</h2>
            <p className="text-pink-500 font-bold">${cake.price}</p>
          </div>

          {/* Selects */}
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full p-2 rounded border bg-white dark:bg-zinc-800 dark:border-zinc-700"
          >
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
          </select>

          <select
            value={flavor}
            onChange={(e) => setFlavor(e.target.value)}
            className="w-full p-2 rounded border bg-white dark:bg-zinc-800 dark:border-zinc-700"
          >
            <option>Chocolate</option>
            <option>Vanilla</option>
            <option>Strawberry</option>
          </select>

          {/* Message */}
          <textarea
            placeholder="Custom message on cake"
            value={message}
            required
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 rounded border bg-white dark:bg-zinc-800 dark:border-zinc-700"
          />
          {/* Address */}
          <textarea
            placeholder="Customer Address"
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 rounded border bg-white dark:bg-zinc-800 dark:border-zinc-700"
          />

          {/* Quantity */}
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 border rounded dark:border-zinc-700"
              onClick={() => setQty(Math.max(1, qty - 1))}
            >
              -
            </button>

            <span>{qty}</span>

            <button
              className="px-3 py-1 border rounded dark:border-zinc-700"
              onClick={() => setQty(qty + 1)}
            >
              +
            </button>
          </div>

          {/* Date */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 rounded border bg-white dark:bg-zinc-800 dark:border-zinc-700"
          />

          {/* Contact */}
          <input
            placeholder="Name"
            required
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded border bg-white dark:bg-zinc-800 dark:border-zinc-700"
          />

          <input
            placeholder="Phone"
            required
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 rounded border bg-white dark:bg-zinc-800 dark:border-zinc-700"
          />

          {/* 💰 Total */}
          <div className="text-lg font-bold text-pink-500">
            Total: ${totalPrice}
          </div>

          {/* Button */}
          <ConfirmOrderButton onClick={createOrder}>
            Confirm Order 🚀
          </ConfirmOrderButton>
        </div>
      </motion.div>
    </div>
  );
}
