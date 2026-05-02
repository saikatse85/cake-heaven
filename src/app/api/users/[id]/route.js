import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    const { id } = await params; 
    console.log("👉 Requested ID:", id);
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
      console.log("👉 MongoDB user by uid:", user);
    }
    if (!user) {
      // 🔍 try email fallback (optional safety layer)
      user = await db.collection("users").findOne({
        email: id,
      });
    }

// =========================
    // 2️⃣ ADDITION: SMART FALLBACK (SAFE)
    // =========================
    if (!user) {
      // 🔍 try email fallback (optional safety layer)
      user = await db.collection("users").findOne({
        email: id,
      });
    }

    // =========================
    // 3️⃣ OPTIONAL DEBUG HELP (REMOVE LATER IF YOU WANT)
    // =========================
    console.log("👉 Requested ID:", id);
    console.log("👉 Found User:", user);


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