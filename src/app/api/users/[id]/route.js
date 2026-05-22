import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const client = await clientPromise;
    const db = client.db("cake-heaven");

    let user = null;

    // 1. UID check
    user = await db.collection("users").findOne({
      uid: id,
    });

    // 2. Mongo _id fallback
    if (!user && ObjectId.isValid(id)) {
      user = await db.collection("users").findOne({
        _id: new ObjectId(id),
      });
    }

    // 3. Email fallback
    if (!user) {
      user = await db.collection("users").findOne({
        email: id,
      });
    }

    // 4. Phone fallback  ← ADD THIS
    if (!user) {
      user = await db.collection("users").findOne({
        $or: [
      { phone: id },
      { phoneNumber: id },
    ],
      });
    }

    // optional if your DB field name is "phone"
    if (!user) {
      user = await db.collection("users").findOne({
        $or: [
      { phone: id },
      { phoneNumber: id },
    ],
      });
    }

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      user,
    });

  } catch (error) {
    console.log(error);

    return Response.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 }
    );
  }
}