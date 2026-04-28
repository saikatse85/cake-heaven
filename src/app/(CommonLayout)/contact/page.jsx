"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-100 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 px-6 py-16 text-black dark:text-white">
      {/* Background glow */}
      <div className="absolute inset-0 opacity-30 overflow-hidden">
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

      <div className="relative max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Contact Us 🎂
          </h1>

          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Have a question or want to order a custom cake? We’d love to hear
            from you!
          </p>
        </motion.div>

        {/* Main Section */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="shadow-xl rounded-2xl bg-white dark:bg-zinc-900 border dark:border-zinc-800">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">Send a Message</h2>

                <Input
                  placeholder="Your Name"
                  className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                />
                <Input
                  placeholder="Your Email"
                  type="email"
                  className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                />
                <Textarea
                  placeholder="Your Message..."
                  rows={5}
                  className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                />

                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button className="w-full bg-pink-500 hover:bg-pink-600">
                    Send Message
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.2 }}
            className="space-y-6"
          >
            {[
              {
                title: "📍 Address",
                text: "123 Sweet Street, Cake City, Bangladesh",
              },
              { title: "📞 Phone", text: "+880 1234-567890" },
              { title: "✉️ Email", text: "support@cakeheaven.com" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="hover:shadow-lg transition rounded-2xl bg-white dark:bg-zinc-900 border dark:border-zinc-800">
                  <CardContent className="p-6 space-y-2">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {item.text}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Social Icons */}
            <motion.div
              className="flex gap-4 pt-2 text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
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
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
