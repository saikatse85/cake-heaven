import { Card, CardContent } from "@/components/ui/card";

const reviews = [
  { name: "Ayesha", text: "Best cake I ever had! Super fresh." },
  { name: "Rahim", text: "Delivery was fast and taste amazing." },
  { name: "Nadia", text: "Perfect for my birthday party!" },
];

export default function Reviews() {
  return (
    <section className="py-16 px-6 bg-white dark:bg-zinc-950 text-black dark:text-white">
      {/* Title */}
      <h2 className="text-3xl font-bold text-center mb-10">Happy Customers</h2>

      {/* Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {reviews.map((r, i) => (
          <Card
            key={i}
            className="hover:shadow-lg transition rounded-2xl bg-white dark:bg-zinc-900 border dark:border-zinc-800"
          >
            <CardContent className="p-6 space-y-3">
              <p className="text-gray-600 dark:text-gray-300">{r.text}</p>

              <h4 className="font-semibold text-pink-500 dark:text-pink-400">
                - {r.name}
              </h4>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
