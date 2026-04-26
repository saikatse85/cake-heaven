import OrderButton from "@/components/Shared/OrderButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default async function CakeDetails({ params }) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/cakes/${id}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch cake");
  }

  const cake = await res.json();

  if (!cake) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold">Cake not found</h2>
        <Link href="/cakes">
          <Button className="mt-4">Back to Cakes</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      {/* Back Button */}
      <Link href="/cakes">
        <Button variant="outline">← Back to Items</Button>
      </Link>

      {/* Main Section */}
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Image */}
        <Card className="overflow-hidden rounded-2xl">
          <img
            src={cake.image}
            alt={cake.name}
            className="w-full h-80 object-cover"
          />
        </Card>

        {/* Info */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{cake.name}</h1>

          <p className="text-gray-600">{cake.description}</p>

          <p className="text-pink-500 text-2xl font-bold">
            Price : $ {cake.price}
          </p>

          <div className="flex gap-2 text-sm">
            <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full">
              {cake.category}
            </span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">
              {cake.createdAt}
            </span>
          </div>

          {/* Order Now Button */}
          <OrderButton cakeId={cake._id} />
        </div>
      </div>

      {/* Specifications */}
      <Card>
        <CardContent className="p-6 space-y-3">
          <h2 className="text-xl font-semibold">Specifications</h2>
          <ul className="text-gray-600 space-y-1">
            <li>Size: {cake.specs?.size}</li>
            <li>Flavor: {cake.specs?.flavor}</li>
            <li>Serving: {cake.specs?.serving}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
