"use client";

import { useRef } from "react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";

export default function OrderNowButton({ children }) {
  const btnRef = useRef(null);

  const handleEnter = () => {
    gsap.to(btnRef.current, {
      scale: 1.08,
      y: -3,
      duration: 0.25,
      ease: "power2.out",
      boxShadow: "0px 10px 30px rgba(236, 72, 153, 0.4)",
    });
  };

  const handleLeave = () => {
    gsap.to(btnRef.current, {
      scale: 1,
      y: 0,
      duration: 0.25,
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
    <div className="relative inline-block">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-pink-500 blur-xl opacity-40 rounded-xl animate-pulse"></div>

      <Button
        ref={btnRef}
        size="lg"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onClick={handleClick}
        className="
          relative 
          bg-gradient-to-r from-pink-500 to-rose-500 
          hover:from-pink-600 hover:to-rose-600 
          text-white px-10 py-6 
          text-lg font-semibold 
          rounded-xl 
          transition-none
        "
      >
        {children}
      </Button>
    </div>
  );
}
