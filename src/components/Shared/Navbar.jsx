"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
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

import { motion, AnimatePresence } from "framer-motion";

import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import NavItem from "./NavItem";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { cart } = useCart();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // 🛒 CART DROPDOWN STATE
  const [openCart, setOpenCart] = useState(false);

  useEffect(() => {
    setMounted(true);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const res = await fetch(`/api/users/${currentUser.uid}`);
          if (!res.ok) throw new Error("Failed to fetch role");

          const data = await res.json();
          setRole(data.role);
        } catch (error) {
          console.log("Role fetch error:", error);
        }
      } else {
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-zinc-950 text-black dark:text-white shadow-md border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* LOGO */}
        <Link
          href="/"
          className="text-2xl flex items-center font-bold text-pink-600 dark:text-pink-400"
        >
          Cake Heaven
          <img src="/asset/img/logo.png" className="h-12 w-12" alt="logo" />
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6 dark:text-white">
          <NavItem href="/">Home</NavItem>
          <NavItem href="/cakes">Cakes</NavItem>
          <NavItem href="/about">About</NavItem>
          <NavItem href="/contact">Contact</NavItem>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center justify-center gap-2">
          {/* 🛒 CART DROPDOWN */}
          <div className="relative">
            <button onClick={() => setOpenCart(!openCart)} className="relative">
              <span className="text-xl">🛒</span>

              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs px-1.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </button>

            {/* GLASS CART DROPDOWN */}
            <AnimatePresence>
              {openCart && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-80 
                  bg-white/30 dark:bg-zinc-900/30 
                  backdrop-blur-xl 
                  shadow-2xl 
                  rounded-2xl 
                  p-4 
                  border border-white/30 dark:border-zinc-700/40
                  z-50"
                >
                  {cart.length === 0 ? (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Cart is empty
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {cart.map((item) => (
                        <motion.div
                          key={item._id}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center gap-3 p-2 rounded-xl 
                          bg-white/40 dark:bg-zinc-800/40 
                          backdrop-blur-md"
                        >
                          <img
                            src={item.image}
                            className="w-12 h-12 rounded-lg object-cover"
                            alt={item.name}
                          />

                          <div className="flex-1">
                            <p className="text-sm font-medium text-black dark:text-white">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                              ৳{item.price} × {item.quantity}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* VIEW CART BUTTON */}
                  <Link href="/cart">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full mt-4 
                      bg-pink-600 hover:bg-pink-700 
                      text-white font-medium 
                      py-2 rounded-xl 
                      shadow-md transition"
                    >
                      View Cart
                    </motion.button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* USER SECTION */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
                >
                  {user.displayName || "User"}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56 bg-white dark:bg-zinc-900 text-black dark:text-white border dark:border-zinc-700">
                <DropdownMenuLabel>
                  <p className="font-medium">{user.displayName || "No Name"}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-xs text-pink-600 dark:text-pink-400 font-semibold mt-1">
                    Role: {role || "loading..."}
                  </p>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>

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

          {/* THEME TOGGLE */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-zinc-700 dark:text-zinc-200 hover:text-pink-500 transition-colors duration-200"
            aria-label="Toggle Dark Mode"
          >
            <span
              className={`material-symbols-outlined ${
                !mounted ? "invisible" : ""
              }`}
            >
              {mounted && theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>
        </div>

        {/* MOBILE BUTTON */}
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 bg-white dark:bg-zinc-950 text-black dark:text-white">
          <Button
            onClick={() => setMobileOpen(!mobileOpen)}
            variant="outline"
            size="icon"
          >
            <Menu />
          </Button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3">
          <Link href="/cart" className="flex items-center gap-2">
            🛒 Cart ({cart.length})
          </Link>

          <NavItem href="/">Home</NavItem>
          <NavItem href="/cakes">Cakes</NavItem>
          <NavItem href="/about">About</NavItem>
          <NavItem href="/contact">Contact</NavItem>
        </div>
      )}
    </nav>
  );
}
