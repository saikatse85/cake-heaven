import { MongoClient } from "mongodb";

async function main() {
  const uri = "mongodb+srv://cake-heaven:WI1agxa0c7m1LJnV@cluster0.rwnfgfy.mongodb.net/?appName=Cluster0";
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("cake-heaven");
    const users = db.collection("users");
    
    // rename the old admin's phone number so it doesn't conflict
    await users.updateOne(
      { email: "admin@gmail.com", phone: "01717973719" },
      { $set: { phone: "01717973719-OLD" } }
    );
    console.log("Renamed old admin phone number to avoid conflict.");
  } finally {
    await client.close();
  }
}
main().catch(console.error);
