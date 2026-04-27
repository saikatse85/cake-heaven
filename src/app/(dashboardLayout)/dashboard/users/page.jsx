import AllUsers from "@/components/Shared/AllUsers";

async function getUsers() {
  const res = await fetch("http://localhost:3000/api/users", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();

  return <AllUsers users={users} />;
}
