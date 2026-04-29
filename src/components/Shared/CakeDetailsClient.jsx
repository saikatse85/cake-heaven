"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import OrderButton from "@/components/Shared/OrderButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import ReviewModal from "./ReviewModal";

export default function CakeDetailsClient({ cake, relatedCakes }) {
  const [productReviews, setProductReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [openReview, setOpenReview] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews?cakeId=${cake._id}`);
        const data = await res.json();

        setProductReviews(data);

        // ✅ calculate average rating
        if (data.length > 0) {
          const avg =
            data.reduce((acc, item) => acc + Number(item.rating), 0) /
            data.length;
          setRating(avg.toFixed(1));
        } else {
          setRating(0);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (cake?._id) {
      fetchReviews();
    }
  }, [cake]);

  const totalReviews = productReviews.length;

  if (!cake) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-10 text-center text-black dark:text-white"
      >
        <h2 className="text-xl font-bold">Cake not found</h2>
        <Link href="/cakes">
          <Button className="mt-4">Back to Cakes</Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8 text-black dark:text-white">
      {/* Back Button */}
      <motion.div whileHover={{ x: -5 }}>
        <Link href="/cakes">
          <Button variant="outline">← Back to Items</Button>
        </Link>
      </motion.div>

      {/* Main Section */}
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border dark:border-zinc-800">
            <motion.img
              src={cake.image}
              alt={cake.name}
              className="w-full h-80 object-cover"
              whileHover={{ scale: 1.05 }}
            />
          </Card>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <h1 className="text-3xl font-bold">{cake.name}</h1>

          {/* ⭐ Rating */}
          <div className="flex items-center gap-2">
            <div className="text-yellow-400 text-lg">
              {"⭐".repeat(Math.round(rating))}
            </div>
            <span className="text-sm text-gray-500">
              {rating} ({totalReviews} reviews)
            </span>
          </div>

          <p className="text-gray-600 dark:text-gray-300">{cake.description}</p>

          <motion.p className="text-pink-500 text-2xl font-bold">
            Price : $ {cake.price}
          </motion.p>

          <div className="flex gap-2 text-sm">
            <span className="px-3 py-1 bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-400 rounded-full">
              {cake.category}
            </span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 dark:text-gray-300 rounded-full">
              {cake.createdAt}
            </span>
          </div>

          {/* Order Button */}
          <motion.div whileTap={{ scale: 0.95 }}>
            <OrderButton cakeId={cake._id} />
          </motion.div>

          {/* ✨ Review Button */}
          <motion.div
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.94 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              onClick={() => setOpenReview(true)}
              size="lg"
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl shadow-md hover:shadow-lg"
            >
              ✨ Share Your Sweet Experience
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Specifications */}
      <Card className="bg-white dark:bg-zinc-900 border dark:border-zinc-800">
        <CardContent className="p-6 space-y-3">
          <h2 className="text-xl font-semibold">Specifications</h2>
          <ul className="text-gray-600 dark:text-gray-300 space-y-1">
            <li>Size: {cake.specs?.size}</li>
            <li>Flavor: {cake.specs?.flavor}</li>
            <li>Serving: {cake.specs?.serving}</li>
          </ul>
        </CardContent>
      </Card>

      {/* Reviews */}
      <Card className="bg-white dark:bg-zinc-900 border dark:border-zinc-800">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Customer Reviews 💬</h2>

          {productReviews.length === 0 && (
            <p className="text-sm text-gray-500">
              No reviews yet. Be the first one!
            </p>
          )}

          {productReviews.map((rev, i) => (
            <div key={i} className="border-b last:border-none pb-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img
                    src={rev.photo || "https://i.pravatar.cc/150"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="font-medium">
                    {rev.userName || "Anonymous"}
                  </span>
                </div>

                <span className="text-yellow-400">
                  {"⭐".repeat(rev.rating)}
                </span>
              </div>

              <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">
                {rev.comment}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Related Cakes */}
      {relatedCakes.length > 0 && (
        <div className="grid md:grid-cols-4 gap-6">
          {relatedCakes.map((item) => (
            <Card key={item._id}>
              <img src={item.image} className="h-40 w-full object-cover" />
              <CardContent>
                <h3>{item.name}</h3>
                <p>${item.price}</p>
                <Link href={`/cakes/${item._id}`}>
                  <Button size="sm">View Details</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* REVIEW MODAL */}
      <ReviewModal
        isOpen={openReview}
        onClose={() => setOpenReview(false)}
        cake={cake}
      />
    </div>
  );
}
