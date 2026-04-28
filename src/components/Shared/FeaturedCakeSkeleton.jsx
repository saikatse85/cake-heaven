"use client";

import { Card, CardContent } from "@/components/ui/card";

export function FeaturedCakesSkeleton() {
  return (
    <section className="py-16 px-6 bg-white dark:bg-zinc-950">
      <h2 className="text-3xl font-bold text-center mb-10 text-transparent bg-gray-300 dark:bg-zinc-800 animate-pulse rounded">
        Featured Cakes
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card
            key={i}
            className="rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border dark:border-zinc-800"
          >
            {/* Image skeleton */}
            <div className="h-48 w-full bg-gray-200 dark:bg-zinc-800 animate-pulse" />

            <CardContent className="p-4 space-y-3">
              {/* Title */}
              <div className="h-5 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />

              {/* Description */}
              <div className="space-y-2">
                <div className="h-3 w-full bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="h-3 w-5/6 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
              </div>

              {/* Price */}
              <div className="h-4 w-1/3 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />

              {/* Button */}
              <div className="h-10 w-full bg-gray-200 dark:bg-zinc-800 rounded animate-pulse mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom button skeleton */}
      <div className="flex justify-center mt-10">
        <div className="h-10 w-40 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
      </div>
    </section>
  );
}
