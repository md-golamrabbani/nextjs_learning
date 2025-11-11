import UserTableClient from "@/app/components/UserTableClient";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase/client";
import { supabaseServer } from "@/supabase/server";

export const revalidate = 0;

export default async function Page() {
  const pageSize = 500;
  const pageIndex = 0;

  const totalCount = await prisma.user.count();
  const users = await prisma.user.findMany({
    skip: pageIndex * pageSize,
    take: pageSize,
    orderBy: { id: "desc" },
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  // const supabase = supabaseServer();

  // const pageSize = 20;
  // const pageIndex = 0; // later you can make this dynamic via searchParams

  // // Get total count
  // const { count } = await supabase
  //   .from("users")
  //   .select("*", { count: "exact", head: true });

  // const totalPages = Math.ceil((count ?? 0) / pageSize);

  // // Fetch paginated rows
  // const { data: users, error } = await supabase
  //   .from("users")
  //   .select("*")
  //   .order("id", { ascending: false })
  //   .range(pageIndex * pageSize, pageIndex * pageSize + pageSize - 1);

  // if (error) console.log("Supabase query error:", error);

  return (
    <div className="flex flex-col h-full p-12 space-y-4">
      <h1 className="text-2xl font-bold mb-4 flex-shrink-0">Users</h1>

      <div className="flex-1 overflow-y-auto p-4">
        <UserTableClient
          users={users ?? []}
          totalPages={totalPages}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
}
