"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Heart, Star } from "lucide-react";

import { AllCakeSkeleton } from "./AllCakeSkeleton";
import { useCart } from "@/context/CartContext";
import CakeSearch from "./CakeSearch";
import OrderButton from "./OrderButton";

export function AllCakes() {
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedFlavor, setSelectedFlavor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetch("/api/cakes")
      .then((res) => res.json())
      .then((data) => {
        setCakes(data);
        setLoading(false);
      });
  }, []);

  const filteredCakes = useMemo(() => {
    const query = search.toLowerCase().trim();

    const sortedCakes = [...cakes].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    return sortedCakes.filter((cake) => {
      if (!query) return true;

      const nameMatch = cake?.name?.toLowerCase().includes(query);
      const categoryMatch = cake?.category?.toLowerCase().includes(query);
      const flavourMatch = cake?.flavour?.toLowerCase().includes(query);
      const sizeMatch = cake?.size?.toLowerCase().includes(query);

      const priceMatch =
        cake?.price !== undefined &&
        (String(cake.price).includes(query) ||
          Number(cake.price) === Number(query));

      return (
        nameMatch || categoryMatch || flavourMatch || sizeMatch || priceMatch
      );
    });
  }, [cakes, search]);

  const totalPages = Math.ceil(filteredCakes.length / itemsPerPage);

  const paginatedCakes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCakes.slice(start, start + itemsPerPage);
  }, [filteredCakes, currentPage]);

  if (loading) {
    return <AllCakeSkeleton />;
  }

  return (
    <section className="py-16 px-6 bg-white dark:bg-zinc-950">
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold text-center mb-8 text-zinc-900 dark:text-white"
      >
        All Featured Dessert
      </motion.h2>

      {/* Search */}
      <CakeSearch
        search={search}
        setSearch={setSearch}
        setCurrentPage={setCurrentPage}
      />

      {/* Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
      >
        {paginatedCakes.map((cake) => (
          <motion.div
            key={cake._id}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Card className="rounded-[30px] overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-300 bg-white dark:bg-zinc-900">
                {/* Image */}
                <div className="relative overflow-hidden">
                  {cake?.image ? (
                    <motion.img
                      src={cake.image}
                      alt={cake?.name}
                      className="h-[260px] w-full object-cover"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.4 }}
                    />
                  ) : (
                    <div className="h-[260px] w-full bg-zinc-100 flex items-center justify-center">
                      No Image
                    </div>
                  )}

                  {/* Heart */}
                  <button className="absolute top-4 right-4 h-11 w-11 rounded-full bg-white shadow-md flex items-center justify-center">
                    <Heart size={20} className="fill-pink-500 text-pink-500" />
                  </button>
                </div>

                {/* Content */}
                <CardContent className="p-5">
                  {/* Name */}
                  <h3 className="text-2xl font-semibold text-zinc-800 dark:text-white mb-2">
                    {cake?.name}
                  </h3>

                  {/* Description */}
                  <p className="text-zinc-500 dark:text-zinc-300 text-sm line-clamp-2 mb-3">
                    {cake?.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="text-3xl font-bold text-black dark:text-white">
                      ৳{cake?.discountPrice || cake?.price}
                    </span>

                    <span className="text-sm text-zinc-500">
                      {cake?.weight}
                    </span>

                    {cake?.discountPrice && (
                      <>
                        <span className="line-through text-zinc-400 text-lg">
                          ৳{cake?.price}
                        </span>

                        <span className="text-green-500 font-semibold text-sm">
                          Save ৳{cake.price - cake.discountPrice}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-5">
                    <Star size={18} className="fill-pink-500 text-pink-500" />

                    <span className="text-pink-500 font-semibold">
                      {cake?.rating || "5.0"} (12.9K)
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center justify-between gap-3">
                    {/* Buy Now */}
                    <OrderButton
                      cakeId={cake._id}
                      size={selectedSize}
                      flavor={selectedFlavor}
                      quantity={quantity}
                      className="rounded-full h-10 bg-pink-500 hover:bg-pink-600 text-white text-base font-semibold shadow-md"
                    ></OrderButton>

                    {/* Add To Cart */}
                    <Button
                      variant="outline"
                      onClick={() => addToCart(cake)}
                      className=" rounded-full h-10 border-2 border-pink-300 text-pink-500 hover:bg-pink-50 dark:hover:bg-zinc-800 text-base font-semibold"
                    >
                      Add to Cart
                    </Button>
                  </div>

                  {/* View Details */}
                  <Link href={`/cakes/${cake._id}`}>
                    <Button
                      variant="ghost"
                      className="w-full mt-3 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
        {/* Prev */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="dark:text-white px-5 h-11 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm disabled:opacity-40"
        >
          Prev
        </motion.button>

        {/* Page Numbers */}
        {[...Array(totalPages).keys()].map((num) => (
          <motion.button
            key={num}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentPage(num + 1)}
            className={`w-11 h-11 rounded-full border transition ${
              currentPage === num + 1
                ? "bg-pink-500 text-white border-pink-500"
                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-white"
            }`}
          >
            {num + 1}
          </motion.button>
        ))}

        {/* Next */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="dark:text-white px-5 h-11 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm disabled:opacity-40"
        >
          Next
        </motion.button>
      </div>
    </section>
  );
}
