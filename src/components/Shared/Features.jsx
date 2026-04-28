"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Truck, Sparkles } from "lucide-react";
import Container from "./Container";

const features = [
  { icon: Heart, title: "Made with Love", desc: "Every cake is handcrafted." },
  { icon: Truck, title: "Fast Delivery", desc: "Fresh cakes delivered fast." },
  {
    icon: Sparkles,
    title: "Premium Quality",
    desc: "Only best ingredients used.",
  },
];

export function Features() {
  return (
    <section className="py-16 px-6 bg-pink-50 dark:bg-zinc-950">
      <Container>
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-10 text-black dark:text-white"
        >
          Why Choose Us
        </motion.h2>

        {/* Grid with stagger */}
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
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                whileHover={{ y: -10, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Card className="text-center p-6 bg-white dark:bg-zinc-900 border dark:border-zinc-800 hover:shadow-xl transition">
                  <CardContent className="space-y-3">
                    {/* Icon animation */}
                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <f.icon className="mx-auto text-pink-500 w-10 h-10" />
                    </motion.div>

                    <h3 className="font-semibold text-lg text-black dark:text-white">
                      {f.title}
                    </h3>

                    <p className="text-gray-500 dark:text-gray-300 text-sm">
                      {f.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
