// app/users/page.tsx
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/app/components/table/DataTable";
import { z } from "zod";
import UserFormClient from "@/app/components/UserFormClient";

export const revalidate = 30; // ISR: regenerate every 30s (keeps reads cheap)

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "address", header: "Address" },
  { accessorKey: "country", header: "Country" },
  { accessorKey: "avatar", header: "Avatar" },
  { accessorKey: "username", header: "Username" },
  { accessorKey: "password", header: "Password" },
  { accessorKey: "birthDate", header: "Birth Date" },
  { accessorKey: "gender", header: "Gender" },
  { accessorKey: "city", header: "City" },
  { accessorKey: "state", header: "State" },
  { accessorKey: "zipCode", header: "ZIP Code" },
  { accessorKey: "company", header: "Company" },
  { accessorKey: "jobTitle", header: "Job Title" },
  { accessorKey: "website", header: "Website" },
  { accessorKey: "bio", header: "Bio" },
  { accessorKey: "interests", header: "Interests" },
  { accessorKey: "language", header: "Language" },
  { accessorKey: "timezone", header: "Timezone" },
  { accessorKey: "ipAddress", header: "IP Address" },
  { accessorKey: "latitude", header: "Latitude" },
  { accessorKey: "longitude", header: "Longitude" },
  { accessorKey: "lastLogin", header: "Last Login" },
  { accessorKey: "createdAt", header: "Created At" },
  { accessorKey: "updatedAt", header: "Updated At" },
];

// Zod schema to validate incoming data from the form
const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v ?? ""),
  address: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v ?? ""),
  country: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v ?? ""),
  avatar: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v ?? ""),
});

/**
 * Server Action: create user and revalidate the /users page.
 * This runs on the server only.
 */
export async function createUserAction(formData: FormData) {
  "use server";

  // convert formData to plain object
  const obj = Object.fromEntries(formData.entries());
  // zod parse (throws if invalid)
  const parsed = userSchema.parse(obj);

  await prisma.user.create({
    data: {
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      address: parsed.address,
      country: parsed.country,
      avatar: parsed.avatar,
    },
  });

  // Immediately revalidate the ISR cache for /users so SSR page updates instantly
  revalidatePath("/users");
}

export default async function Page() {
  // Server-side read: uses Prisma directly.
  // With `export const revalidate = 30`, this page will be cached and regenerated periodically,
  // but createUserAction calls revalidatePath("/users") to refresh immediately on writes.
  const users = await prisma.user.findMany({
    orderBy: { id: "desc" },
    // take: 5,
  });

  return (
    <div className="max-w-5xl mx-auto p-6 h-[95vh] flex flex-col">
      <h1 className="text-2xl font-bold mb-4 flex-shrink-0">Users</h1>

      {/* Client form that submits to server action */}
      <UserFormClient createUserAction={createUserAction} />

      {/* Server-rendered table; table container scrolls, header stays visible */}
      <div className="flex-1 overflow-y-auto border rounded">
        <DataTable columns={columns} data={users} />
      </div>
    </div>
  );
}
