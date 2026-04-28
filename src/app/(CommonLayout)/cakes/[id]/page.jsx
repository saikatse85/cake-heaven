import CakeDetailsClient from "@/components/Shared/CakeDetailsClient";

export default async function CakeDetails({ params }) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/cakes/${id}`,
    { cache: "no-store" },
  );

  if (!res.ok) throw new Error("Failed to fetch cake");

  const cake = await res.json();

  const relatedRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/cakes`,
    { cache: "no-store" },
  );

  const allCakes = await relatedRes.json();

  const relatedCakes = allCakes
    .filter((item) => item.category === cake.category && item._id !== cake._id)
    .slice(0, 4);

  return <CakeDetailsClient cake={cake} relatedCakes={relatedCakes} />;
}
