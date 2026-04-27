"use client";

import Image from "next/image";
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

    router.push("/");
  };

  return (
    <div className="w-64 h-screen bg-pink-50 text-gray-500 p-5 flex flex-col overflow-y-auto fixed top-0 left-0">
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

      {/* TOP MENU AREA */}
      <div className="flex-1 space-y-2">
        {/* DASHBOARD */}
        <h2 className="block p-2 hover:bg-pink-500 hover:text-white rounded mt-5">
          📊Admin Dashboard
        </h2>

        {/* PRODUCT MANAGEMENT */}
        <div>
          <button
            onClick={() => toggleMenu("product")}
            className="w-full text-left p-2 hover:bg-pink-600 hover:text-white rounded"
          >
            🍰 Product Management
          </button>

          {openMenu === "product" && (
            <div className="ml-4 space-y-1 mt-2">
              <Link
                href="/dashboard/add-product"
                className="block hover:text-pink-600"
              >
                ➕ Add New Product
              </Link>
              <Link
                href="/dashboard/manage-product"
                className="block hover:text-pink-600"
              >
                ✏️ Manage Product
              </Link>
              <Link
                href="/admin/products"
                className="block hover:text-pink-600"
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
            className="w-full text-left p-2 hover:bg-pink-600 hover:text-white rounded"
          >
            📦 Order Management
          </button>

          {openMenu === "order" && (
            <div className="ml-4 space-y-1 mt-2">
              <Link
                href="/dashboard/all-orders"
                className="block hover:text-pink-600"
              >
                📋 View All Orders
              </Link>
            </div>
          )}
        </div>

        {/* USER MANAGEMENT */}
        <div>
          <button
            onClick={() => toggleMenu("user")}
            className="w-full text-left p-2 hover:bg-pink-600 hover:text-white rounded"
          >
            👥 User Management
          </button>

          {openMenu === "user" && (
            <div className="ml-4 space-y-1 mt-2">
              <Link
                href="/dashboard/users"
                className="block hover:text-pink-600"
              >
                👤 View All Users
              </Link>
              <Link
                href="/admin/users/roles"
                className="block hover:text-pink-600"
              >
                🔑 Assign Role
              </Link>
              <Link
                href="/admin/users/block"
                className="block hover:text-pink-600"
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
            className="w-full text-left p-2 hover:bg-pink-600 hover:text-white rounded"
          >
            📝 Review Management
          </button>

          {openMenu === "review" && (
            <div className="ml-4 space-y-1 mt-2">
              <Link href="/admin/reviews" className="block hover:text-pink-600">
                ⭐ View Reviews
              </Link>
              <Link
                href="/admin/reviews/approve"
                className="block hover:text-pink-600"
              >
                ✅ Approve/Delete Reviews
              </Link>
              <Link
                href="/admin/reviews/spam"
                className="block hover:text-pink-600"
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
            className="w-full text-left p-2 hover:bg-pink-600 hover:text-white rounded"
          >
            📁 Category Management
          </button>

          {openMenu === "category" && (
            <div className="ml-4 space-y-1 mt-2">
              <Link
                href="/admin/categories"
                className="block hover:text-pink-600"
              >
                📂 View Categories
              </Link>
              <Link
                href="/admin/categories/add"
                className="block hover:text-pink-600"
              >
                ➕ Add Category
              </Link>
              <Link
                href="/admin/categories/edit"
                className="block hover:text-pink-600"
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
        className="mt-6 bg-pink-500 hover:bg-pink-600 text-white py-2 rounded"
      >
        🚪 Logout
      </button>
    </div>
  );
}
