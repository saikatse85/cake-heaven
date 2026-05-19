import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET single cake
export async function GET(req, { params }) {
  try {
    const { id } =await params;
    
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

    const updateData = {
      name: body.name,
      category: body.category,
      price: Number(body.price),
      rating: Number(body.rating),
      description: body.description,
      available: body.available,
      discountPrice: Number(body.discountPrice),
    };
    if (body.image && body.image !== "") {
  updateData.image = body.image;
}

    const result = await db.collection("cakes").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    return Response.json({
      success: true,
      message: "Cake updated successfully",
      result,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
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