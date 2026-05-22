import { MongoClient } from "mongodb";

async function main() {
  const uri = "mongodb+srv://cake-heaven:WI1agxa0c7m1LJnV@cluster0.rwnfgfy.mongodb.net/?appName=Cluster0";
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("cake-heaven");
    const users = db.collection("users");
    const cursor = users.find({ phone: "01717973719" });
    const docs = await cursor.toArray();
    console.log(`Found ${docs.length} users with phone 01717973719`);
    docs.forEach(d => console.log(`- ID: ${d._id}, authType: ${d.authType}, email: ${d.email}, hasPassword: ${!!d.password}`));
  } finally {
    await client.close();
  }
}
main().catch(console.error);
