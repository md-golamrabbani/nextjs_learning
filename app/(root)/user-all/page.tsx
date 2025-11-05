import UserTableClient from "@/app/components/UserTableClient";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function Page() {
  const pageSize = 50;
  const pageIndex = 0;

  const totalCount = await prisma.user.count();
  const users = await prisma.user.findMany({
    skip: pageIndex * pageSize,
    take: pageSize,
    orderBy: { id: "desc" },
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="flex flex-col h-full p-12 space-y-4">
      <h1 className="text-2xl font-bold mb-4 flex-shrink-0">Users</h1>

      <div className="flex-1 overflow-y-auto p-4">
        <UserTableClient
          users={users}
          totalPages={totalPages}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
}
