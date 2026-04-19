"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-100 px-6 py-16">
      {/* Background glow */}
      <div className="absolute inset-0 opacity-30 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-pink-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-rose-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Contact Us 🎂
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Have a question or want to order a custom cake? We’d love to hear
            from you!
          </p>
        </div>

        {/* Main Section */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <Card className="shadow-xl rounded-2xl">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Send a Message</h2>

              <Input placeholder="Your Name" />
              <Input placeholder="Your Email" type="email" />
              <Textarea placeholder="Your Message..." rows={5} />

              <Button className="w-full bg-pink-500 hover:bg-pink-600">
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="hover:shadow-lg transition rounded-2xl">
              <CardContent className="p-6 space-y-2">
                <h3 className="font-semibold text-lg">📍 Address</h3>
                <p className="text-gray-600 text-sm">
                  123 Sweet Street, Cake City, Bangladesh
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition rounded-2xl">
              <CardContent className="p-6 space-y-2">
                <h3 className="font-semibold text-lg">📞 Phone</h3>
                <p className="text-gray-600 text-sm">+880 1234-567890</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition rounded-2xl">
              <CardContent className="p-6 space-y-2">
                <h3 className="font-semibold text-lg">✉️ Email</h3>
                <p className="text-gray-600 text-sm">support@cakeheaven.com</p>
              </CardContent>
            </Card>

            {/* Social Links */}
            <div className="flex gap-4 pt-2 text-gray-600">
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
