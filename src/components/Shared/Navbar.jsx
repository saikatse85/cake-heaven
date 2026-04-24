"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import NavItem from "./NavItem";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // 🔥 Get user + role
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const res = await fetch(`/api/users/${currentUser.uid}`);

          if (!res.ok) {
            throw new Error("Failed to fetch role");
          }

          const data = await res.json();
          setRole(data.role); // ✅ correct role
        } catch (error) {
          console.log("Role fetch error:", error);
        }
      } else {
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔓 Logout
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl flex items-center font-bold text-pink-600"
        >
          Cake Heaven
          <img src="/asset/img/logo.png" className="h-12 w-12" alt="logo" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <NavItem href="/">Home</NavItem>
          <NavItem href="/cakes">Cakes</NavItem>
          <NavItem href="/about">About</NavItem>
          <NavItem href="/contact">Contact</NavItem>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">{user.displayName || "User"}</Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56">
                {/* USER INFO */}
                <DropdownMenuLabel>
                  <p className="font-medium">{user.displayName || "No Name"}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>

                  {/* ✅ FIXED ROLE */}
                  <p className="text-xs text-pink-600 font-semibold mt-1">
                    Role: {role || "loading..."}
                  </p>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {/* COMMON */}
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>

                {/* 🔥 ADMIN MENU */}
                {role === "admin" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/add-product">Add Product</Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/manage-products">
                        Manage Products
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/admin/orders">All Orders</Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/admin/users">User Management</Link>
                    </DropdownMenuItem>
                  </>
                )}

                {/* 👤 CLIENT MENU */}
                {role === "client" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/cakes">All Cakes</Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/my-orders">My Orders</Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/reviews">Reviews</Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
          )}
        </div>

        {/* Mobile Button */}
        <div className="md:hidden">
          <Button
            onClick={() => setMobileOpen(!mobileOpen)}
            variant="outline"
            size="icon"
          >
            <Menu />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3">
          <NavItem href="/">Home</NavItem>
          <NavItem href="/cakes">Cakes</NavItem>
          <NavItem href="/about">About</NavItem>
          <NavItem href="/contact">Contact</NavItem>

          {user ? (
            <>
              <p className="font-medium">{user.displayName || "No Name"}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-xs text-pink-600">
                Role: {role || "loading..."}
              </p>

              {/* Role-based mobile menu */}
              {role === "admin" && (
                <>
                  <Link href="/dashboard/add-product">Add Product</Link>
                  <Link href="/dashboard/manage-products">Manage Products</Link>
                </>
              )}

              {role === "client" && (
                <>
                  <Link href="/dashboard/cakes">All Cakes</Link>
                  <Link href="/dashboard/my-orders">My Orders</Link>
                </>
              )}

              <Button onClick={handleLogout} variant="destructive">
                Logout
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
