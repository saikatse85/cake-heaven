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
  const [dbUser, setDbUser] = useState(null);
  const [role, setRole] = useState("client");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openCart, setOpenCart] = useState(false);

  useEffect(() => {
    setMounted(true);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (!currentUser) {
          const stored = localStorage.getItem("user");

          if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            setDbUser(parsed);
            setRole(parsed.role || "client");
          }

          return;
        }

        const res = await fetch(`/api/users/${currentUser.uid}`);
        const data = await res.json();

        console.log(data);

        // SAFE CHECK
        if (res.ok && data && !data.success) {
          setDbUser(data);
          setRole(data.role || "client");
          setUser(currentUser);
        } else {
          // fallback to localStorage
          const stored = localStorage.getItem("user");

          if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            setDbUser(parsed);
            setRole(parsed.role || "client");
          }
        }
      } catch (error) {
        console.log(error);

        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          setDbUser(parsed);
          setRole(parsed.role || "client");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);

      localStorage.removeItem("user");

      window.dispatchEvent(new Event("storage"));

      window.location.href = "/login";
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const userImage = dbUser?.image || user?.photoURL || null;
  const userName = dbUser?.name || user?.displayName || "User";

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
          {/* CART */}
          <div className="relative">
            <button onClick={() => setOpenCart(!openCart)} className="relative">
              <span className="text-xl">🛒</span>

              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs px-1.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </button>

            {/* 🔥 RESTORED GLASSMORPHISM + ANIMATION */}
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
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                              ৳{item.price} × {item.quantity}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

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

          {/* USER */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2">
                  {userImage ? (
                    <img
                      src={userImage}
                      className="w-9 h-9 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">
                      {userName.charAt(0)}
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>

              {/*RESTORED GLASSMORPHISM DROPDOWN */}
              <DropdownMenuContent
                className="
                w-56 
                bg-white/40 dark:bg-zinc-900/40 
                backdrop-blur-xl 
                border border-white/30 dark:border-zinc-700/40 
                shadow-2xl 
                rounded-2xl
                text-black dark:text-white
              "
              >
                <DropdownMenuLabel className="flex gap-3 items-center">
                  {userImage ? (
                    <img
                      src={userImage}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white">
                      {userName.charAt(0)}
                    </div>
                  )}

                  <div>
                    <p>{userName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <p className="text-xs text-pink-600">Role: {role}</p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />
                {/* USER MENU */}
                {role !== "admin" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/all-cakes">AllCakes</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/my-order">My Order</Link>
                    </DropdownMenuItem>
                  </>
                )}
                {/* ADMIN MENU */}
                {role === "admin" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/add-product">Add Product</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/all-orders">All Order</Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/manage-product">
                        Manage Products
                      </Link>
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

          {/* THEME */}
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <span className="material-symbols-outlined">
              {mounted && theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3">
          <Link href="/cart">🛒 Cart ({cart.length})</Link>
          <NavItem href="/">Home</NavItem>
          <NavItem href="/cakes">Cakes</NavItem>
          <NavItem href="/about">About</NavItem>
          <NavItem href="/contact">Contact</NavItem>
        </div>
      )}
    </nav>
  );
}
