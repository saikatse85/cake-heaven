import clientPromise from "@/lib/mongodb";

export async function GET(req, { params }) {
  try {
    const { id } =await params;

    const client = await clientPromise;
    const db = client.db("cake-heaven");

    const user = await db.collection("users").findOne({ uid: id });

    return Response.json(user || {});
  } catch (error) {
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}