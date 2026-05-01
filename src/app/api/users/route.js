import clientPromise from "@/lib/mongodb";


export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, password, image, uid, mode } = body;

    const client = await clientPromise;
    const db = client.db("cake-heaven");
    const users = db.collection("users");

    // =========================
    // 🔐 REGISTER MODE
    // =========================
    if (mode === "register") {
      const existingUser = await users.findOne({
        $or: [
          email ? { email } : null,
          phone ? { phone } : null,
        ].filter(Boolean),
      });

      if (existingUser) {
        return Response.json(
          { success: false, message: "User already exists" },
          { status: 409 }
        );
      }

      const newUser = {
        name: name || "",
        email: email || "",
        phone: phone || "",
        image: image || "",
        uid: uid || null,
        password: password || "",
        role: "client",
        createdAt: new Date(),
      };

      const result = await users.insertOne(newUser);

      return Response.json({
        success: true,
        message: "User registered successfully",
        user: newUser,
        insertedId: result.insertedId,
      });
    }

if (mode === "login") {
  const user = await users.findOne({
    $or: [
      email ? { email } : null,
      phone ? { phone } : null,
    ].filter(Boolean),
  });

  if (!user) {
    return Response.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }

  // ✅ password check (ONLY HERE)
  if (user.password !== password) {
    return Response.json(
      { success: false, message: "Invalid password" },
      { status: 401 }
    );
  }

  return Response.json({
    success: true,
    user: {
      uid: user.uid,
      name: user.name,
      email: user.email,
      phone: user.phone,
      image: user.image,
      role: user.role,
    },
  });
}
    return Response.json(
      { success: false, message: "Invalid mode" },
      { status: 400 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
//All user get

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("cake-heaven");

    const users = await db
      .collection("users")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json(users);
  } catch (error) {
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}