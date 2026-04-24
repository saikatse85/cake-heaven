"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSidebar() {
  const [openMenu, setOpenMenu] = useState(null);
  const router = useRouter();

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/login");
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5 flex flex-col overflow-y-auto">
      <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>

      {/* TOP MENU AREA */}
      <div className="flex-1 space-y-2">
        {/* DASHBOARD */}
        <Link
          href="/admin/dashboard"
          className="block p-2 hover:bg-gray-700 rounded"
        >
          📊 Dashboard
        </Link>

        {/* PRODUCT MANAGEMENT */}
        <div>
          <button
            onClick={() => toggleMenu("product")}
            className="w-full text-left p-2 hover:bg-gray-700 rounded"
          >
            🍰 Product Management
          </button>

          {openMenu === "product" && (
            <div className="ml-4 space-y-1 mt-2">
              <Link
                href="/admin/products/add"
                className="block hover:text-yellow-400"
              >
                ➕ Add New Product
              </Link>
              <Link
                href="/admin/products/edit"
                className="block hover:text-yellow-400"
              >
                ✏️ Edit Product
              </Link>
              <Link
                href="/admin/products/delete"
                className="block hover:text-yellow-400"
              >
                ❌ Delete Product
              </Link>
              <Link
                href="/admin/products"
                className="block hover:text-yellow-400"
              >
                📋 View All Products
              </Link>
            </div>
          )}
        </div>

        {/* ORDER MANAGEMENT */}
        <div>
          <button
            onClick={() => toggleMenu("order")}
            className="w-full text-left p-2 hover:bg-gray-700 rounded"
          >
            📦 Order Management
          </button>

          {openMenu === "order" && (
            <div className="ml-4 space-y-1 mt-2">
              <Link
                href="/admin/orders"
                className="block hover:text-yellow-400"
              >
                📋 View All Orders
              </Link>
              <Link
                href="/admin/orders/status"
                className="block hover:text-yellow-400"
              >
                🔄 Change Order Status
              </Link>
              <p className="text-xs text-gray-400">
                Pending → Processing → Delivered → Cancelled
              </p>
            </div>
          )}
        </div>

        {/* USER MANAGEMENT */}
        <div>
          <button
            onClick={() => toggleMenu("user")}
            className="w-full text-left p-2 hover:bg-gray-700 rounded"
          >
            👥 User Management
          </button>

          {openMenu === "user" && (
            <div className="ml-4 space-y-1 mt-2">
              <Link href="/admin/users" className="block hover:text-yellow-400">
                👤 View All Users
              </Link>
              <Link
                href="/admin/users/roles"
                className="block hover:text-yellow-400"
              >
                🔑 Assign Role
              </Link>
              <Link
                href="/admin/users/block"
                className="block hover:text-yellow-400"
              >
                🚫 Block/Delete User
              </Link>
            </div>
          )}
        </div>

        {/* REVIEW MANAGEMENT */}
        <div>
          <button
            onClick={() => toggleMenu("review")}
            className="w-full text-left p-2 hover:bg-gray-700 rounded"
          >
            📝 Review Management
          </button>

          {openMenu === "review" && (
            <div className="ml-4 space-y-1 mt-2">
              <Link
                href="/admin/reviews"
                className="block hover:text-yellow-400"
              >
                ⭐ View Reviews
              </Link>
              <Link
                href="/admin/reviews/approve"
                className="block hover:text-yellow-400"
              >
                ✅ Approve/Delete Reviews
              </Link>
              <Link
                href="/admin/reviews/spam"
                className="block hover:text-yellow-400"
              >
                🚨 Spam Detection
              </Link>
            </div>
          )}
        </div>

        {/* CATEGORY MANAGEMENT */}
        <div>
          <button
            onClick={() => toggleMenu("category")}
            className="w-full text-left p-2 hover:bg-gray-700 rounded"
          >
            📁 Category Management
          </button>

          {openMenu === "category" && (
            <div className="ml-4 space-y-1 mt-2">
              <Link
                href="/admin/categories"
                className="block hover:text-yellow-400"
              >
                📂 View Categories
              </Link>
              <Link
                href="/admin/categories/add"
                className="block hover:text-yellow-400"
              >
                ➕ Add Category
              </Link>
              <Link
                href="/admin/categories/edit"
                className="block hover:text-yellow-400"
              >
                ✏️ Edit/Delete Category
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* LOGOUT BUTTON (BOTTOM) */}
      <button
        onClick={handleLogout}
        className="mt-6 bg-red-600 hover:bg-red-700 text-white py-2 rounded"
      >
        🚪 Logout
      </button>
    </div>
  );
}
