"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Container from "@/components/Shared/Container";
import { Button } from "@/components/ui/button";
import { Cake } from "lucide-react";
import Link from "next/link";
import OrderNowButton from "@/components/Shared/OrderNowButton";

// 🎨 Theme-aware images
const slides = [
  {
    light: "/images/hero-cake-1-light.jpg",
    dark: "/images/hero-cake-1-dark.jpg",
  },
  {
    light: "/images/hero-cake-2-light.jpg",
    dark: "/images/hero-cake-2-dark.jpg",
  },
  {
    light: "/images/hero-cake-3-light.jpg",
    dark: "/images/hero-cake-3-dark.jpg",
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [theme, setTheme] = useState("light");

  // detect theme (simple version)
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    const observer = new MutationObserver(() => {
      const isDarkNow = document.documentElement.classList.contains("dark");
      setTheme(isDarkNow ? "dark" : "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-pink-50 via-white to-rose-100 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900">
      <Container>
        <section className="relative flex items-center justify-center min-h-[65vh] py-10">
          {/* 🌈 Background Image Slider */}
          <div className="absolute inset-0">
            <AnimatePresence mode="wait">
              <motion.img
                key={index}
                src={
                  theme === "dark" ? slides[index].dark : slides[index].light
                }
                className="w-full h-full object-cover opacity-20 dark:opacity-30"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 1 }}
              />
            </AnimatePresence>
          </div>

          {/* Floating Glow */}
          <div className="absolute inset-0 opacity-30">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute top-10 left-10 w-72 h-72 bg-pink-300 dark:bg-pink-800 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 6, repeat: Infinity, delay: 2 }}
              className="absolute bottom-10 right-10 w-72 h-72 bg-rose-300 dark:bg-rose-800 rounded-full blur-3xl"
            />
          </div>

          {/* Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.2 },
              },
            }}
            className="relative text-center space-y-6"
          >
            {/* Icon */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex justify-center"
            >
              <Cake className="w-12 h-12 text-pink-500" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
            >
              Freshly Baked <span className="text-pink-500">Cakes</span> for
              Every Moment
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 dark:text-gray-300 text-lg md:text-xl"
            >
              Delicious custom cakes made with love. Perfect for birthdays,
              weddings, and special celebrations.
            </motion.p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/cakes">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <OrderNowButton>Order Now</OrderNowButton>
                </motion.div>
              </Link>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="dark:text-white dark:border-zinc-600"
                >
                  View Menu
                </Button>
              </motion.div>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 pt-6">
              {slides.map((_, i) => (
                <motion.div
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`w-2 h-2 rounded-full cursor-pointer ${
                    i === index ? "bg-pink-500" : "bg-gray-400"
                  }`}
                  whileHover={{ scale: 1.3 }}
                />
              ))}
            </div>
          </motion.div>
        </section>
      </Container>
    </div>
  );
}
