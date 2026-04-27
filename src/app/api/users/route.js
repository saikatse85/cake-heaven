import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("cake-heaven"); // database name

    const usersCollection = db.collection("users");

    const result = await usersCollection.insertOne({
      name: body.name,
      email: body.email,
      uid: body.uid,
      role: body.role || "client",
      createdAt: new Date(),
    });

    return Response.json({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

//All user get

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("cake-heaven");

    const users = await db
      .collection("users")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json(users);
  } catch (error) {
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}