"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-pink-50 via-white to-rose-100 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 border-t border-pink-100 dark:border-zinc-800 mt-20 text-black dark:text-white">
      {/* Glow background (animated) */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute -top-10 left-10 w-72 h-72 bg-pink-300 dark:bg-pink-800 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          className="absolute bottom-0 right-10 w-72 h-72 bg-rose-300 dark:bg-rose-800 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-14">
        {/* Top Section */}
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
          className="grid grid-cols-1 md:grid-cols-4 gap-10"
        >
          {/* Brand */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-pink-500 dark:text-pink-400">
                Cake Heaven 🎂
              </h2>

              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Freshly baked cakes made with love. Perfect for every
                celebration.
              </p>

              {/* Social */}
              <div className="flex gap-3 pt-2 text-gray-600 dark:text-gray-300">
                {[FaFacebookF, FaInstagram, FaTwitter].map((Icon, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.2, color: "#ec4899" }}
                    whileTap={{ scale: 0.9 }}
                    className="cursor-pointer"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Links */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <h3 className="font-semibold mb-3">Quick Links</h3>

            <div className="flex flex-col space-y-2 text-sm text-gray-600 dark:text-gray-300">
              {["/", "/cakes", "/about", "/contact"].map((href, i) => (
                <motion.div key={i} whileHover={{ x: 5 }}>
                  <Link
                    href={href}
                    className="hover:text-pink-500 hover:font-bold"
                  >
                    {["Home", "Cakes", "About", "Contact"][i]}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <h3 className="font-semibold mb-3">Services</h3>

            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              {[
                "Birthday Cakes",
                "Wedding Cakes",
                "Custom Orders",
                "Fast Delivery",
              ].map((item, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 5 }}
                  className="cursor-pointer hover:text-pink-500"
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            className="space-y-3"
          >
            <h3 className="font-semibold">Stay Updated</h3>

            <p className="text-sm text-gray-600 dark:text-gray-300">
              Get special offers & sweet deals 🍓
            </p>

            <div className="flex gap-2">
              <Input
                placeholder="Your email"
                className="dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
              />

              <motion.div whileTap={{ scale: 0.95 }}>
                <Button className="bg-pink-500 hover:bg-pink-600">Join</Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 border-t border-pink-100 dark:border-zinc-800 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 dark:text-gray-400 gap-3"
        >
          <p>© {new Date().getFullYear()} Cake Heaven. All rights reserved.</p>

          <div className="flex gap-4">
            {["Privacy", "Terms", "Support"].map((item, i) => (
              <motion.span
                key={i}
                whileHover={{ scale: 1.1, color: "#ec4899" }}
                className="cursor-pointer"
              >
                {item}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
