import AllUsers from "@/components/Shared/AllUsers";

async function getUsers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <AllUsers users={users} />
    </div>
  );
}
