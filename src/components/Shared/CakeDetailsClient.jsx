"use client";

import { motion } from "framer-motion";
import OrderButton from "@/components/Shared/OrderButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import OrderNowButton from "./OrderNowButton";

export default function CakeDetailsClient({ cake, relatedCakes }) {
  if (!cake) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-10 text-center text-black dark:text-white"
      >
        <h2 className="text-xl font-bold">Cake not found</h2>
        <Link href="/cakes">
          <Button className="mt-4">Back to Cakes</Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8 text-black dark:text-white">
      {/* Back Button */}
      <motion.div whileHover={{ x: -5 }}>
        <Link href="/cakes">
          <Button variant="outline">← Back to Items</Button>
        </Link>
      </motion.div>

      {/* Main Section */}
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border dark:border-zinc-800">
            <motion.img
              src={cake.image}
              alt={cake.name}
              className="w-full h-80 object-cover"
              whileHover={{ scale: 1.05 }}
            />
          </Card>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <h1 className="text-3xl font-bold">{cake.name}</h1>

          <p className="text-gray-600 dark:text-gray-300">{cake.description}</p>

          <motion.p
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-pink-500 text-2xl font-bold"
          >
            Price : $ {cake.price}
          </motion.p>

          <div className="flex gap-2 text-sm">
            <span className="px-3 py-1 bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-400 rounded-full">
              {cake.category}
            </span>

            <span className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 dark:text-gray-300 rounded-full">
              {cake.createdAt}
            </span>
          </div>

          <motion.div whileTap={{ scale: 0.95 }}>
            <OrderButton cakeId={cake._id} />
          </motion.div>
        </motion.div>
      </div>

      {/* Specifications */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Card className="bg-white dark:bg-zinc-900 border dark:border-zinc-800">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-xl font-semibold">Specifications</h2>

            <ul className="text-gray-600 dark:text-gray-300 space-y-1">
              <li>Size: {cake.specs?.size}</li>
              <li>Flavor: {cake.specs?.flavor}</li>
              <li>Serving: {cake.specs?.serving}</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Related Cakes */}
      {relatedCakes.length > 0 && (
        <div className="space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold"
          >
            Related Cakes 🎂
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.15 },
              },
            }}
            className="grid sm:grid-cols-2 md:grid-cols-4 gap-6"
          >
            {relatedCakes.map((item) => (
              <motion.div
                key={item._id}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -8 }}
              >
                <Card className="overflow-hidden rounded-xl bg-white dark:bg-zinc-900 border dark:border-zinc-800">
                  <motion.img
                    src={item.image}
                    className="w-full h-40 object-cover"
                    whileHover={{ scale: 1.1 }}
                  />

                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-pink-500 font-bold">${item.price}</p>

                    <Link href={`/cakes/${item._id}`}>
                      <Button size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}
