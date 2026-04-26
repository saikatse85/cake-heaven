import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("cake-heaven");

    const result = await db.collection("orders").insertOne({
      userEmail: body.userEmail,
      userName: body.userName,     
      phone: body.phone,           
      cakeId: body.cakeId,
      cakeName: body.cakeName,
      price: body.price,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

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



export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    const client = await clientPromise;
    const db = client.db("cake-heaven");

    if (!email) {
      return Response.json([]); 
    }

    const query = {
      userEmail: email.trim(),
    };

    const orders = await db
      .collection("orders")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json(orders);
  } catch (error) {
    console.log("🔴 API ERROR:", error);

    return Response.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

