import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// UPDATE REVIEW
export async function PUT(req, { params }) {
  try {
    const { id } = await params;

    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("cake-heaven");

    const updateData = {};

    // Update comment 
    if (body.comment) {
      updateData.comment = body.comment;
    }

    // Update rating 
    if (body.rating) {
      updateData.rating = Number(body.rating);
    }

    // Update status
    if (body.status) {
      updateData.status = body.status;
    }

    //admin can mark as reviewed
    if (body.reviewedByAdmin !== undefined) {
      updateData.reviewedByAdmin = body.reviewedByAdmin;
    }

    //timestamp for moderation tracking
    updateData.updatedAt = new Date().toISOString();

    const result = await db.collection("reviews").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: updateData,
      }
    );

    return Response.json({
      message: "Review updated successfully",
      result,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

// DELETE REVIEW
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    const client = await clientPromise;
    const db = client.db("cake-heaven");

    const result = await db.collection("reviews").deleteOne({
      _id: new ObjectId(id),
    });

    return Response.json({
      message: "Review deleted successfully",
      result,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}