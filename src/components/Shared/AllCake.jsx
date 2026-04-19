"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";

export function AllCakes() {
  const [cakes, setCakes] = useState([]);

  useEffect(() => {
    fetch("/data/cakes.json")
      .then((res) => res.json())
      .then((data) => setCakes(data));
  }, []);
  return (
    <section className="py-16 px-6">
      <h2 className="text-3xl font-bold text-center mb-10">
        All Featured Cakes
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cakes?.map((cake, i) => (
          <Card
            key={i}
            className="hover:shadow-xl transition rounded-2xl overflow-hidden"
          >
            <img
              src={cake?.image}
              className="h-48 w-full object-cover"
              alt={cake?.name}
            />
            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold text-lg">{cake?.name}</h3>

              {/* Short description (2 lines max) */}
              <p className="text-gray-500 text-sm line-clamp-2">
                {cake?.description}
              </p>

              <p className="text-pink-500 font-bold">$ {cake?.price} Only</p>

              <Link href={`/cakes/${cake.id}`}>
                <Button className="w-full mt-2">View Details</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
