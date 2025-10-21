"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/app/components/table/DataTable";
import { RowActions } from "../components/table/RowActions";
import { DataTableSkeleton } from "../components/table/DataTableSkeleton";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function TablePage() {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<ColumnDef<any>[]>([]);
  const [loading, setLoading] = useState(true);

  const customHeaderSpans = {
    name: { colSpan: 2 },
  };

  const customBodySpans = {
    "0": { name: { colSpan: 2 } },
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // Example API call (you can replace this with your real API)
        const res = await fetch("https://randomuser.me/api/?results=50");
        const json = await res.json();

        const normalized = json.results.map((user: any, index: number) => ({
          id: index + 1,
          avatar: user.picture.thumbnail, // Add avatar
          name: `${user.name.first} ${user.name.last}`,
          email: user.email,
          phone: user.phone,
          city: user.location.city,
          zipcode: user.location.postcode,
          status:
            index % 2 === 0
              ? index == 2
                ? "In Progress"
                : "Active"
              : index == 5
              ? "Ready"
              : "Inactive",
          createdAt: user.dob.date,
        }));

        setData(normalized);

        // Dynamically create columns
        if (normalized.length > 0) {
          const keys = Object.keys(normalized[0]);

          const dynamicColumns: ColumnDef<any>[] = keys
            .filter((key) => key !== "avatar") // exclude avatar
            .map((key) => {
              const column: ColumnDef<any> = {
                accessorKey: key,
                header: key.charAt(0).toUpperCase() + key.slice(1),
              };

              // Combine Avatar + Name
              if (key === "name") {
                column.cell = ({ row }) => (
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src={row.original.avatar}
                        alt={row.original.name}
                      />
                      <AvatarFallback>{row.original.name[0]}</AvatarFallback>
                    </Avatar>
                    <span>{row.original.name}</span>
                  </div>
                );
              }

              // Status
              if (key === "status") {
                column.cell = ({ row }) => {
                  const status = row.original.status || "Unknown";
                  const lower = status.toLowerCase();

                  // Map to valid shadcn variants
                  const variant =
                    lower === "active"
                      ? "secondary"
                      : lower === "inactive"
                      ? "destructive"
                      : lower === "in progress"
                      ? "outline"
                      : lower === "inactive"
                      ? "ready"
                      : "default";

                  return (
                    <Badge
                      variant={
                        variant as
                          | "default"
                          | "secondary"
                          | "destructive"
                          | "outline"
                      }
                      className={
                        lower === "in progress"
                          ? "bg-yellow-300"
                          : lower === "ready"
                          ? "bg-green-500"
                          : ""
                      }
                    >
                      {status}
                    </Badge>
                  );
                };

                column.filterFn = (row, columnId, filterValue) => {
                  const value =
                    (row.getValue(columnId) as string)?.toLowerCase() ?? "";
                  const filter = (filterValue as string)?.toLowerCase() ?? "";
                  if (!filter) return true; // “All” shows all
                  return value === filter;
                };
              }

              // Date column
              if (key === "createdAt") {
                column.cell = ({ row }) => {
                  const date = new Date(row.original.createdAt);
                  return <span>{format(date, "yyyy-MM-dd HH:mm")}</span>;
                };
              }

              if (key === "zipcode") {
                column.filterFn = (row, columnId, filterValue) => {
                  const rowValue = row.getValue(columnId) as string;
                  if (
                    !filterValue ||
                    (Array.isArray(filterValue) && filterValue.length === 0)
                  ) {
                    return true; // no filter applied
                  }
                  if (Array.isArray(filterValue)) {
                    // MULTI-SELECT support
                    return filterValue.includes(rowValue);
                  }
                  // SINGLE SELECT support
                  return rowValue === filterValue;
                };
              }

              return column;
            });
          setColumns(dynamicColumns);
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    }

    fetchData();
  }, []);

  const handleDelete = (row: any) => {
    setData((prev) => prev.filter((r) => r.id !== row.id));
  };

  const handleBulkDelete = async (rows: any[]) => {
    try {
      console.log("Deleting bulk rows:", rows);
      // await fetch(`/api/users/bulk-delete`, {
      //   method: "POST",
      //   body: JSON.stringify({ ids: rows.map((r) => r.id) }),
      // });
      setData((prev) =>
        prev.filter((item) => !rows.some((r) => r.id === item.id))
      );
    } catch (error) {
      console.error("Bulk delete failed:", error);
    }
  };

  if (loading) return <DataTableSkeleton columns={8} rows={10} />;

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Dynamic Table</h1>
      <DataTable
        columns={columns}
        data={data}
        // headerColSpans={customHeaderSpans}
        // rowColSpans={customBodySpans}
        stickyHeader={true}
        enableRowSelection={true}
        onBulkDelete={handleBulkDelete}
        renderRowActions={(row) => (
          <RowActions
            row={row}
            onEdit={(data) => console.log("Edit:", data)}
            onDelete={(data) => handleDelete(data)}
          />
        )}
        filterConfig={[
          {
            column: "name",
            type: "text",
            placeholder: "Search name...",
            onChange: (value, allFilters) => {
              console.log("Name filter changed:", value);
              console.log("All filters:", allFilters);
            },
          },
          {
            column: "zipcode",
            type: "select",
            isSearchable: true,
            isMulti: true,
            options: [
              { label: "Zip Code", value: "" },
              { label: "92998-3874", value: "92998-3874" },
              { label: "90566-7771", value: "90566-7771" },
            ],
          },
          {
            column: "status",
            type: "select",
            options: [
              { label: "All Status", value: "" },
              { label: "Active", value: "Active" },
              { label: "Inactive", value: "Inactive" },
            ],
          },
          {
            column: "createdAt",
            type: "date",
            mode: "range",
          },
        ]}
      />
    </div>
  );
}
