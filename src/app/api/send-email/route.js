import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { email } = await req.json();

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "🎉 Welcome to Cake Heaven - Your Discount Inside!",
      html: `
        <div style="font-family: Arial; padding: 10px">
          <h2>🎉 Welcome to Cake Heaven</h2>

          <p>Thanks for joining us!</p>

          <h3 style="color: #ec4899;">
            Use code: <b>FIRST20</b>
          </h3>

          <p>Get <b>20% OFF</b> your first order 🎂</p>

          <p>Start ordering your favorite cakes now!</p>
        </div>
      `,
    });

    return Response.json({
      success: true,
      data,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}