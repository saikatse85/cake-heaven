import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-12 text-black dark:text-white">
      {/* Title */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          About Our Cake Shop 🎂
        </h1>

        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          We create delicious, handcrafted cakes that make every celebration
          special.
        </p>
      </div>

      {/* Image + Description Section */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Image */}
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <img
            src="/asset/img/cake-shop.jpg"
            alt="About Cake Shop"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Description */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Our Story</h2>

          <p className="text-gray-600 dark:text-gray-300">
            Our journey started with a passion for baking and a love for
            creating sweet memories. Every cake we make is crafted with care,
            using the finest ingredients to ensure the best taste and quality.
          </p>

          <p className="text-gray-600 dark:text-gray-300">
            From birthdays to weddings, we bring joy to every occasion with our
            custom-designed cakes and delightful flavors.
          </p>
        </div>
      </div>

      {/* Extra Info Section */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="text-center hover:shadow-lg transition bg-white dark:bg-zinc-900 border dark:border-zinc-800">
          <CardContent className="p-6 space-y-2">
            <h3 className="font-semibold text-lg text-pink-500 dark:text-pink-400">
              Fresh Ingredients
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              We use only high-quality and fresh ingredients in every cake.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition bg-white dark:bg-zinc-900 border dark:border-zinc-800">
          <CardContent className="p-6 space-y-2">
            <h3 className="font-semibold text-lg text-pink-500 dark:text-pink-400">
              Custom Designs
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Unique cake designs tailored for your special occasions.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition bg-white dark:bg-zinc-900 border dark:border-zinc-800">
          <CardContent className="p-6 space-y-2">
            <h3 className="font-semibold text-lg text-pink-500 dark:text-pink-400">
              Fast Delivery
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Quick and reliable delivery to make your moments stress-free.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
