import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("cake-heaven");

    const orders = await db.collection("orders").find({}).toArray();
return Response.json(orders);
    // const orders = await db
    //   .collection("orders")
    //   .find({})
    //   .sort({ createdAt: -1 })
    //   .toArray();

    // return Response.json(orders);
  } catch (error) {
    console.log("🔴 ADMIN API ERROR:", error);

    return Response.json(
      { error: "Failed to fetch all orders" },
      { status: 500 }
    );
  }
}