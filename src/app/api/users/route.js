import clientPromise from "@/lib/mongodb";


export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, password, image, address, uid, mode,emailVerified, } = body;

    const client = await clientPromise;
    const db = client.db("cake-heaven");
    const users = db.collection("users");

    // =========================
    //REGISTER MODE
    // =========================
    if (mode === "register") {
      const query = email ? { email } : { phone };
      const existingUser = await users.findOne(query);

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
        address: address || "",
        uid: uid || null,
        role: "client",
        createdAt: new Date(),
        emailVerified: emailVerified || false,
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
  const query = email ? { email } : { phone };
  const user = await users.findOne(query);

  if (!user) {
    return Response.json(
      { success: false, message: "User not found" },
      { status: 404 }
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