"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";

export function FeaturedCakes() {
  const [cakes, setCakes] = useState([]);

  useEffect(() => {
    fetch("/api/cakes")
      .then((res) => res.json())
      .then((data) => setCakes(data));
  }, []);

  return (
    <section className="py-16 px-6 bg-white dark:bg-zinc-950 text-black dark:text-white">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-center mb-10">Featured Cakes</h2>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cakes?.slice(0, 6).map((cake, i) => (
          <Card
            key={i}
            className="hover:shadow-xl transition rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border dark:border-zinc-800"
          >
            <img
              src={cake?.image}
              className="h-48 w-full object-cover"
              alt={cake?.name}
            />

            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold text-lg text-black dark:text-white">
                {cake?.name}
              </h3>

              {/* Description */}
              <p className="text-gray-500 dark:text-gray-300 text-sm line-clamp-2">
                {cake?.description}
              </p>

              <p className="text-pink-500 font-bold">$ {cake?.price} Only</p>

              <Link href={`/cakes/${cake._id}`}>
                <Button className="w-full text-white bg-pink-500 hover:bg-pink-600 cursor-pointer mt-2">
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View All Button */}
      <div className="flex justify-center mt-10">
        <Link href="/cakes">
          <Button
            variant="outline"
            className="px-8 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white dark:border-pink-400 dark:text-pink-300"
          >
            View All Cakes
          </Button>
        </Link>
      </div>
    </section>
  );
}
