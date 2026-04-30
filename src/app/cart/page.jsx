"use client";

import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 text-black dark:text-white">
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6"
      >
        Your Cart 🛒
      </motion.h1>

      {cart.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
      ) : (
        <motion.div
          className="space-y-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {cart.map((item) => (
            <motion.div
              key={item._id}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between p-4 rounded-2xl 
              bg-white/40 dark:bg-zinc-800/40 
              backdrop-blur-lg 
              border border-white/30 dark:border-zinc-700/40 
              shadow-lg"
            >
              {/* LEFT SIDE */}
              <div className="flex items-center gap-4">
                <motion.img
                  src={item.image}
                  className="w-20 h-20 rounded-lg object-cover"
                  alt={item.name}
                  whileHover={{ scale: 1.05 }}
                />

                <div>
                  <h2 className="font-semibold">{item.name}</h2>

                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ৳{item.price} × {item.quantity}
                  </p>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => removeFromCart(item._id)}
                className="text-pink-500 hover:text-pink-600 transition"
              >
                Remove
              </motion.button>
            </motion.div>
          ))}

          {/* TOTAL */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-right mt-6 border-t border-zinc-300/40 dark:border-zinc-700/40 pt-4"
          >
            <h2 className="text-xl font-bold">Total: ৳{total}</h2>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
