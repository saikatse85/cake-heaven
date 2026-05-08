"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";
import Swal from "sweetalert2";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // validate email
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubscribe = async () => {
    if (!email) {
      return Swal.fire({
        icon: "warning",
        title: "Email required",
        text: "Please enter your email",
      });
    }

    if (!isValidEmail(email)) {
      return Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address",
      });
    }

    setLoading(true);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Subscribed!",
          text: "Check your email for special offers 🎉",
          timer: 2000,
          showConfirmButton: false,
        });

        setEmail("");
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: data.message || "Something went wrong",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-pink-50 via-white to-rose-100 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 border-t border-pink-100 dark:border-zinc-800 mt-20 text-black dark:text-white">
      <div className="absolute inset-0 overflow-hidden opacity-30"></div>

      <div className="relative max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-pink-500">
              Desert Heaven 🎂
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Freshly baked Desert made with love.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <div className="flex flex-col space-y-2 text-sm">
              {["/", "/cakes", "/about", "/contact"].map((href, i) => (
                <Link key={i} href={href}>
                  {["Home", "Cakes", "About", "Contact"][i]}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-3">Services</h3>
            <ul className="text-sm space-y-2">
              <li>Birthday Cakes</li>
              <li>Wedding Cakes</li>
              <li>Custom Orders</li>
              <li>Fast Delivery</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h3 className="font-semibold">Stay Updated</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Get special offers & sweet deals 🍓
            </p>

            {/* ONLY UPDATED PART */}
            <div className="flex gap-2">
              <Input
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
              />

              <Button
                onClick={handleSubscribe}
                disabled={loading}
                className="bg-pink-500 hover:bg-pink-600"
              >
                {loading ? "..." : "Join"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
