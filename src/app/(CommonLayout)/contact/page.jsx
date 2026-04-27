"use client";

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
        <div className="absolute top-10 left-10 w-72 h-72 bg-pink-300 dark:bg-pink-800 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-rose-300 dark:bg-rose-800 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Contact Us 🎂
          </h1>

          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Have a question or want to order a custom cake? We’d love to hear
            from you!
          </p>
        </div>

        {/* Main Section */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Form */}
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

              <Button className="w-full bg-pink-500 hover:bg-pink-600">
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="hover:shadow-lg transition rounded-2xl bg-white dark:bg-zinc-900 border dark:border-zinc-800">
              <CardContent className="p-6 space-y-2">
                <h3 className="font-semibold text-lg">📍 Address</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  123 Sweet Street, Cake City, Bangladesh
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition rounded-2xl bg-white dark:bg-zinc-900 border dark:border-zinc-800">
              <CardContent className="p-6 space-y-2">
                <h3 className="font-semibold text-lg">📞 Phone</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  +880 1234-567890
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition rounded-2xl bg-white dark:bg-zinc-900 border dark:border-zinc-800">
              <CardContent className="p-6 space-y-2">
                <h3 className="font-semibold text-lg">✉️ Email</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  support@cakeheaven.com
                </p>
              </CardContent>
            </Card>

            {/* Social Links */}
            <div className="flex gap-4 pt-2 text-gray-600 dark:text-gray-300">
              <FaFacebookF className="w-5 h-5 hover:text-pink-500 cursor-pointer transition" />
              <FaInstagram className="w-5 h-5 hover:text-pink-500 cursor-pointer transition" />
              <FaTwitter className="w-5 h-5 hover:text-pink-500 cursor-pointer transition" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
