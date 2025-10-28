"use client";

import React, { useEffect, useState } from "react";
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

export default function Page() {
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("/api/employee"); // relative URL for client
        if (!res.ok) throw new Error("Failed to fetch employees");
        const json: EmployeesData = await res.json();
        setData(json.employees);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) return <p>Loading employees...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Employees</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
