import { prisma } from "@/lib/prisma";
import { DataTable } from "@/app/components/table/DataTable";

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

export const revalidate = 0;

export default async function Page() {
  const pageSize = 50;
  const pageIndex = 0;

  // Only fetch 1 page (SSR)
  const totalCount = await prisma.user.count();
  const users = await prisma.user.findMany({
    // skip: pageIndex * pageSize,
    // take: pageSize,
    orderBy: { id: "desc" },
  });

  const totalPages = Math.ceil(totalCount / pageSize);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 flex-shrink-0">Users</h1>

      {/* Server-rendered table; table container scrolls, header stays visible */}
      <div className="flex-1 overflow-y-auto border rounded">
        <DataTable
          columns={columns}
          data={users}
          // initialPage={pageIndex}
          // totalPages={totalPages}
          // pageSize={pageSize}
          // serverPagination={true}
          // apiUrl="/api/users"
        />
      </div>
    </div>
  );
}
