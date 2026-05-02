import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    const { id } = await params; 
    const client = await clientPromise;
    const db = client.db("cake-heaven");

    let user = await db.collection("users").findOne({
      uid: id,
      
    });

    // fallback by _id
    if (!user && ObjectId.isValid(id)) {
      user = await db.collection("users").findOne({
        _id: new ObjectId(id),
      });
    }
    if (!user) {
      // email fallback 
      user = await db.collection("users").findOne({
        email: id,
      });
    }
    if (!user) {
      // email fallback 
      user = await db.collection("users").findOne({
        email: id,
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