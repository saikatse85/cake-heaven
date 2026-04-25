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
      <div className="max-w-xl mx-auto py-10 space-y-6">
        <h1 className="text-2xl font-bold">Add Cake</h1>

        {message && <p className="text-green-500 text-sm">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Cake Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            placeholder="Category (e.g. Birthday)"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            required
          />

          <Input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
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
            required
          />

          <Textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />

          <Input
            placeholder="Image URL"
            value={formData.image}
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.value })
            }
          />

          <Button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600"
          >
            Add Cake
          </Button>
        </form>
      </div>
    </ProtectedRoute>
  );
}
