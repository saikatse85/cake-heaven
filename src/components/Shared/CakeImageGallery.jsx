"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ─── Drop-in replacement for the image block in CakeDetailsClient ───────────
// Usage: <CakeImageGallery cake={cake} />
//
// • If cake.images[] exists, uses that array as thumbnails.
// • Falls back to repeating cake.image 4x so the UI is never empty.

export default function CakeImageGallery({ cake }) {
  // Build a stable images array
  const images =
    cake?.images?.length > 0
      ? cake.images
      : Array(4).fill(cake?.image).filter(Boolean);

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  const goTo = (index) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const prev = () => {
    const newIndex = (activeIndex - 1 + images.length) % images.length;
    setDirection(-1);
    setActiveIndex(newIndex);
  };

  const next = () => {
    const newIndex = (activeIndex + 1) % images.length;
    setDirection(1);
    setActiveIndex(newIndex);
  };

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40, scale: 0.97 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40, scale: 0.97 }),
  };

  if (!images.length) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-100 text-gray-400 rounded-xl">
        No Image
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 select-none">
      {/* ── Main Image ─────────────────────────────────────────── */}
      <Card className="overflow-hidden rounded-2xl border border-pink-100 dark:border-zinc-700 shadow-md bg-white dark:bg-zinc-900">
        <div className="relative w-full h-80 md:h-96">
          <AnimatePresence custom={direction} mode="wait">
            <motion.img
              key={activeIndex}
              src={images[activeIndex]}
              alt={`${cake?.name} - view ${activeIndex + 1}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Gradient overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-b-2xl" />

          {/* Dot indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`transition-all duration-200 rounded-full ${
                  i === activeIndex
                    ? "w-5 h-2 bg-pink-500"
                    : "w-2 h-2 bg-white/70 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* ── Thumbnail Strip ────────────────────────────────────── */}
      <div className="relative flex items-center gap-2">
        {/* Prev Arrow */}
        <button
          onClick={prev}
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm hover:bg-pink-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Thumbnails */}
        <div className="flex gap-2 overflow-x-auto flex-1 scrollbar-hide py-1">
          {images.map((src, i) => (
            <motion.button
              key={i}
              onClick={() => goTo(i)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                i === activeIndex
                  ? "border-pink-500 shadow-md shadow-pink-200 dark:shadow-pink-900"
                  : "border-transparent hover:border-pink-300 opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={src}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.button>
          ))}
        </div>

        {/* Next Arrow */}
        <button
          onClick={next}
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm hover:bg-pink-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
}
