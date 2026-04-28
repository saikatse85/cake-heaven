"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";
import gsap from "gsap";

export default function OrderButton({ cakeId }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // GSAP hover enter
  const handleEnter = () => {
    gsap.to(btnRef.current, {
      scale: 1.07,
      y: -3,
      duration: 0.2,
      ease: "power2.out",
      boxShadow: "0px 10px 25px rgba(236, 72, 153, 0.35)",
    });
  };

  // GSAP hover leave
  const handleLeave = () => {
    gsap.to(btnRef.current, {
      scale: 1,
      y: 0,
      duration: 0.2,
      ease: "power2.out",
      boxShadow: "0px 0px 0px rgba(0,0,0,0)",
    });
  };

  // GSAP click bounce
  const handleClickAnim = () => {
    gsap.fromTo(
      btnRef.current,
      { scale: 1 },
      { scale: 0.92, duration: 0.1, yoyo: true, repeat: 1 },
    );
  };

  const handleOrder = () => {
    handleClickAnim();

    setTimeout(() => {
      if (!user) {
        alert("For Order you need to login first");
        router.push(`/login?redirect=/order/${cakeId}`);
      } else {
        router.push(`/order/${cakeId}`);
      }
    }, 150);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative inline-block w-full"
    >
      {/* Glow background */}
      <div className="absolute inset-0 bg-pink-500 blur-xl opacity-25 rounded-xl pointer-events-none" />

      <Button
        ref={btnRef}
        size="lg"
        onClick={handleOrder}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="
          relative w-full 
          bg-gradient-to-r from-pink-500 to-rose-500 
          hover:from-pink-600 hover:to-rose-600 
          text-white font-semibold 
          rounded-xl 
          transition-none
        "
      >
        Order Now 🍰
      </Button>
    </motion.div>
  );
}
