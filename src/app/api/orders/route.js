import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("cake-heaven");

    const result = await db.collection("orders").insertOne(body);

    return Response.json({
      message: "Order created",
      insertedId: result.insertedId,
    });
  } catch (error) {
    return Response.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}


export async function GET() {
  const client = await clientPromise;
  const db = client.db("cake-heaven");

  const orders = await db
    .collection("orders")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return Response.json(orders);
}