import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";


export async function PATCH(req, { params }) {
  try {
    const { id } =await params;
    const { status } = await req.json();

    const client = await clientPromise;
    const db = client.db("cake-heaven");

    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(id) }, // ✅ must match ObjectId
      { $set: { status } }
    );

    return Response.json({
      success: true,
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });
  } catch (error) {
    console.error("PATCH ERROR:", error);

    return Response.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}

// Delete Api

export async function DELETE(req, { params }) {
  try {
    const { id } =await params;

    const client = await clientPromise;
    const db = client.db("cake-heaven");

    await db.collection("orders").deleteOne({
      _id: new ObjectId(id),
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}
