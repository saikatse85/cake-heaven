let idToken = null;

export async function getBkashToken() {
  const res = await fetch(`${process.env.BKASH_BASE_URL}/tokenized/checkout/token/grant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      username: process.env.BKASH_USERNAME,
      password: process.env.BKASH_PASSWORD,
    },
    body: JSON.stringify({
      app_key: process.env.BKASH_APP_KEY,
      app_secret: process.env.BKASH_APP_SECRET,
    }),
  });

  const data = await res.json();
  idToken = data.id_token;
  return idToken;
}