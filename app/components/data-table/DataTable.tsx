"use client";
import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";

import { DataTableToolbar } from "./DataTableToolbar";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableProps, HeaderColSpans, RowColSpans } from "./types";

export function DataTable<TData extends Record<string, any>, TValue>({
  columns,
  data: initialData,
  initialPage = 0,
  totalPages = 1,
  pageSize = 10,
  serverPagination,
  apiUrl,
  paginationTheme = "shadcn",
  rowColSpans,
  headerColSpans,
  filterConfig,
  enableRowSelection,
  renderRowActions,
  onBulkDelete,
  onPageChange,
  onPageSizeChange,
}: DataTableProps<TData, TValue>) {
  const [data, setData] = React.useState<TData[]>(initialData || []);
  const [filterValues, setFilterValues] = React.useState<Record<string, any>>(
    {}
  );
  const [pagination, setPagination] = React.useState({
    pageIndex: initialPage,
    pageSize,
  });

  const table = useReactTable({
    data,
    columns: React.useMemo(() => {
      if (!renderRowActions) return columns;
      return [
        ...columns,
        {
          id: "actions",
          header: "Actions",
          cell: ({ row }) => (
            <div className="flex justify-end">
              {renderRowActions(row.original)}
            </div>
          ),
        },
      ];
    }, [columns, renderRowActions]),
    state: {
      pagination,
    },
    manualPagination: serverPagination,
    pageCount: serverPagination ? totalPages : undefined,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection,
  });

  // --------------------------
  // Server Data Fetching
  // --------------------------
  React.useEffect(() => {
    if (!serverPagination || !apiUrl) return;

    const params = new URLSearchParams({
      page: String(pagination.pageIndex),
      pageSize: String(pagination.pageSize),
    });

    Object.entries(filterValues).forEach(([key, val]) => {
      if (!val) return;
      if (val?.from && val?.to) {
        params.append(`${key}From`, val.from.toISOString());
        params.append(`${key}To`, val.to.toISOString());
      } else {
        params.append(key, String(val));
      }
    });

    (async () => {
      const res = await fetch(`${apiUrl}?${params.toString()}`, {
        cache: "no-store",
      });
      const json = await res.json();
      setData(json.data);
    })();
  }, [pagination, filterValues, apiUrl]);

  const handleFilterChange = (column: string, value: any) => {
    const updated = { ...filterValues, [column]: value };
    setFilterValues(updated);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <DataTableToolbar
        table={table}
        filterConfig={filterConfig}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        enableRowSelection={enableRowSelection}
        onBulkDelete={onBulkDelete}
      />

      {/* Table */}
      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {enableRowSelection && (
                  <TableHead className="w-8">
                    <Checkbox
                      checked={table.getIsAllRowsSelected()}
                      onCheckedChange={(value) =>
                        table.toggleAllRowsSelected(!!value)
                      }
                      ref={(el) => {
                        if (el)
                          (el as unknown as HTMLInputElement).indeterminate =
                            table.getIsSomeRowsSelected();
                      }}
                    />
                  </TableHead>
                )}

                {headerGroup.headers.map((header) => {
                  const sorted = header.column.getIsSorted();
                  const spans = headerColSpans?.[header.id] || {};

                  return (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      colSpan={spans.colSpan}
                      rowSpan={spans.rowSpan}
                      className="cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <ArrowUpDown className="w-3 h-3 opacity-50" />
                        {sorted === "asc" && "↑"}
                        {sorted === "desc" && "↓"}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getPaginationRowModel().rows.length ? (
              table.getPaginationRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {enableRowSelection && (
                    <TableCell>
                      <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                      />
                    </TableCell>
                  )}
                  {row.getVisibleCells().map((cell) => {
                    const spans = rowColSpans?.[row.id]?.[cell.column.id] || {};
                    return (
                      <TableCell
                        key={cell.id}
                        colSpan={spans.colSpan}
                        rowSpan={spans.rowSpan}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={50}
                  className="text-center py-10 text-muted-foreground"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <DataTablePagination
        table={table}
        serverPagination={serverPagination}
        totalPages={totalPages}
        paginationTheme={paginationTheme}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}
