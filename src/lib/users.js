import AllUsers from "@/app/(dashboardLayout)/dashboard/all-user/page";

async function getUsers() {
  const res = await fetch("/users", {
    cache: "no-store",
  });
  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();

  return <AllUsers users={users}/>
}