"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
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
  const [phone, setPhone] = useState("");
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
      // =========================
      // 1. VALIDATION
      // =========================
      if (!email && !phone) {
        setError("Email or phone is required");
        setLoading(false);
        return;
      }

      if (!password) {
        setError("Password is required");
        setLoading(false);
        return;
      }

      // =========================
      // 2. MONGO LOGIN
      // =========================
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "login",
          email: email || "",
          phone: phone || "",
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.user) {
        setError(data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      const mongoUser = data.user;

      // =========================
      // 3. FIREBASE LOGIN (ONLY ONCE ✅)
      // =========================
      let firebaseUser = null;

      try {
        const { signInWithEmailAndPassword } = await import("firebase/auth");

        const loginId = email || `${phone}@cake-heaven.local`; // 🔥 MUST match register

        const userCredential = await signInWithEmailAndPassword(
          auth,
          loginId,
          password,
        );

        firebaseUser = userCredential.user;
      } catch (firebaseErr) {
        console.log("Firebase login failed:", firebaseErr.message);

        // ❌ If Firebase fails for phone → DON'T break login
        // MongoDB already verified
      }

      // =========================
      // 4. MERGE USER
      // =========================
      const userData = {
        uid: mongoUser.uid || firebaseUser?.uid,
        name: mongoUser.name || firebaseUser?.displayName,
        email: mongoUser.email,
        phone: mongoUser.phone,
        image: mongoUser.image || firebaseUser?.photoURL,
        role: mongoUser.role || "client",
      };

      // =========================
      // 5. SAVE SESSION
      // =========================
      localStorage.setItem("user", JSON.stringify(userData));
      window.dispatchEvent(new Event("storage"));

      // =========================
      // 6. SUCCESS
      // =========================
      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: "Welcome back 🎂",
        timer: 2000,
        showConfirmButton: false,
      });

      router.push("/");
    } catch (err) {
      console.log(err);
      setError("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // ✅ Save to MongoDB (with correct mode)
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "register", //
          name: user.displayName || "",
          email: user.email || "",
          phone: "",
          image: user.photoURL || "",
          uid: user.uid,
          password: "", // Google user
          role: "client",
        }),
      });

      const data = await res.json();

      // ✅ Ignore duplicate user error (IMPORTANT)
      if (!res.ok && data.message !== "User already exists") {
        console.log("GOOGLE LOGIN ERROR:", data);
      }

      // ✅ Save session
      const userData = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        phone: "",
        image: user.photoURL,
        role: "client",
      };

      localStorage.setItem("user", JSON.stringify(userData));
      window.dispatchEvent(new Event("storage")); // 🔥 update navbar

      Swal.fire({
        icon: "success",
        title: "Welcome!",
        text: "Google login successful 🎉",
        timer: 2000,
        showConfirmButton: false,
      });

      router.push(decodeURIComponent(redirect));
    } catch (err) {
      console.log(err);
      setError("Google login failed.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-pink-50 via-white to-rose-100 dark:from-pink-950 dark:via-black dark:to-rose-950">
      <Card className="relative w-full max-w-md shadow-2xl rounded-2xl">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <Link href="/">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-pink-500">
                Welcome Back 🎂
              </h1>
            </Link>
            <p className="text-gray-500 text-sm">
              Login to order your favorite cakes
            </p>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="text"
              placeholder="Email or Mobile Number"
              onChange={(e) => {
                const value = e.target.value;

                // simple detection
                if (value.includes("@")) {
                  setEmail(value);
                  setPhone("");
                } else {
                  setPhone(value);
                  setEmail("");
                }
              }}
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
