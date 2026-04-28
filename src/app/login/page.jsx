"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect") || "/";

  //  Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      const res = await fetch(`/api/users/${user.uid}`);
      const data = await res.json();

      if (!data || !data.email) {
        await auth.signOut();
        setError("You are not registered. Please sign up first.");
        return;
      }

      // Only valid users continue
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: user.email,
          uid: user.uid,
        }),
      );

      router.push(decodeURIComponent(redirect));
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("No account found. Please register first.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else {
        setError("Login failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError("");

  //   try {
  //     const userCredential = await signInWithEmailAndPassword(
  //       auth,
  //       email,
  //       password,
  //     );

  //     const user = userCredential.user;

  //     localStorage.setItem(
  //       "user",
  //       JSON.stringify({
  //         email: user.email,
  //         uid: user.uid,
  //       }),
  //     );

  //     router.push("/dashboard");
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Google Login
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save to MongoDB if not exists
      await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          uid: user.uid,
        }),
      });

      localStorage.setItem(
        "user",
        JSON.stringify({
          email: user.email,
          uid: user.uid,
        }),
      );

      router.push(decodeURIComponent(redirect));
    } catch (err) {
      setError("Google login failed.");
    }
  };
  // const handleGoogleLogin = async () => {
  //   const provider = new GoogleAuthProvider();

  //   try {
  //     const result = await signInWithPopup(auth, provider);

  //     const user = result.user;

  //     localStorage.setItem(
  //       "user",
  //       JSON.stringify({
  //         email: user.email,
  //         uid: user.uid,
  //       }),
  //     );

  //     router.push(decodeURIComponent(redirect));
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-pink-50 via-white to-rose-100">
      <Card className="relative w-full max-w-md shadow-2xl rounded-2xl">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-pink-500">
              Welcome Back 🎂
            </h1>
            <p className="text-gray-500 text-sm">
              Login to order your favorite cakes
            </p>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
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

            <Button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
            >
              Google
            </Button>
          </div>
        </CardContent>
        <div className="text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-pink-500 hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
}
