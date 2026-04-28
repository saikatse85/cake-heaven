"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-12 text-black dark:text-white">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          About Our Cake Shop 🎂
        </h1>

        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          We create delicious, handcrafted cakes that make every celebration
          special.
        </p>
      </motion.div>

      {/* Image + Description */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="rounded-2xl overflow-hidden shadow-lg"
        >
          <img
            src="/asset/img/cake-shop.jpg"
            alt="About Cake Shop"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-semibold">Our Story</h2>

          <p className="text-gray-600 dark:text-gray-300">
            Our journey started with a passion for baking and a love for
            creating sweet memories. Every cake we make is crafted with care,
            using the finest ingredients to ensure the best taste and quality.
          </p>

          <p className="text-gray-600 dark:text-gray-300">
            From birthdays to weddings, we bring joy to every occasion with our
            custom-designed cakes and delightful flavors.
          </p>
        </motion.div>
      </div>

      {/* Cards */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.2 }}
        className="grid md:grid-cols-3 gap-6"
      >
        {[
          {
            title: "Fresh Ingredients",
            desc: "We use only high-quality and fresh ingredients in every cake.",
          },
          {
            title: "Custom Designs",
            desc: "Unique cake designs tailored for your special occasions.",
          },
          {
            title: "Fast Delivery",
            desc: "Quick and reliable delivery to make your moments stress-free.",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="text-center hover:shadow-lg transition bg-white dark:bg-zinc-900 border dark:border-zinc-800">
              <CardContent className="p-6 space-y-2">
                <h3 className="font-semibold text-lg text-pink-500 dark:text-pink-400">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {item.desc}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
