"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ColumnDef } from "@tanstack/react-table";

export function getUserColumns(data: any[]): ColumnDef<any>[] {
  if (!data || data.length === 0) return [];

  const keys = Object.keys(data[0]).filter((key) => key !== "avatar");

  return keys.map((key) => {
    const column: ColumnDef<any> = {
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1),
    };

    // Custom Avatar + Name Cell
    if (key === "name") {
      column.cell = ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={row.original.avatar} alt={row.original.name} />
            <AvatarFallback>{row.original.name?.[0]}</AvatarFallback>
          </Avatar>
          <span>{row.original.name}</span>
        </div>
      );
    }

    // Hide password (optional)
    if (key === "password") {
      column.cell = () => "••••••••";
    }

    // Format dates nicely
    if (key === "createdAt" || key === "updatedAt" || key === "lastLogin") {
      column.cell = ({ row }) =>
        new Date(row.original[key]).toLocaleDateString();
    }

    return column;
  });
}
