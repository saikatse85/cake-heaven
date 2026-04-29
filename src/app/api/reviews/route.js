import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("Incoming review:", body); // 🔍 debug

    // ✅ Basic validation
    if (!body.cakeId || !body.rating || !body.comment) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("cake-heaven");

    const review = {
      userName: body.userName || body.name || "Anonymous",
      userEmail: body.userEmail || "",
      photo: body.photo || "",

      cakeId: body.cakeId,
      cakeName: body.cakeName || "",

      rating: Number(body.rating),
      comment: body.comment,

      createdAt: new Date().toISOString(),
    };

    const result = await db.collection("reviews").insertOne(review);

    return Response.json({
      message: "Review submitted successfully 🎉",
      insertedId: result.insertedId,
      review,
    });
  } catch (error) {
    console.error("Review API error:", error); // 🔥 IMPORTANT

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

    const client = await clientPromise;
    const db = client.db("cake-heaven");

    let query = {};

    // 🎯 If cakeId exists → filter
    if (cakeId) {
      query.cakeId = cakeId;
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

// export async function GET() {
//   try {
//     const client = await clientPromise;
//     const db = client.db("cake-heaven");

//     const reviews = await db
//       .collection("reviews")
//       .find({})
//       .sort({ createdAt: -1 })
//       .toArray();

//     return Response.json(reviews);
//   } catch (error) {
//     return Response.json(
//       { error: "Failed to fetch reviews" },
//       { status: 500 }
//     );
//   }
// }