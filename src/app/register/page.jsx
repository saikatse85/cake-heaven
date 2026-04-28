"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔐 Register with Email
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      // ✅ Set display name
      await updateProfile(user, {
        displayName: name,
      });

      // ✅ Save user to MongoDB
      await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          uid: user.uid,
          role: "client",
        }),
      });

      Swal.fire({
        icon: "success",
        title: "Welcome!",
        text: "Google account registered successfully 🎉",
        timer: 2000,
        showConfirmButton: false,
      });

      router.push("/"); // redirect after register
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Google Register
  const handleGoogleRegister = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // ✅ Save user to MongoDB (if not exists)
      await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.displayName || "",
          email: user.email,
          uid: user.uid,
          role: "client",
        }),
      });

      Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: "Your account has been created successfully 🎉",
        timer: 2000,
        showConfirmButton: false,
      });

      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-pink-50 via-white to-rose-100 dark:from-pink-950 dark:via-black dark:to-rose-950">
      <Card className="relative w-full max-w-md shadow-2xl rounded-2xl">
        <CardContent className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-pink-500">
              Create Account 🎂
            </h1>
            <p className="text-gray-500 text-sm">
              Join us and order your favorite cakes
            </p>
          </div>

          {/* ❌ Error message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              type="text"
              placeholder="Full Name"
              required
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              type="email"
              placeholder="Email address"
              required
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Confirm Password"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Register"}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <div className="flex-1 h-px bg-gray-200"></div>
            OR
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Social Register */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleRegister}
            >
              Google
            </Button>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-pink-500 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
