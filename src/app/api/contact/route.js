import clientPromise from "@/lib/mongodb";


export async function POST(req) {
  try {
    const body = await req.json();

    const { name, email, phone, message } = body;

    if (!name || !email || !phone || !message) {
      return Response.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("cake-heaven");
    const contactCollection = db.collection("contacts");

    const result = await contactCollection.insertOne({
      name,
      email,
      phone,
      message,
      createdAt: new Date(),
    });

    return Response.json({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}