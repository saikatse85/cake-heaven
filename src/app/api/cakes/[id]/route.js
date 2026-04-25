import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET single cake
export async function GET(req, { params }) {
  try {
    const { id } =await params;
    console.log(id);
    
    const client = await clientPromise;
    const db = client.db("cake-heaven");

    const cake = await db
      .collection("cakes")
      .findOne({ _id: new ObjectId(id) });

    return Response.json(cake);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch cake" },
      { status: 500 }
    );
  }
}

// UPDATE cake
export async function PUT(req, { params }) {
  try {
    const { id } =await params;

    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("cake-heaven");

    const result = await db.collection("cakes").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: body.name,
          category: body.category,
          price: Number(body.price),
          rating: Number(body.rating),
          description: body.description,
          image: body.image,
          available: body.available,
        },
      }
    );

    return Response.json({
      message: "Updated",
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return Response.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE cake
export async function DELETE(req, { params }) {
  try {
    const { id } =await params;

    console.log("DELETE ID:", id);

    const client = await clientPromise;
    const db = client.db("cake-heaven");

    const result = await db.collection("cakes").deleteOne({
      _id: new ObjectId(id),
    });

    console.log("DELETE RESULT:", result);

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: "Delete failed" }, { status: 500 });
  }
}