"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, Plus, Package } from "lucide-react";

export default function Sidebar() {
  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="w-64 min-h-screen bg-white border-r shadow-md p-5 space-y-6">
      {/* Logo */}
      <Link href={"/"}>
        <h2 className="text-2xl font-bold text-pink-500">🎂 Cake Dashboard</h2>
      </Link>

      {/* Links */}
      <div className="flex flex-col gap-3">
        <Link href="/dashboard/profile">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <User size={18} /> Profile
          </Button>
        </Link>

        <Link href="/dashboard/add-product">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Plus size={18} /> Add Product
          </Button>
        </Link>

        <Link href="/dashboard/manage-product">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Package size={18} /> Manage Product
          </Button>
        </Link>
      </div>

      {/* Logout */}
      <div className="pt-10">
        <Button
          onClick={logout}
          className="w-full bg-pink-500 hover:bg-pink-600"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
