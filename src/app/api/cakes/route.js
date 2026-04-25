import clientPromise from "@/lib/mongodb";

// POST PROMISE
export async function POST(req) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("cake-heaven");

    const cakesCollection = db.collection("cakes");

    const result = await cakesCollection.insertOne({
      ...body,
      createdAt: new Date(),
    });

    return Response.json({
      message: "Cake added successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    return Response.json(
      { error: "Failed to add cake" },
      { status: 500 }
    );
  }
}

// GET ALL PROMISE

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("cake-heaven");

    const cakesCollection = db.collection("cakes");

    const cakes = await cakesCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json(cakes);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch cakes" },
      { status: 500 }
    );
  }
}


