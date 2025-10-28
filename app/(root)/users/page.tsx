import { DataTable } from "@/app/components/table/DataTable";
import UserForm from "@/app/components/UserForm";
import { PrismaClient } from "@prisma/client";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  avatar: string;
}

interface UserTableProps {
  users: User[];
}

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "country", header: "Country" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Phone" },
];

async function getUsers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
    cache: "no-store", // Always fresh
  });
  return res.json().then((data) => data.users);
}

export default async function Page() {
  const users = await getUsers();

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="max-w-5xl mx-auto p-6 h-[95vh] flex flex-col">
        <h1 className="text-2xl font-bold mb-4">Users</h1>

        {/* Client Form */}
        {/* <UserForm onSuccess={() => window.location.reload()} /> */}

        {/* Server-Side Table */}
        <DataTable columns={columns} data={users} />
      </div>
    </div>
  );
}
