import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("Incoming review:", body);

    // Basic validation
    if (!body.cakeId || !body.rating || !body.comment) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("cake-heaven");

    //simple spam detection 
    const spamWords = ["http", "www", ".com", "telegram", "whatsapp", "free money", "click here",];
    const isSpam = spamWords.some((word) =>
      body.comment.toLowerCase().includes(word)
    );

    const review = {
      userName: body.userName || body.name || "Anonymous",
      userEmail: body.userEmail || "",
      photo: body.photo || "",

      cakeId: body.cakeId,
      cakeName: body.cakeName || "",

      rating: Number(body.rating),
      comment: body.comment,
      status: isSpam ? "spam" : "pending",

      createdAt: new Date().toISOString(),
    };

    const result = await db.collection("reviews").insertOne(review);

    return Response.json({
      message: "Review submitted successfully 🎉",
      insertedId: result.insertedId,
      review,
    });
  } catch (error) {
    console.error("Review API error:", error);

    return Response.json(
      {
        error: "Failed to submit review",
        details: error.message,
      },
      { status: 500 }
    );
  }
}


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const cakeId = searchParams.get("cakeId");
    const status = searchParams.get("status");

    const client = await clientPromise;
    const db = client.db("cake-heaven");

    let query = {};

    // If cakeId exists
    if (cakeId) {
      query.cakeId = cakeId;
    }

    // If status exists
    if (status) {
      query.status = status;
    }

    const reviews = await db
      .collection("reviews")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json(reviews);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
