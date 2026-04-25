"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ManageProduct() {
  const [cakes, setCakes] = useState([]);

  // Load data
  useEffect(() => {
    fetch("/api/cakes")
      .then((res) => res.json())
      .then((data) => setCakes(data));
  }, []);

  // Delete handler
  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/cakes/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setCakes((prev) => prev.filter((item) => item._id !== id));
      alert("Delete Successfully");
    } else {
      alert("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900">Manage Cakes 🎂</h1>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cakes.map((cake) => (
          <Card
            key={cake._id}
            className="rounded-2xl overflow-hidden hover:shadow-xl transition"
          >
            <img
              src={cake.image}
              alt={cake.name}
              className="h-40 w-full object-cover"
            />

            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold text-lg">{cake.name}</h3>

              <p className="text-sm text-gray-500 line-clamp-2">
                {cake.description}
              </p>

              <p className="text-pink-500 font-bold">$ {cake.price}</p>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Link
                  href={`/dashboard/update-cake/${cake._id}`}
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    className="w-full border-pink-400 hover:bg-pink-400"
                  >
                    Edit
                  </Button>
                </Link>

                <Button
                  variant="destructive"
                  className="w-1/2 bg-pink-500 hover:bg-pink-600 text-white"
                  onClick={() => handleDelete(cake._id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
