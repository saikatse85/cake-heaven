import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("cake-heaven");

    let user = await db.collection("users").findOne({
      uid: params.id,
    });

    // 🔥 fallback by _id (ONLY IF NEEDED)
    if (!user && ObjectId.isValid(params.id)) {
      user = await db.collection("users").findOne({
        _id: new ObjectId(params.id),
      });
    }

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return Response.json(user);
  } catch (error) {
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}