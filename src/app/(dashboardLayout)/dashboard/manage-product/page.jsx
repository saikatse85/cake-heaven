"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

export default function ManageProduct() {
  const [cakes, setCakes] = useState([]);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  // Load data
  useEffect(() => {
    fetch("/api/cakes")
      .then((res) => res.json())
      .then((data) => {
        setCakes(Array.isArray(data) ? data : data?.cakes || []);
      });
  }, []);

  // Delete handler
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This cake will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ec4899",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    const res = await fetch(`/api/cakes/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setCakes((prev) => prev.filter((item) => item._id !== id));

      swal.fire({
        title: "Deleted!",
        text: "Cake has been deleted successfully.",
        icon: "success",
        confirmButtonColor: "#ec4899",
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: "Delete failed.",
        icon: "error",
        confirmButtonColor: "#ec4899",
      });
    }
  };

  // pagination logic
  const totalPages = Math.ceil(cakes.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedCakes = cakes.slice(startIndex, startIndex + perPage);

  return (
    <div
      className="p-4 space-y-6 min-h-screen 
      bg-gradient-to-br 
      from-pink-200/60 via-rose-100/50 to-pink-300/60
      dark:from-[#1a0f14] dark:via-[#2a121c] dark:to-[#14080d]
      backdrop-blur-2xl 
      text-gray-900 dark:text-gray-100 
      transition-all duration-500"
    >
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold"
      >
        Manage Cakes 🎂
      </motion.h1>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {paginatedCakes.map((cake, index) => (
          <motion.div
            key={cake._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className="rounded-2xl overflow-hidden 
              bg-pink-100/40 dark:bg-pink-500/10 
              backdrop-blur-2xl 
              border border-pink-200/40 dark:border-pink-400/10
              shadow-[0_8px_32px_rgba(255,105,180,0.2)]
              hover:shadow-[0_12px_40px_rgba(255,105,180,0.35)]
              transition"
            >
              <div className="overflow-hidden">
                {cake?.image ? (
                  <motion.img
                    src={cake.image}
                    alt={cake?.name}
                    className="h-48 w-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                ) : (
                  <div className="h-48 w-full flex items-center justify-center bg-gray-100 text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold text-lg">{cake.name}</h3>

                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {cake.description}
                </p>

                <p className="text-pink-600 dark:text-pink-400 font-bold">
                  ৳ {cake.price}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-pink-500 font-bold">
                    ৳ {cake?.discountPrice || cake?.price} Only
                  </span>

                  {cake?.discountPrice && (
                    <span className="line-through text-gray-400 text-sm">
                      ৳ {cake?.price}
                    </span>
                  )}
                </div>
                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Link
                    href={`/dashboard/update-cake/${cake._id}`}
                    className="w-full"
                  >
                    <Button
                      variant="outline"
                      className="w-full 
                      border-pink-400 text-pink-500 
                      hover:bg-pink-500 hover:text-white 
                      dark:border-pink-500 dark:hover:text-white dark:hover:bg-pink-600"
                    >
                      Edit
                    </Button>
                  </Link>

                  <Button
                    variant="destructive"
                    className="w-1/2 bg-pink-500 hover:bg-pink-600 text-white shadow-md"
                    onClick={() => handleDelete(cake._id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 bg-pink-500 text-white rounded disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={`px-3 py-1 rounded ${
              currentPage === num
                ? "bg-pink-600 text-white"
                : "bg-white dark:bg-zinc-800"
            }`}
          >
            {num}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 bg-pink-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
