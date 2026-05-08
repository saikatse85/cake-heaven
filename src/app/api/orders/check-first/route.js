import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  const client = await clientPromise;
  const db = client.db("cake-heaven");

  const order = await db.collection("orders").findOne({
    userEmail: email,
  });

  return Response.json({
    isFirstOrder: !order,
  });
}