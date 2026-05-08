"use client";

import { motion } from "framer-motion";
import { useDiscount } from "@/context/DiscountContext";
import { useRouter } from "next/navigation";

export default function PromoModal({ open, onClose }) {
  const { setDiscount } = useDiscount();
  const router = useRouter();

  if (!open) return null;

  const applyDiscount = () => {
    setDiscount(20); // 🎯 20% discount applied
    onClose();
    router.push("/cakes");
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-[90%] max-w-md p-6 rounded-2xl 
        bg-white/20 backdrop-blur-xl border border-white/30 
        shadow-xl text-center text-white"
      >
        <h2 className="text-2xl font-bold">🎉 20% OFF Activated!</h2>
        <p className="mt-2 text-sm text-white/80">
          First order discount is ready for you.
        </p>

        <div className="flex gap-3 mt-6 justify-center">
          <button
            onClick={applyDiscount}
            className="px-4 py-2 bg-pink-500 rounded-lg"
          >
            Use Discount
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/30 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
