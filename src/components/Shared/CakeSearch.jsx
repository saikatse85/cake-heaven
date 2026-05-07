"use client";

import { motion } from "framer-motion";

export default function CakeSearch({ search, setSearch, setCurrentPage }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center mb-8"
    >
      <div className="relative w-full max-w-xl">
        <div
          className="flex items-center gap-2 px-5 py-3 rounded-full 
                     bg-white/20 dark:bg-zinc-900/30 
                     backdrop-blur-xl border border-white/30 shadow-lg"
        >
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-transparent outline-none text-sm placeholder:text-gray-500"
          />

          {/* Animated Eye */}
          <motion.div
            whileHover={{
              scale: 1.3,
              rotate: 10,
            }}
            animate={{
              y: [0, -2, 0],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
            className="cursor-pointer select-none text-gray-500"
          >
            👀
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
