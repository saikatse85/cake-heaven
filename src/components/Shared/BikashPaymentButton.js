"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import Swal from "sweetalert2";

export default function BkashPaymentButton({ totalPrice }) {
  const btnRef = useRef(null);

  // Hover animation
  const handleEnter = () => {
    gsap.to(btnRef.current, {
      scale: 1.05,
      y: -2,
      duration: 0.2,
      ease: "power2.out",
      boxShadow: "0px 12px 30px rgba(226, 62, 140, 0.35)", // bKash pink glow
    });
  };

  const handleLeave = () => {
    gsap.to(btnRef.current, {
      scale: 1,
      y: 0,
      duration: 0.2,
      ease: "power2.out",
      boxShadow: "0px 0px 0px rgba(0,0,0,0)",
    });
  };

  // 👇 Click animation
  const handleClickAnim = () => {
    gsap.fromTo(
      btnRef.current,
      { scale: 1 },
      { scale: 0.92, duration: 0.1, yoyo: true, repeat: 1 }
    );
  };

  // 💳 Payment logic
  const handleBkashPayment = async () => {
  try {
    const res = await fetch("/api/bkash/create-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: totalPrice }),
    });

    const data = await res.json();

    console.log("BKASH RESPONSE:", data); // 🔍 DEBUG

    if (data?.bkashURL) {
      window.location.href = data.bkashURL;
    } else {
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: data?.message || "bKash did not return a payment URL",
      });
    }
  } catch (error) {
    console.error(error);

    Swal.fire({
      icon: "error",
      title: "Server Error",
      text: "Unable to initiate bKash payment",
    });
  }
};

  const handleClick = () => {
    handleClickAnim();

    setTimeout(() => {
      handleBkashPayment();
    }, 120);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full"
    >
      {/* 💖 Glow effect (bKash style) */}
      <div className="absolute inset-0 bg-pink-600 blur-xl opacity-25 rounded-xl pointer-events-none" />

      <button
        ref={btnRef}
        onClick={handleClick}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="
          relative w-full 
          bg-gradient-to-r from-pink-600 to-pink-500 
          text-white py-3 
          rounded-xl font-semibold 
          shadow-lg 
          transition-none
        "
      >
        Pay with bKash 💳
      </button>
    </motion.div>
  );
}