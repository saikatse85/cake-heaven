import { Button } from "@/components/ui/button";

export default function PromoBanner() {
  return (
    <section className="py-6 px-6">
      <div className="bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-2xl p-10 text-center space-y-4 shadow-lg">
        <h2 className="text-3xl md:text-4xl font-bold">
          Get 20% Off Your First Order 🎂
        </h2>

        <p className="text-white/90">
          Celebrate your moments with delicious handmade cakes.
        </p>

        <Button className="bg-white text-pink-600 hover:bg-gray-100">
          Order Now
        </Button>
      </div>
    </section>
  );
}
