"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function AddCakePage() {
  const [formData, setFormData] = useState({
    title: "",
    shortDesc: "",
    fullDesc: "",
    price: "",
    image: "",
  });

  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Cake Data:", formData);

    // 👉 later you can send to database (Firebase / MongoDB)

    setMessage("Cake added successfully 🎉");

    setFormData({
      title: "",
      shortDesc: "",
      fullDesc: "",
      price: "",
      image: "",
    });
  };

  return (
    <ProtectedRoute>
      <div className="max-w-xl mx-auto py-10 space-y-6">
        <h1 className="text-2xl font-bold">Add Item</h1>

        {message && <p className="text-green-500 text-sm">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />

          <Input
            placeholder="Short Description"
            value={formData.shortDesc}
            onChange={(e) =>
              setFormData({ ...formData, shortDesc: e.target.value })
            }
            required
          />

          <Textarea
            placeholder="Full Description"
            value={formData.fullDesc}
            onChange={(e) =>
              setFormData({ ...formData, fullDesc: e.target.value })
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
            placeholder="Image URL (optional)"
            value={formData.image}
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.value })
            }
          />

          <Button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600"
          >
            Submit
          </Button>
        </form>
      </div>
    </ProtectedRoute>
  );
}
