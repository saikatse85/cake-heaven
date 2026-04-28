"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { Button } from "@/components/ui/button";

export default function ViewDetailsButton({ children }) {
  const btnRef = useRef(null);

  const handleEnter = () => {
    gsap.to(btnRef.current, {
      scale: 1.06,
      y: -2,
      duration: 0.2,
      ease: "power2.out",
      boxShadow: "0px 8px 20px rgba(236, 72, 153, 0.25)",
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

  const handleClick = () => {
    gsap.fromTo(
      btnRef.current,
      { scale: 1 },
      { scale: 0.92, duration: 0.1, yoyo: true, repeat: 1 },
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative inline-block w-full"
    >
      {/* ✅ FIXED GLOW (contained inside wrapper) */}
      <div className="absolute inset-0 bg-pink-500 blur-xl opacity-20 rounded-md pointer-events-none" />

      <Button
        ref={btnRef}
        size="lg"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onClick={handleClick}
        className="
          relative w-full 
          bg-gradient-to-r from-pink-500 to-rose-500 
          hover:from-pink-600 hover:to-rose-600 
          text-white font-semibold 
          rounded-md 
          z-10
        "
      >
        {children}
      </Button>
    </motion.div>
  );
}
