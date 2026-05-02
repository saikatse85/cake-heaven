"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function AddCakePage() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    rating: "",
    description: "",
    image: "",
    available: true,
  });

  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: reader.result }),
        });

        const data = await res.json();

        if (res.ok) {
          setFormData((prev) => ({
            ...prev,
            image: data.url,
          }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setUploading(false);
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCake = {
      ...formData,
      price: Number(formData.price),
      rating: Number(formData.rating),
    };

    try {
      const res = await fetch("/api/cakes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCake),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Cake added successfully 🎉");
        setFormData({
          name: "",
          category: "",
          price: "",
          rating: "",
          description: "",
          image: "",
          available: true,
        });
      } else {
        setMessage(data.error || "Something went wrong");
      }
    } catch (error) {
      setMessage("Error adding cake");
    }
  };

  return (
    <ProtectedRoute>
      <div
        className="min-h-screen flex items-center justify-center px-4 
        bg-gradient-to-br 
        from-pink-200/60 via-rose-100/50 to-pink-300/60
        dark:from-[#1a0f14] dark:via-[#2a121c] dark:to-[#14080d]
        backdrop-blur-2xl transition-all duration-500"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl space-y-6 p-6 rounded-2xl 
          bg-pink-100/40 dark:bg-pink-500/10 
          backdrop-blur-2xl 
          border border-pink-200/40 dark:border-pink-400/10
          shadow-[0_8px_32px_rgba(255,105,180,0.25)]"
        >
          {/* Title */}
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Add Cake 🎂
          </h1>

          {message && (
            <p className="text-center text-sm text-green-500">{message}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Cake Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="bg-white/70 dark:bg-pink-500/10 dark:text-white backdrop-blur-md"
              required
            />

            <Input
              placeholder="Category (e.g. Birthday)"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="bg-white/70 dark:bg-pink-500/10 dark:text-white backdrop-blur-md"
              required
            />

            <Input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="bg-white/70 dark:bg-pink-500/10 dark:text-white backdrop-blur-md"
              required
            />

            <Input
              type="number"
              step="0.1"
              placeholder="Rating (e.g. 4.5)"
              value={formData.rating}
              onChange={(e) =>
                setFormData({ ...formData, rating: e.target.value })
              }
              className="bg-white/70 dark:bg-pink-500/10 dark:text-white backdrop-blur-md"
              required
            />

            <Textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="bg-white/70 dark:bg-pink-500/10 dark:text-white backdrop-blur-md"
              required
            />

            {/* Image Upload */}
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="bg-white/70 dark:bg-pink-500/10 dark:text-white backdrop-blur-md"
            />

            {uploading && (
              <p className="text-sm text-blue-500 text-center">
                Uploading image...
              </p>
            )}

            {formData.image && (
              <div className="flex justify-center">
                <img
                  src={formData.image}
                  className="w-24 h-24 object-cover rounded-lg border dark:border-pink-400/20 shadow-md"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white shadow-lg"
            >
              Add Cake
            </Button>
          </form>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}
