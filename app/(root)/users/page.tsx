import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/app/components/table/DataTable";
import UserFormServer from "@/app/components/UserFormServer";

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "country", header: "Country" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Phone" },
];

// ✅ Server Action to insert new user and revalidate page
export async function createUserAction(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const country = formData.get("country") as string;
  const avatar = formData.get("avatar") as string;

  await prisma.user.create({
    data: { name, email, phone, address, country, avatar },
  });

  // ✅ Revalidate current route — triggers instant SSR refresh
  revalidatePath("/users");
}

export default async function Page() {
  // ✅ Server-side load
  const users = await prisma.user.findMany({ orderBy: { id: "desc" } });

  return (
    <div className="max-w-5xl mx-auto p-6 h-[95vh] flex flex-col">
      <h1 className="text-2xl font-bold mb-4 flex-shrink-0">Users</h1>

      {/* Client Form (calls server action) */}
      <UserFormServer createUserAction={createUserAction} />

      {/* Server-rendered table */}
      <div className="flex-1 overflow-y-auto border rounded">
        <DataTable columns={columns} data={users} />
      </div>
    </div>
  );
}
