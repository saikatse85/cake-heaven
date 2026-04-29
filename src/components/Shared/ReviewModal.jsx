"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

export default function ReviewModal({ isOpen, onClose, cake }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = async () => {
    const reviewData = {
      cakeId: cake._id,
      cakeName: cake.name,
      name,
      userEmail: "",
      photo: image,
      rating,
      comment,
      createdAt: new Date(),
    };

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Thank you! 🎉",
          text: "Your sweet review has been submitted",
          timer: 2000,
          showConfirmButton: false,
        });

        onClose();
        setName("");
        setImage("");
        setRating(0);
        setComment("");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: data.error || "Something went wrong",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Please try again later",
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background Blur */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl p-6 
              bg-white/20 dark:bg-zinc-900/30 
              backdrop-blur-xl border border-white/30 
              shadow-2xl space-y-4"
            >
              {/* Title */}
              <h2 className="text-xl font-bold text-center">
                ✨ Share Your Sweet Experience
              </h2>

              {/* Cake Name */}
              <p className="text-center text-sm text-gray-500">{cake.name}</p>

              {/* ⭐ Star Rating */}
              <div className="flex justify-center gap-2 text-2xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`cursor-pointer transition duration-150 ${
                      (hover || rating) >= star
                        ? "text-yellow-400 scale-110"
                        : "text-gray-300"
                    }`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                  >
                    ⭐
                  </span>
                ))}
              </div>

              {/* Comment */}
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 rounded-lg bg-white/40 dark:bg-zinc-800/40 border border-white/30 text-sm"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImage(reader.result); // base64 image
                  };
                  reader.readAsDataURL(file);
                }}
                className="w-full p-2 rounded-lg bg-white/40 dark:bg-zinc-800/40 border border-white/30 text-sm"
              />
              <textarea
                placeholder="Tell us what you loved about the cake..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/40 dark:bg-zinc-800/40 
                border border-white/30 outline-none text-sm"
                rows={4}
              />

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
                <Button variant="outline" className="w-full" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
