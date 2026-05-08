"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function EditCakePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    rating: "",
    description: "",
    image: "",
    available: true,
  });

  useEffect(() => {
    let isMounted = true;

    fetch(`/api/cakes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setFormData({
            name: data.name || "",
            category: data.category || "",
            price: data.price || "",
            rating: data.rating || "",
            description: data.description || "",
            image: data.image || data.imageUrl || "",
            available: data.available ?? true,
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await res.json();

      if (res.ok) {
        setFormData((prev) => ({
          ...prev,
          image: data.url,
        }));

        Swal.fire({
          icon: "success",
          title: "Image Updated 🎉",
          timer: 1200,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Upload Failed",
          text: data.error || "Image upload failed",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Image upload failed",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedCake = {
      ...formData,
      price: Number(formData.price),
      rating: Number(formData.rating),
    };

    const res = await fetch(`/api/cakes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCake),
    });

    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "Updated Successfully 🎉",
        text: "Cake updated successfully",
        confirmButtonColor: "#ec4899",
      });

      router.push("/dashboard/manage-product");
    } else {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Something went wrong",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto py-10 px-4 text-black dark:text-white"
    >
      <div className="space-y-5 rounded-3xl border border-pink-200/50 dark:border-pink-500/20 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl shadow-xl p-6">
        <h1 className="text-2xl font-bold text-pink-600 dark:text-pink-400">
          Edit Cake
        </h1>

        <form onSubmit={handleUpdate} className="space-y-5">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Cake Name</label>
            <Input
              value={formData.name || ""}
              placeholder="Cake Name"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Category</label>
            <Input
              value={formData.category || ""}
              placeholder="Category"
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />
          </div>

          {/* Price */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Price</label>
            <Input
              type="number"
              value={formData.price || ""}
              placeholder="Price"
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
          </div>

          {/* Rating */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Rating</label>
            <Input
              type="number"
              value={formData.rating || ""}
              placeholder="Rating"
              onChange={(e) =>
                setFormData({ ...formData, rating: e.target.value })
              }
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description || ""}
              placeholder="Description"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
            />
          </div>

          {/* Image Preview */}
          {formData.image && (
            <motion.img
              key={formData.image}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              src={formData.image}
              className="w-full h-64 object-cover rounded-2xl"
              alt="preview"
            />
          )}

          {/* Upload */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Upload Image</label>
            <Input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>

          {/* Image URL */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Image URL</label>
            <Input
              value={formData.image || ""}
              placeholder="Image URL"
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
            />
          </div>

          <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
            {uploading ? "Uploading..." : "Update Cake"}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
