"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
        bg-gradient-to-br from-pink-50 via-white to-rose-100 
        dark:from-zinc-950 dark:via-zinc-900 dark:to-black"
      >
        <div
          className="w-full max-w-xl space-y-6 p-6 rounded-2xl 
          bg-white/70 dark:bg-zinc-900/60 
          backdrop-blur-xl border border-gray-200 dark:border-zinc-800
          shadow-xl"
        >
          {/* Title */}
          <h1
            className="text-2xl font-bold text-center 
            text-gray-900 dark:text-white"
          >
            Add Cake
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
              className="bg-white dark:bg-zinc-800 dark:text-white"
              required
            />

            <Input
              placeholder="Category (e.g. Birthday)"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="bg-white dark:bg-zinc-800 dark:text-white"
              required
            />

            <Input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="bg-white dark:bg-zinc-800 dark:text-white"
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
              className="bg-white dark:bg-zinc-800 dark:text-white"
              required
            />

            <Textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="bg-white dark:bg-zinc-800 dark:text-white"
              required
            />

            {/* Image Upload */}
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="bg-white dark:bg-zinc-800 dark:text-white"
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
                  className="w-24 h-24 object-cover rounded-lg border dark:border-zinc-700"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white"
            >
              Add Cake
            </Button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
