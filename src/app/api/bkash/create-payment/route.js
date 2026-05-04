import { getBkashToken } from "@/lib/bkash";

export async function POST(req) {
  const { amount } = await req.json();

  const token = await getBkashToken();

  const res = await fetch(
    `${process.env.BKASH_BASE_URL}/tokenized/checkout/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
        "x-app-key": process.env.BKASH_APP_KEY,
      },
      body: JSON.stringify({
        mode: "0011",
        payerReference: "user_ref",
        callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/bkash/callback`,
        amount: amount.toString(),
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: "inv_" + Date.now(),
      }),
    }
  );

  const data = await res.json();
  return Response.json(data);
}