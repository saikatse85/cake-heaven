import { Card, CardContent } from "@/components/ui/card";
import { Heart, Truck, Sparkles } from "lucide-react";
import Container from "./Container";

const features = [
  { icon: Heart, title: "Made with Love", desc: "Every cake is handcrafted." },
  { icon: Truck, title: "Fast Delivery", desc: "Fresh cakes delivered fast." },
  {
    icon: Sparkles,
    title: "Premium Quality",
    desc: "Only best ingredients used.",
  },
];

export function Features() {
  return (
    <section className="py-16 px-6 bg-pink-50 dark:bg-zinc-950">
      <Container>
        <h2 className="text-3xl font-bold text-center mb-10 text-black dark:text-white">
          Why Choose Us
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <Card
              key={i}
              className="text-center p-6 hover:scale-105 transition bg-white dark:bg-zinc-900 border dark:border-zinc-800"
            >
              <CardContent className="space-y-3">
                <f.icon className="mx-auto text-pink-500 w-10 h-10" />

                <h3 className="font-semibold text-lg text-black dark:text-white">
                  {f.title}
                </h3>

                <p className="text-gray-500 dark:text-gray-300 text-sm">
                  {f.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
