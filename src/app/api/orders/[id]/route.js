import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";


export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const { status } = await req.json();

    const client = await clientPromise;
    const db = client.db("cake-heaven");

    await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { status },
      }
    );

    return Response.json({ message: "Status updated" });
  } catch (error) {
    return Response.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}

