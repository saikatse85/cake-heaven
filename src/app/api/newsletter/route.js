import clientPromise from "@/lib/mongodb";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json(
        { success: false, error: "Email required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const client = await clientPromise;
    const db = client.db("cake-heaven");

    const exists = await db
      .collection("newsletter")
      .findOne({ email: normalizedEmail });

    if (exists) {
      return Response.json(
        { success: false, message: "Already subscribed" },
        { status: 409 }
      );
    }

    // Save to DB
    await db.collection("newsletter").insertOne({
      email: normalizedEmail,
      createdAt: new Date(),
    });

    //SEND EMAIL
    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: normalizedEmail,
      subject: "🎂 Welcome to Cake Heaven!",
      html: `
        <div style="font-family:sans-serif">
          <h2>🎉 Thanks for subscribing!</h2>
          <p>You got <b>20% OFF</b> on your first order.</p>
          <p>Use code: <b>FIRST20</b></p>
        </div>
      `,
    });

    return Response.json({
      success: true,
      message: "Subscribed + email sent 🎉",
    });
  } catch (error) {
    console.log(error);

    return Response.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}