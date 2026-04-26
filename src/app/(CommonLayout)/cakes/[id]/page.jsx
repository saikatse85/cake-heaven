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

  const relatedRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/cakes`,
    {
      cache: "no-store",
    },
  );

  const allCakes = await relatedRes.json();

  // filter related
  const relatedCakes = allCakes
    .filter((item) => item.category === cake.category && item._id !== cake._id)
    .slice(0, 4);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      {/* Back Button */}
      <Link href="/cakes">
        <Button variant="outline">← Back to Items</Button>
      </Link>

      {/* Main Section */}
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="overflow-hidden rounded-2xl">
          <img
            src={cake.image}
            alt={cake.name}
            className="w-full h-80 object-cover"
          />
        </Card>

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

      {/* ✅ Related Products (FIXED POSITION) */}
      {relatedCakes.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Related Cakes 🎂</h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedCakes.map((item) => (
              <Card
                key={item._id}
                className="overflow-hidden rounded-xl hover:shadow-lg transition"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 object-cover"
                />

                <CardContent className="p-4 space-y-2">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-pink-500 font-bold">${item.price}</p>

                  <Link href={`/cakes/${item._id}`}>
                    <Button size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
