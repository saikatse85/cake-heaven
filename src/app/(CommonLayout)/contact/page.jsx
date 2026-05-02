"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { useState } from "react";
import Swal from "sweetalert2";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    const { name, email, phone, message } = form;

    // validation
    if (!name || !email || !phone || !message) {
      setError("All fields are required");
      return;
    }

    // BD phone validation
    if (!/^01[3-9]\d{8}$/.test(phone)) {
      setError("Enter valid Bangladeshi phone number");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Message sent successfully");
        setForm({ name: "", email: "", phone: "", message: "" });

        Swal.fire({
          icon: "success",
          title: "Sent!",
          text: "Message sent successfully 🎉",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        setError(data.error || "Something went wrong");
        Swal.fire("Error", data.error || "Something went wrong", "error");
      }
    } catch (err) {
      setError("Network error");
      Swal.fire("Error", "Network error", "error");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-100 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 px-6 py-16 text-black dark:text-white">
      <div className="relative max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold">Contact Us 🎂</h1>

          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Have a question or want to order a custom cake? We’d love to hear
            from you!
          </p>
        </motion.div>

        {/* Main Section */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <Card className="shadow-xl rounded-2xl bg-white dark:bg-zinc-900 border dark:border-zinc-800">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Send a Message</h2>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}

              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
              />

              <Input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                type="email"
              />

              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="📞 Phone : +8801xxxxxxxxx"
                type="text"
              />

              <Textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your Message..."
                rows={5}
              />

              <Button
                onClick={handleSubmit}
                className="w-full bg-pink-500 hover:bg-pink-600"
              >
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Contact Info (UNCHANGED) */}
          <div className="space-y-6">
            {[
              {
                title: "📍 Address",
                text: "Dhumkhatia, Mahigonj, Rangpur, Bangladesh",
              },
              { title: "📞 Phone", text: "+880 1717-973719" },
              { title: "✉️ Email", text: "saikatse@gmail.com" },
            ].map((item, i) => (
              <Card
                key={i}
                className="bg-white dark:bg-zinc-900 border dark:border-zinc-800"
              >
                <CardContent className="p-6">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {item.text}
                  </p>
                </CardContent>
              </Card>
            ))}

            {/* Social */}
            <div className="flex gap-4 text-gray-600 dark:text-gray-300">
              <FaFacebookF className="cursor-pointer" />
              <FaInstagram className="cursor-pointer" />
              <FaTwitter className="cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
