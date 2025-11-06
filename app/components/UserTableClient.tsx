"use client";

import { DataTable } from "@/app/components/table/DataTable";
import { getUserColumns } from "@/app/components/getUserColumns";

type User = {
  name: string;
  language: string;
  createdAt: Date;
  id: number;
  address: string;
  state: string;
  email: string;
  password: string;
  phone: string;
  country: string;
  avatar: string;
  username: string;
  birthDate: Date;
  gender: string;
  city: string;
  zipCode: string;
  company: string;
  jobTitle: string;
  website: string;
  bio: string;
  interests: string;
  timezone: string;
  ipAddress: string;
  latitude: number;
  longitude: number;
  lastLogin: Date;
  updatedAt: Date;
};

interface UserTableClientProps {
  users: User[];
  totalPages: number;
  pageIndex: number;
  pageSize: number;
}

export default function UserTableClient({
  users,
  totalPages,
  pageIndex,
  pageSize,
}: UserTableClientProps) {
  const columns = getUserColumns(users);

  return (
    <DataTable
      columns={columns}
      data={users}
      paginationTheme="shadcn"
      initialPage={pageIndex}
      totalPages={totalPages}
      pageSize={pageSize}
      serverPagination={true}
      apiUrl="/api/users"
      enableRowSelection={true}
      filterConfig={[
        { column: "name", type: "text", placeholder: "Name search..." },
        {
          column: "language",
          type: "select",
          options: [
            { label: "All Language", value: "" },
            { label: "Arabic", value: "Arabic" },
            { label: "German", value: "German" },
            { label: "Chinese", value: "Chinese" },
            { label: "English", value: "English" },
          ],
        },
        { column: "createdat", type: "date", mode: "range" },
      ]}
    />
  );
}
