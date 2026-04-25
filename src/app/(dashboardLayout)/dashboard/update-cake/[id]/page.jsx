"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function EditCakePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    rating: "",
    description: "",
    image: "",
    available: true,
  });

  // Load single cake
  useEffect(() => {
    fetch(`/api/cakes/${id}`)
      .then((res) => res.json())
      .then((data) => setFormData(data));
  }, [id]);

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
      alert("Updated successfully 🎉");
      router.push("/dashboard/manage-product");
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 space-y-4">
      <h1 className="text-2xl font-bold">Edit Cake</h1>

      <form onSubmit={handleUpdate} className="space-y-4">
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <Input
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
        />

        <Input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />

        <Input
          type="number"
          value={formData.rating}
          onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
        />

        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <Input
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        />

        <Button className="w-full bg-pink-500 hover:bg-pink-600">
          Update Cake
        </Button>
      </form>
    </div>
  );
}
