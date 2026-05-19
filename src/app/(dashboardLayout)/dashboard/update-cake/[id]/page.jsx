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

  // ✅ FULL PREFILLED STRUCTURE (same as Add page)
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

  // =========================
  // LOAD DATA (PREFILL FIX)
  // =========================
  useEffect(() => {
    let isMounted = true;

    fetch(`/api/cakes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data) {
          setFormData({
            name: data.name || "",
            slug: data.slug || "",
            category: data.category || "",
            flavor: data.flavor || "",
            weight: data.weight || "1kg",
            type: data.type || "egg",
            price: data.price || "",
            discountPrice: data.discountPrice || "",
            stock: data.stock || "",
            rating: data.rating || "",
            preparationTime: data.preparationTime || "",
            description: data.description || "",
            ingredients: data.ingredients || "",
            image: data.image || "",
            images: data.images || [],
            featured: data.featured ?? false,
            bestSeller: data.bestSeller ?? false,
            available: data.available ?? true,
            status: data.status || "published",
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // =========================
  // IMAGE UPLOAD (UNCHANGED LOGIC)
  // =========================
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);

    try {
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const formDataUpload = new FormData();
          formDataUpload.append("file", file);

          const res = await fetch("/api/upload", {
            method: "POST",
            body: formDataUpload,
          });

          const data = await res.json();
          return res.ok ? data.url : null;
        }),
      );

      const validImages = uploadedImages.filter(Boolean);

      setFormData((prev) => ({
        ...prev,
        image: validImages[0] || prev.image,
        images: [...(prev.images || []), ...validImages],
      }));

      Swal.fire({
        icon: "success",
        title: "Images Updated 🎉",
        timer: 1200,
        showConfirmButton: false,
      });
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

  // =========================
  // UPDATE SUBMIT (UNCHANGED)
  // =========================
  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedCake = {
      ...formData,
      price: Number(formData.price),
      rating: Number(formData.rating),
      discountPrice: formData.discountPrice
        ? Number(formData.discountPrice)
        : 0,
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
          Edit Cake 🎂
        </h1>

        <form onSubmit={handleUpdate} className="space-y-5">
          {/* NAME */}
          <Input
            placeholder="Cake Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          {/* CATEGORY */}
          <Input
            placeholder="Category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          />

          {/* PRICE */}
          <Input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />

          {/* DISCOUNT */}
          <Input
            type="number"
            placeholder="Discount Price"
            value={formData.discountPrice}
            onChange={(e) =>
              setFormData({
                ...formData,
                discountPrice: e.target.value,
              })
            }
          />

          {/* STOCK */}
          <Input
            type="number"
            placeholder="Stock"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
          />

          {/* FLAVOR */}
          <Input
            placeholder="Flavor"
            value={formData.flavor}
            onChange={(e) =>
              setFormData({ ...formData, flavor: e.target.value })
            }
          />

          {/* DESCRIPTION */}
          <Textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
          />

          {/* MAIN IMAGE */}
          {formData.image && (
            <img
              src={formData.image}
              className="w-full h-64 object-cover rounded-2xl"
            />
          )}

          {/* MULTI IMAGES */}
          {formData.images?.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {formData.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
              ))}
            </div>
          )}

          {/* UPLOAD */}
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />

          {/* BUTTON */}
          <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
            {uploading ? "Uploading..." : "Update Cake"}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
