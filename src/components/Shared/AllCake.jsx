"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AllCakeSkeleton } from "./AllCakeSkeleton";
import ViewDetailsButton from "./ViewDetailsButton";

export function AllCakes() {
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cakes")
      .then((res) => res.json())
      .then((data) => {
        setCakes(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <AllCakeSkeleton />;
  }

  return (
    <section className="py-16 px-6 bg-white dark:bg-zinc-950 text-black dark:text-white">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-center mb-10"
      >
        All Featured Cakes
      </motion.h2>

      {/* Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      >
        {cakes?.map((cake) => (
          <motion.div
            key={cake._id}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Card className="group hover:shadow-xl transition rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border dark:border-zinc-800">
                {/* Image with zoom effect */}
                <div className="overflow-hidden">
                  <motion.img
                    src={cake?.image}
                    alt={cake?.name}
                    className="h-48 w-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

                <CardContent className="p-4 space-y-2">
                  <h3 className="font-semibold text-lg text-black dark:text-white">
                    {cake?.name}
                  </h3>

                  <p className="text-gray-500 dark:text-gray-300 text-sm line-clamp-2">
                    {cake?.description}
                  </p>

                  <p className="text-pink-500 font-bold">
                    $ {cake?.price} Only
                  </p>

                  <Link href={`/cakes/${cake._id}`}>
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <ViewDetailsButton>View Details</ViewDetailsButton>
                    </motion.div>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
