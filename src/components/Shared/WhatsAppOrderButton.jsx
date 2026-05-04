"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import Swal from "sweetalert2";

export default function WhatsAppOrderButton({
  cake,
  name,
  phone,
  size,
  flavor,
  qty,
  totalPrice,
  address,
  date,
  message,
}) {
  const btnRef = useRef(null);

  // hover animation
  const handleEnter = () => {
    gsap.to(btnRef.current, {
      scale: 1.05,
      y: -2,
      duration: 0.2,
      ease: "power2.out",
      boxShadow: "0px 12px 30px rgba(34, 197, 94, 0.35)", // green glow
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

  //Click animation
  const handleClickAnim = () => {
    gsap.fromTo(
      btnRef.current,
      { scale: 1 },
      { scale: 0.92, duration: 0.1, yoyo: true, repeat: 1 },
    );
  };

  const handleWhatsAppOrder = () => {
    if (!cake) return;

    if (!name || !phone) {
      Swal.fire({
        icon: "warning",
        title: "Missing Info",
        text: "Please enter your name and phone number",
        confirmButtonColor: "#22c55e",
      });
      return;
    }

    const phoneNumber = "8801717973719";

    const text = `
🍰 *Cake Order Request*

📌 Cake: ${cake.name}
🎂 Size: ${size}
🍫 Flavor: ${flavor}
🔢 Quantity: ${qty}
💰 Total: $${totalPrice}

👤 Name: ${name}
📞 Phone: ${phone}
📍 Address: ${address || "N/A"}
📅 Delivery Date: ${date || "N/A"}

📝 Message: ${message || "None"}
    `;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleClick = () => {
    handleClickAnim();

    setTimeout(() => {
      handleWhatsAppOrder();
    }, 120);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-pink-500 blur-xl opacity-25 rounded-xl pointer-events-none" />

      <button
        ref={btnRef}
        onClick={handleClick}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="
          relative w-full 
         bg-gradient-to-r from-pink-500 to-rose-500 
          text-green-500 py-3 
          rounded-xl font-semibold 
          shadow-lg 
          transition-none
        "
      >
        Order via WhatsApp 💬
      </button>
    </motion.div>
  );
}
