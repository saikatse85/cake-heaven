"use client";

import { motion } from "framer-motion";

export default function AddToCartButton({ addToCart, cake }) {
  return (
    <motion.div
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <motion.button
        onClick={() => addToCart(cake)}
        className="
          relative overflow-hidden
          py-2 w-full rounded-xl
          font-semibold text-white
          bg-gradient-to-r from-pink-500 via-pink-600 to-rose-500
          shadow-lg shadow-pink-500/30
          border border-pink-400/30
          transition-all duration-300
        "
        whileHover={{
          boxShadow: "0px 0px 25px rgba(236, 72, 153, 0.6)",
        }}
      >
        {/* shine effect */}
        <span className="absolute inset-0 bg-white/10 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />

        <span className="relative flex items-center justify-center gap-2">
          Add to Cart 🛒
        </span>
      </motion.button>
    </motion.div>
  );
}
