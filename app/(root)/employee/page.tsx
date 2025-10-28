"use cache";

import React from "react";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { DataTable } from "@/app/components/table/DataTable";

interface Employee {
  id: number;
  name: string;
  company: string;
  phone: string;
  pabx: string;
  email: string;
  image: string;
}

interface EmployeesData {
  employees: Employee[];
}

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "company", header: "Company" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "pabx", header: "PABX" },
];

async function getEmployees(): Promise<EmployeesData> {
  cacheLife("hours");

  // Build full URL Dynamically
  const res = await fetch(`http://localhost:3000/api/employee`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch employees");
  }

  return res.json();
}

const Page = async () => {
  const data = await getEmployees();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Employees</h1>
      <DataTable columns={columns} data={data.employees} />
    </div>
  );
};

export default Page;
