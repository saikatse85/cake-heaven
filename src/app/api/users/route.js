import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

const normalizePhone = (phone) => {
  if (!phone) return "";
  return phone.replace(/\D/g, ""); // remove spaces, +, -
};

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      phone,
      password,
      image,
      address,
      uid,
      mode,
    } = body;

    const client = await clientPromise;
    const db = client.db("cake-heaven");
    const users = db.collection("users");

    // =========================
    // REGISTER
    // =========================
    if (mode === "register") {
      const queryList = [];
      if (email) queryList.push({ email });
      if (phone) queryList.push({ phone });

      let existingUser = null;
      if (queryList.length > 0) {
        existingUser = await users.findOne({ $or: queryList });
      }

      if (existingUser) {
        return Response.json(
          { success: false, message: "User with this email or phone already exists" },
          { status: 409 }
        );
      }

      const isFirebaseUser = !!email;

      const newUser = {
        name: name || "",
        email: email || "",
        phone: phone || "",
        image: image || "",
        address: address || "",
        uid: uid || null,
        role: "client",
        createdAt: new Date(),
        authType: isFirebaseUser ? "firebase" : "mongo",
        password: isFirebaseUser ? null : await bcrypt.hash(password, 10),
      };

      const result = await users.insertOne(newUser);

      return Response.json({
        success: true,
        message: "User registered successfully",
        user: newUser,
        insertedId: result.insertedId,
      });
    }

    // =========================
    // LOGIN (MONGO)
    // =========================
    if (mode === "login") {
      const isEmail = !!email;
      
      const query = isEmail ? { email } : { phone };
      const user = await users.findOne(query);

      if (!user) {
        return Response.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }

      if (user.authType === "firebase") {
        return Response.json({
          success: true,
          isFirebase: true,
          email: user.email,
        });
      }

      // MongoDB user
      if (!user.password) {
        return Response.json(
          { success: false, message: "Password not set" },
          { status: 400 }
        );
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return Response.json(
          { success: false, message: "Invalid credentials" },
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

    // =========================
    // GET PROFILE (Used after Firebase Login)
    // =========================
    if (mode === "get_profile") {
      let query = {};
      if (uid) {
        query = { uid };
      } else if (email) {
        query = { email };
      } else if (phone) {
        query = { phone };
      } else {
        return Response.json(
          { success: false, message: "No identifier provided" },
          { status: 400 }
        );
      }

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

    // =========================
    // RESET PASSWORD (MONGO ONLY)
    // =========================
    if (mode === "reset_password") {
      if (!phone) {
        return Response.json({ success: false, message: "Phone number is required" }, { status: 400 });
      }

      const user = await users.findOne({ phone });

      if (!user) {
        return Response.json({ success: false, message: "User not found" }, { status: 404 });
      }

      if (user.authType === "firebase") {
        return Response.json({ success: false, message: "This account uses email login. Please reset your password via email." }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await users.updateOne(
        { phone },
        { $set: { password: hashedPassword } }
      );

      return Response.json({ success: true, message: "Password updated successfully" });
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

// All user get
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