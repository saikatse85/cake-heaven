"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-pink-50 via-white to-rose-100">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-10 left-10 w-72 h-72 bg-pink-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-rose-300 rounded-full blur-3xl"></div>
      </div>

      {/* Card */}
      <Card className="relative w-full max-w-md shadow-2xl rounded-2xl">
        <CardContent className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Create Account 🎂
            </h1>
            <p className="text-gray-500 text-sm">
              Join us and order your favorite cakes
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4">
            <Input type="text" placeholder="Full Name" required />

            <Input type="email" placeholder="Email address" required />

            <Input type="password" placeholder="Password" required />

            <Input type="password" placeholder="Confirm Password" required />

            <Button className="w-full bg-pink-500 hover:bg-pink-600">
              Register
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
            <Button variant="outline" className="w-full">
              Google
            </Button>
            <Button variant="outline" className="w-full">
              Facebook
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
