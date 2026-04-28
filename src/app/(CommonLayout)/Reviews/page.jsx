"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const reviews = [
  {
    name: "Ayesha",
    text: "Best cake I ever had! Super fresh.",
    rating: 5,
    image: "https://i.pravatar.cc/150?img=32",
  },
  {
    name: "Rahim",
    text: "Delivery was fast and taste amazing.",
    rating: 4,
    image: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Nadia",
    text: "Perfect for my birthday party!",
    rating: 5,
    image: "https://i.pravatar.cc/150?img=47",
  },
];

export default function Reviews() {
  return (
    <section className="py-16 px-6 bg-white dark:bg-zinc-950 text-black dark:text-white">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-3xl font-bold text-center mb-10"
      >
        Happy Customers
      </motion.h2>

      {/* Grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
        className="grid md:grid-cols-3 gap-6"
      >
        {reviews.map((r, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              whileHover={{ y: -10, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Card className="rounded-2xl bg-white dark:bg-zinc-900 border dark:border-zinc-800 hover:shadow-lg transition">
                <CardContent className="p-6 space-y-3">
                  {/* 👤 User Info */}
                  <div className="flex items-center gap-3">
                    <img
                      src={r.image}
                      alt={r.name}
                      className="w-10 h-10 rounded-full object-cover border"
                    />

                    <div>
                      <h4 className="font-semibold text-pink-500 dark:text-pink-400">
                        {r.name}
                      </h4>

                      {/* ⭐ Rating */}
                      <div className="text-yellow-400 text-sm">
                        {"★".repeat(r.rating)}
                        {"☆".repeat(5 - r.rating)}
                      </div>
                    </div>
                  </div>

                  {/* 💬 Review text (unchanged) */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-600 dark:text-gray-300"
                  >
                    {r.text}
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
