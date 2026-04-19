"use client";

import Container from "@/components/Shared/Container";
import { Button } from "@/components/ui/button";
import { Cake } from "lucide-react";

export default function Hero() {
  return (
    <div className="w-full bg-gradient-to-br from-pink-50 via-white to-rose-100 ">
      <Container>
        <section className="relative flex items-center justify-center py-4 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 left-10 w-72 h-72 bg-pink-300 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-rose-300 rounded-full blur-3xl"></div>
          </div>

          {/* Content */}
          <div className="relative text-center space-y-6">
            <div className="flex justify-center">
              <Cake className="w-12 h-12 text-pink-500" />
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Freshly Baked <span className="text-pink-500">Cakes</span> for
              Every Moment
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600 text-lg md:text-xl">
              Delicious custom cakes made with love. Perfect for birthdays,
              weddings, and special celebrations.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                className="bg-pink-500 hover:bg-pink-600 text-white px-8"
              >
                Order Now
              </Button>

              <Button size="lg" variant="outline">
                View Menu
              </Button>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
