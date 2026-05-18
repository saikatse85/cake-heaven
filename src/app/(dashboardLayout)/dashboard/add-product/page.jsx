"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { uploadImageToCloudinary } from "@/app/utils/cloudinaryUpload";

export default function AddCakePage() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    rating: "",
    description: "",
    image: "",
    images: [],
    available: true,
  });

  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    setUploading(true);

    try {
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          return await uploadImageToCloudinary(file);
        }),
      );

      setFormData((prev) => ({
        ...prev,
        image: uploadedImages[0],
        images: uploadedImages,
      }));

      Swal.fire({
        icon: "success",
        title: "Images Uploaded 🎉",
        text: `${uploadedImages.length} images uploaded successfully`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err.message || "Image upload failed",
      });
    } finally {
      setUploading(false);

      //reset file input so onChange works properly every time
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.category ||
      !formData.price ||
      !formData.rating ||
      !formData.description ||
      !formData.image
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill all required fields",
      });
      return;
    }

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

        Swal.fire({
          icon: "success",
          title: "Success 🎂",
          text: "Cake added successfully!",
          timer: 1500,
          showConfirmButton: false,
        });

        setFormData({
          name: "",
          category: "",
          price: "",
          rating: "",
          description: "",
          image: "",
          images: [],
          available: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: data.error || "Something went wrong",
        });
      }
    } catch (error) {
      setMessage("Error adding cake");

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Failed to add cake",
      });
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
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Add Cake 🎂
          </h1>

          {message && (
            <p className="text-center text-sm text-green-500">{message}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Cake Name</label>
              <Input
                placeholder="Cake Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-white/70 dark:bg-pink-500/10 dark:text-white backdrop-blur-md"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Cake Category</label>
              <Input
                placeholder="Category (e.g. Birthday)"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="bg-white/70 dark:bg-pink-500/10 dark:text-white backdrop-blur-md"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Price</label>
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
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Rating</label>
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
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="bg-white/70 dark:bg-pink-500/10 dark:text-white backdrop-blur-md"
                required
              />
            </div>

            {/* FIX: attach ref here */}
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="bg-white/70 dark:bg-pink-500/10 dark:text-white backdrop-blur-md"
            />

            {uploading && (
              <p className="text-sm text-blue-500 text-center">
                Uploading image...
              </p>
            )}

            {formData.images?.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3">
                {formData.images.map((img, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <img
                      src={img}
                      alt={`preview-${index}`}
                      className="w-24 h-24 object-cover rounded-xl border"
                    />
                  </motion.div>
                ))}
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
