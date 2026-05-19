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
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "",
    flavor: "",
    weight: "1kg",
    type: "egg",
    price: "",
    discountPrice: "",
    stock: "",
    rating: "",
    preparationTime: "",
    description: "",
    ingredients: "",
    image: "",
    images: [],
    featured: false,
    bestSeller: false,
    available: true,
    status: "published",
  });

  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    setUploading(true);

    try {
      setUploadProgress(30);
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
      setUploadProgress(100);
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

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
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
          slug: "",
          category: "",
          flavor: "",
          weight: "1kg",
          type: "egg",
          price: "",
          discountPrice: "",
          stock: "",
          rating: "",
          preparationTime: "",
          description: "",
          ingredients: "",
          image: "",
          images: [],
          featured: false,
          bestSeller: false,
          available: true,
          status: "published",
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
            Add Dessert 🎂
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
                onChange={(e) => {
                  const value = e.target.value;

                  setFormData({
                    ...formData,
                    name: value,
                    slug: generateSlug(value),
                  });
                }}
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
            {/* Stock field */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Stock Quantity</label>

              <Input
                type="number"
                placeholder="Stock Quantity"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                className="bg-white/70 dark:bg-pink-500/10 dark:text-white backdrop-blur-md"
              />
            </div>
            {/* Flavour field */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Flavor</label>

              <Input
                placeholder="Chocolate / Vanilla / Red Velvet"
                value={formData.flavor}
                onChange={(e) =>
                  setFormData({ ...formData, flavor: e.target.value })
                }
                className="bg-white/70 dark:bg-pink-500/10 dark:text-white backdrop-blur-md"
              />
            </div>
            {/* weight field */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Cake Weight</label>

              <select
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
                className="w-full rounded-md border bg-white/70 dark:bg-pink-500/10 p-3 dark:text-white"
              >
                <option value="500gm">500gm</option>
                <option value="1pound">1 Pound</option>
                <option value="2pound">2 Pound</option>
                <option value="3pound">3 Pound</option>
                <option value="1kg">1kg</option>
                <option value="2kg">2kg</option>
                <option value="3kg">3kg</option>
              </select>
            </div>
            {/* Egg or Eggless field */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Cake Type</label>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={formData.type === "egg"}
                    onChange={() => setFormData({ ...formData, type: "egg" })}
                  />
                  Egg
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={formData.type === "eggless"}
                    onChange={() =>
                      setFormData({ ...formData, type: "eggless" })
                    }
                  />
                  Eggless
                </label>
              </div>
            </div>
            {/* Discount Price */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Discount Price</label>

              <Input
                type="number"
                placeholder="Discount Price"
                value={formData.discountPrice}
                onChange={(e) =>
                  setFormData({ ...formData, discountPrice: e.target.value })
                }
                className="bg-white/70 dark:bg-pink-500/10 dark:text-white backdrop-blur-md"
              />
            </div>
            {/* Preparation Time field */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Preparation Time</label>

              <Input
                placeholder="2 hours / Same Day"
                value={formData.preparationTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preparationTime: e.target.value,
                  })
                }
                className="bg-white/70 dark:bg-pink-500/10 dark:text-white backdrop-blur-md"
              />
            </div>
            {/* Product Status */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Product Status</label>

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full rounded-md border bg-white/70 dark:bg-pink-500/10 p-3 dark:text-white"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>

            {/* Featured Product */}
            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      featured: e.target.checked,
                    })
                  }
                />
                Featured Product
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.bestSeller}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bestSeller: e.target.checked,
                    })
                  }
                />
                Bestseller
              </label>
            </div>

            {/* Ingredients */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Ingredients</label>

              <Textarea
                placeholder="Chocolate, Cream, Flour..."
                value={formData.ingredients}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ingredients: e.target.value,
                  })
                }
                className="bg-white/70 dark:bg-pink-500/10 dark:text-white backdrop-blur-md"
              />
            </div>

            {/* Ratting field */}
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
              <p className="text-xs text-right text-gray-500">
                {formData.description.length}/300
              </p>
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
            {/* uploadProgress */}
            {uploading && (
              <div className="space-y-2">
                <p className="text-sm text-blue-500 text-center">
                  Uploading {uploadProgress}%
                </p>

                <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    style={{ width: `${uploadProgress}%` }}
                    className="h-full bg-pink-500 transition-all duration-300"
                  />
                </div>
              </div>
            )}

            {formData.images?.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3">
                {formData.images.map((img, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative"
                  >
                    <img
                      src={img}
                      alt={`preview-${index}`}
                      className="w-24 h-24 object-cover rounded-xl border"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        const updatedImages = formData.images.filter(
                          (_, i) => i !== index,
                        );

                        setFormData({
                          ...formData,
                          images: updatedImages,
                          image: updatedImages[0] || "",
                        });
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs"
                    >
                      ✕
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            <Button
              type="submit"
              disabled={uploading}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white shadow-lg h-12 text-base font-semibold"
            >
              {uploading ? "Uploading..." : "Add Cake"}
            </Button>
          </form>
        </motion.div>
        <div className="mt-8 rounded-2xl border border-pink-200/20 p-5 bg-white/10 backdrop-blur-xl">
          <h2 className="text-lg font-bold mb-4">Live Preview</h2>

          <div className="space-y-3">
            {formData.image && (
              <img
                src={formData.image}
                alt="preview"
                className="w-full h-56 object-cover rounded-xl"
              />
            )}

            <div>
              <h3 className="text-xl font-bold">
                {formData.name || "Cake Name"}
              </h3>

              <p className="text-sm opacity-70">
                {formData.category || "Category"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-pink-500 font-bold text-lg">
                ৳{formData.discountPrice || formData.price || 0}
              </span>

              {formData.discountPrice && (
                <span className="line-through text-sm opacity-60">
                  ৳{formData.price}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              {formData.weight && (
                <span className="px-2 py-1 rounded-full bg-pink-500/20">
                  {formData.weight}
                </span>
              )}

              {formData.flavor && (
                <span className="px-2 py-1 rounded-full bg-pink-500/20">
                  {formData.flavor}
                </span>
              )}

              {formData.type && (
                <span className="px-2 py-1 rounded-full bg-pink-500/20 capitalize">
                  {formData.type}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
