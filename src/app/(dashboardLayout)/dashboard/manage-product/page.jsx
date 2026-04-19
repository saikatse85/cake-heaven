"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ManageItems() {
  const [cakes, setCakes] = useState([]);

  // Load data
  useEffect(() => {
    fetch("/data/cakes.json")
      .then((res) => res.json())
      .then((data) => setCakes(data));
  }, []);

  // Delete handler
  const handleDelete = (id) => {
    const confirmDelete = confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    const updated = cakes.filter((item) => item.id !== id);
    setCakes(updated);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900">Manage Cakes 🎂</h1>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cakes.map((cake) => (
          <Card
            key={cake.id}
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
                <Link href={`/items/${cake.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View
                  </Button>
                </Link>

                <Button
                  variant="destructive"
                  className="w-full bg-pink-500 hover:bg-pink-600"
                  onClick={() => handleDelete(cake.id)}
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
