"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ClientSidebar() {
  const router = useRouter();

  const menuItems = [
    { name: "All Cakes", href: "/dashboard/cakes" },
    { name: "My Orders", href: "/dashboard/orders" },
    { name: "Checkout", href: "/dashboard/checkout" },
    { name: "Reviews", href: "/dashboard/reviews" },
    { name: "Profile", href: "/dashboard/profile" },
  ];

  const handleLogout = () => {
    // remove auth data (example)
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // redirect to login page
    router.push("/login");
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5 flex flex-col">
      <h2 className="text-xl font-bold mb-6">Client Dashboard</h2>

      {/* Menu */}
      <ul className="space-y-4 flex-1">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link
              href={item.href}
              className="block p-2 rounded hover:bg-gray-700 transition"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
