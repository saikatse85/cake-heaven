import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("cake-heaven");

    const users = db.collection("users");

    // check if already exists
    const existingUser = await users.findOne({ uid: body.uid });

    if (existingUser) {
      return Response.json(existingUser);
    }

    const newUser = {
      name: body.name || "",
      email: body.email,
      uid: body.uid,
      role: "client",
      createdAt: new Date(),
    };

    await users.insertOne(newUser);

    return Response.json(newUser);
  } catch (error) {
    return Response.json(
      { error: "Failed to create user" },
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