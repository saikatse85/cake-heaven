"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

export default function ConfirmOrderButton({ onClick }) {
  const btnRef = useRef(null);

  const handleEnter = () => {
    gsap.to(btnRef.current, {
      scale: 1.05,
      y: -2,
      duration: 0.2,
      ease: "power2.out",
      boxShadow: "0px 12px 30px rgba(236, 72, 153, 0.35)",
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

  const handleClickAnim = () => {
    gsap.fromTo(
      btnRef.current,
      { scale: 1 },
      { scale: 0.92, duration: 0.1, yoyo: true, repeat: 1 },
    );
  };

  const handleClick = () => {
    handleClickAnim();

    setTimeout(() => {
      if (typeof onClick === "function") {
        onClick(); // ✅ SAFE CALL
      }
    }, 120);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full"
    >
      {/* Glow effect (UNCHANGED) */}
      <div className="absolute inset-0 bg-pink-500 blur-xl opacity-25 rounded-xl pointer-events-none" />

      <button
        ref={btnRef}
        onClick={handleClick}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="
          relative w-full 
          bg-gradient-to-r from-pink-500 to-rose-500 
          text-white py-3 
          rounded-xl font-semibold 
          shadow-lg 
          transition-none
        "
      >
        Confirm Order 🚀
      </button>
    </motion.div>
  );
}
