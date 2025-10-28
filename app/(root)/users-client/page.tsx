"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/app/components/table/DataTable";
import UserForm from "@/app/components/UserForm";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  avatar: string;
}

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "country", header: "Country" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Phone" },
];

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 h-[95vh] flex flex-col">
      <h1 className="text-2xl font-bold mb-4 flex-shrink-0">Users</h1>

      {/* Client Form */}
      <UserForm onSuccess={fetchUsers} />

      {/* Table */}
      <div className="flex-1 overflow-y-auto border rounded">
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
          <DataTable columns={columns} data={users} />
        )}
      </div>
    </div>
  );
}
