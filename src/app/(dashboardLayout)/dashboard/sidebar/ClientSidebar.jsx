"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ClientSidebar() {
  const router = useRouter();

  const menuItems = [
    { name: "🍰 All Cakes", href: "/dashboard/all-cakes" },
    { name: "📦 My Orders", href: "/dashboard/my-orders" },
    { name: "💳 Checkout", href: "/dashboard/checkout" },
    { name: "⭐ Reviews", href: "/dashboard/reviews" },
    { name: "👤 Profile", href: "/dashboard/profile" },
  ];

  const handleLogout = () => {
    // remove auth data (example)
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // redirect to login page
    router.push("/");
  };

  return (
    <div className="w-64 h-screen bg-pink-50 text-gray-500 p-5 flex flex-col fixed top-0 left-0">
      <Link href="/" className="flex items-center justify-center">
        <Image
          src="/asset/img/logo.png"
          alt="Cake Heaven Logo"
          width={50}
          height={50}
          priority
        />
        <h2 className="text-xl font-bold text-pink-500">Cake Heaven</h2>
      </Link>
      <h2 className="block p-2 hover:bg-pink-500 hover:text-white rounded mt-5">
        📊Client Dashboard
      </h2>
      {/* Menu */}
      <ul className="space-y-4 flex-1">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link
              href={item.href}
              className="block p-2 rounded hover:bg-pink-600 hover:text-white transition"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full mt-6 bg-pink-500 hover:bg-pink-600 text-white py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
