"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PromoBanner() {
  return (
    <section className="py-6 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative overflow-hidden bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-2xl p-10 text-center space-y-4 shadow-lg"
      >
        {/* Animated glow background */}
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-20 bg-gradient-to-r from-white/30 to-transparent"
        />

        {/* Content */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold relative z-10"
        >
          Get 20% Off Your First Order 🎂
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="text-white/90 relative z-10"
        >
          Celebrate your moments with delicious handmade cakes.
        </motion.p>

        <Link href={"/cakes"}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative z-10 inline-block"
          >
            <Button className="bg-white text-pink-600 hover:bg-gray-100">
              Order Now
            </Button>
          </motion.div>
        </Link>
      </motion.div>
    </section>
  );
}
