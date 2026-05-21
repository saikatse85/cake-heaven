"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      return setError("Email is required");
    }

    if (!isValidEmail(email)) {
      return setError("Please enter a valid email address");
    }

    try {
      setLoading(true);

      //Firebase password reset
      await sendPasswordResetEmail(auth, email);

      Swal.fire({
        icon: "success",
        title: "Reset Email Sent",
        text: "Check your email inbox 📩",
        timer: 2500,
        showConfirmButton: false,
      });

      setEmail("");
    } catch (err) {
      console.log(err);

      let message = "Failed to send reset email";

      if (err.code === "auth/user-not-found") {
        message = "No user found with this email";
      }

      if (err.code === "auth/invalid-email") {
        message = "Invalid email format";
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-pink-50 via-white to-rose-100 dark:from-pink-950 dark:via-black dark:to-rose-950">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Forgot Password 🔐</h1>
            <p className="text-sm text-gray-500">
              Enter your email to reset password
            </p>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <form onSubmit={handleReset} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Remember password?{" "}
            <Link href="/login" className="text-pink-500">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
