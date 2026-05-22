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
      return setError("Email or Phone is required");
    }

    const isEmail = email.includes("@");

    if (isEmail && !isValidEmail(email)) {
      return setError("Please enter a valid email address");
    }

    try {
      setLoading(true);

      if (isEmail) {
        // Firebase password reset for email users
        await sendPasswordResetEmail(auth, email);
        
        Swal.fire({
          icon: "success",
          title: "Reset Email Sent",
          text: "Check your email inbox 📩",
          timer: 2500,
          showConfirmButton: false,
        });
      } else {
        // MongoDB password reset for phone-only users
        // Note: Without SMS OTP, this directly resets the password for demonstration.
        // The user must provide a new password in the prompt.
        const { value: newPassword } = await Swal.fire({
          title: "Reset Password",
          input: "password",
          inputLabel: "Enter your new password",
          inputPlaceholder: "New password",
          inputAttributes: {
            maxlength: "30",
            autocapitalize: "off",
            autocorrect: "off"
          },
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return "You need to write something!";
            }
            if (value.length < 6) {
              return "Password must be at least 6 characters";
            }
          }
        });

        if (newPassword) {
          const res = await fetch("/api/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              mode: "reset_password",
              phone: email.replace(/\D/g, ""), // email variable actually holds phone here
              password: newPassword,
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || "Failed to reset password");
          }

          Swal.fire({
            icon: "success",
            title: "Password Reset",
            text: "Your password has been updated successfully 🎉",
            timer: 2500,
            showConfirmButton: false,
          });
        }
      }

      setEmail("");
    } catch (err) {
      console.log(err);
      let message = err.message || "Failed to send reset email";

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
