"use client";

import Link from "next/link";
import { useState } from "react";
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

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = {
    name: "John Doe",
    email: "john@example.com",
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-pink-600">
          CakeShop 🍰
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/">Home</Link>
          <Link href="/cakes">Cakes</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>

          {!isLoggedIn ? (
            <div className="flex gap-2">
              <Button onClick={() => setIsLoggedIn(true)} variant="outline">
                Login
              </Button>
              <Button>Register</Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">{user.name}</Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link href="/dashboard/add-product">Add Product</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/dashboard/manage-products">Manage Products</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
          <Link href="/">Home</Link>
          <Link href="/cakes">Cakes</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>

          {!isLoggedIn ? (
            <>
              <Button onClick={() => setIsLoggedIn(true)} variant="outline">
                Login
              </Button>
              <Button>Register</Button>
            </>
          ) : (
            <>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>

              <Link href="/dashboard/add-product">Add Product</Link>
              <Link href="/dashboard/manage-products">Manage Products</Link>

              <Button
                onClick={() => setIsLoggedIn(false)}
                variant="destructive"
              >
                Logout
              </Button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
