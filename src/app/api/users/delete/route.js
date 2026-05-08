import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function DELETE(req) {
  try {
    const body = await req.json();

    const { uid } = body;

    if (!uid) {
      return NextResponse.json(
        { message: "UID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;

    const db = client.db("cake-heaven");

    const usersCollection = db.collection("users");

    const result = await usersCollection.deleteOne({ uid });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 }
    );
  }
}