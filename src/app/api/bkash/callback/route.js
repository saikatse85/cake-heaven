import { getBkashToken } from "@/lib/bkash";
import { redirect } from "next/navigation";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const paymentID = searchParams.get("paymentID");
  const status = searchParams.get("status");

  if (status !== "success") {
    return redirect("/payment-failed");
  }

  const token = await getBkashToken();

  const res = await fetch(
    `${process.env.BKASH_BASE_URL}/tokenized/checkout/execute`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
        "x-app-key": process.env.BKASH_APP_KEY,
      },
      body: JSON.stringify({ paymentID }),
    }
  );

  const data = await res.json();

  if (data.transactionStatus === "Completed") {
    return redirect("/payment-success");
  } else {
    return redirect("/payment-failed");
  }
}