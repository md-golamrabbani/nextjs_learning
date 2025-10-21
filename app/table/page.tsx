"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/app/components/table/DataTable";
import { RowActions } from "../components/table/RowActions";
import { DataTableSkeleton } from "../components/table/DataTableSkeleton";
import { ColumnDef } from "@tanstack/react-table";

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
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        const json = await res.json();

        // Normalize data (optional)
        const normalized = json.map((item: any) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          city: item.address.city,
          zipcode: item.address.zipcode,
          createdAt: item.address.street,
        }));

        setData(normalized);

        // Dynamically create columns
        if (normalized.length > 0) {
          const keys = Object.keys(normalized[0]);
          const dynamicColumns: ColumnDef<any>[] = keys.map((key) => {
            const column: ColumnDef<any> = {
              accessorKey: key,
              header: key.charAt(0).toUpperCase() + key.slice(1),
            };

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
  if (loading) return <DataTableSkeleton columns={columns.length} rows={10} />;

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Dynamic Table</h1>
      <DataTable
        columns={columns}
        data={data}
        // headerColSpans={customHeaderSpans}
        // rowColSpans={customBodySpans}
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
            column: "email",
            type: "select",
            options: [
              { label: "All Status", value: "" },
              { label: "Active", value: "true" },
              { label: "Inactive", value: "false" },
            ],
          },
          {
            column: "createdAt",
            type: "date",
          },
        ]}
      />
    </div>
  );
}
