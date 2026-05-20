"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Star } from "lucide-react";

import { FeaturedCakesSkeleton } from "./FeaturedCakeSkeleton";
import { useCart } from "@/context/CartContext";
import OrderButton from "./OrderButton";

export function FeaturedCakes() {
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedFlavor, setSelectedFlavor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);

    fetch("/api/cakes", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setCakes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <FeaturedCakesSkeleton />;
  }

  return (
    <section className="py-16 px-6 bg-white dark:bg-zinc-950">
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold text-center mb-12 text-zinc-900 dark:text-white"
      >
        Featured Dessert
      </motion.h2>

      {/* Grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
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
        {[...cakes]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6)
          .map((cake, i) => (
            <motion.div
              key={i}
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

                    {/* Heart Icon */}
                    <button className="absolute top-4 right-4 h-11 w-11 rounded-full bg-white shadow-md flex items-center justify-center">
                      <Heart
                        size={20}
                        className="fill-pink-500 text-pink-500"
                      />
                    </button>
                  </div>

                  {/* Content */}
                  <CardContent className="p-5">
                    {/* Name */}
                    <h3 className="text-2xl font-semibold text-zinc-800 dark:text-white mb-2">
                      {cake?.name}
                    </h3>

                    {/* Price Section */}
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
                    {/*Flavor weight */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 rounded-full bg-pink-500/20">
                        {cake?.weight}
                      </span>
                      <span className="px-2 py-1 rounded-full bg-pink-500/20">
                        {cake?.flavor}
                      </span>
                      <span className="px-2 py-1 rounded-full bg-pink-500/20">
                        {cake?.type}
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
                        className="flex-1 rounded-full h-10 bg-pink-500 hover:bg-pink-600 text-white text-base font-semibold shadow-md"
                      ></OrderButton>

                      {/* Add to Cart */}
                      <Button
                        variant="outline"
                        onClick={() => addToCart(cake)}
                        className="rounded-full h-10 border-2 border-pink-300 text-pink-500 hover:bg-pink-50 dark:hover:bg-zinc-800 text-base font-semibold"
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

      {/* View All */}
      <motion.div
        className="flex justify-center mt-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        viewport={{ once: true }}
      >
        <Link href="/cakes">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button className="rounded-full px-10 h-12 bg-pink-500 hover:bg-pink-600 text-white text-base">
              View All Cakes
            </Button>
          </motion.div>
        </Link>
      </motion.div>
    </section>
  );
}
