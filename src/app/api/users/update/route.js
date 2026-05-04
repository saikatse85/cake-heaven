import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function PATCH(req) {
  try {
    const body = await req.json();

    const { uid, name, phone, address, image } = body;
console.log(uid);

    if (!uid) {
      return NextResponse.json(
        { message: "UID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("cake-heaven"); 

    const users = db.collection("users");

    
    const updateData = {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(address && { address }),
      ...(image && { image }),
      updatedAt: new Date(),
    };

    const result = await users.updateOne(
      { uid },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Update Error:", error);

    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}