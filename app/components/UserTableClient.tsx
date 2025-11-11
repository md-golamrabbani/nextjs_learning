"use client";

import { DataTable } from "@/app/components/table/DataTable";
import { getUserColumns } from "@/app/components/getUserColumns";
import { RowActions } from "./table/RowActions";

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
      // initialPage={pageIndex}
      // totalPages={totalPages}
      // pageSize={pageSize}
      // serverPagination={true}
      // apiUrl="/api/users"
      stickyHeader={true}
      filterLayout="dropdown"
      enableRowSelection={true}
      renderRowActions={(row) => (
        <RowActions
          row={row}
          onEdit={(data) => console.log("Edit:", data)}
          onDelete={(data) => console.log("Delete:", data)}
        />
      )}
      filterConfig={[
        { column: "name", type: "text", placeholder: "Name search..." },
        {
          column: "zipCode",
          type: "select",
          isSearchable: true,
          isMulti: true,
          options: [
            { label: "Zip Code", value: "" },
            { label: "55335", value: "55335" },
            { label: "2264", value: "2264" },
            { label: "36650", value: "36650" },
            { label: "4635", value: "4635" },
            { label: "51132", value: "51132" },
            { label: "6973", value: "6973" },
            { label: "1243", value: "1243" },
            { label: "P5G 1Y7", value: "P5G 1Y7" },
            { label: "9017", value: "9017" },
            { label: "72890", value: "72890" },
            { label: "91378", value: "91378" },
            { label: "43", value: "43" },
            { label: "575", value: "575" },
            { label: "65875", value: "65875" },
            { label: "6784", value: "6784" },
          ],
        },
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
        { column: "createdAt", type: "date", mode: "single" },
      ]}
    />
  );
}
