"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);

  // 📡 Fetch from MongoDB
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/reviews");
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReviews();
  }, []);

  return (
    <section className="py-16 px-6 bg-white dark:bg-zinc-950 text-black dark:text-white overflow-hidden">
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

      {/* MARQUEE */}
      <div className="w-full overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap gap-6"
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 25,
            ease: "linear",
          }}
        >
          {/* duplicate for smooth loop */}
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-6">
              {reviews.map((r) => (
                <Card
                  key={r._id + i}
                  className="min-w-[400px] rounded-2xl bg-white dark:bg-zinc-900 border dark:border-zinc-800 shadow-md"
                >
                  <CardContent className="p-6 space-y-4">
                    {/* 👤 User */}
                    <div className="flex items-center gap-3">
                      <img
                        src={r.photo || "https://i.pravatar.cc/150"}
                        alt={r.userName}
                        className="w-10 h-10 rounded-full object-cover border"
                      />

                      <div>
                        <h4 className="font-semibold text-pink-500 dark:text-pink-400">
                          {r.userName}
                        </h4>

                        {/* ⭐ Rating */}
                        <div className="text-yellow-400 text-sm">
                          {"★".repeat(r.rating)}
                          {"☆".repeat(5 - r.rating)}
                        </div>
                      </div>
                    </div>

                    {/* 💬 Comment */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {r.comment}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
