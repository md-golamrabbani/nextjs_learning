"use client";
import * as React from "react";
import { Search, ChevronDown } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DataTableFilterInputs } from "./DataTableFilterInputs";
import { FilterConfig } from "./types";
import { useDataTableExport } from "./useDataTableExport";

import { Table } from "@tanstack/react-table";
import { BulkDeleteDialog } from "@/app/components/table/BulkDeleteDialog";

export function DataTableToolbar<TData extends Record<string, any>>({
  table,
  filterConfig,
  filterValues,
  onFilterChange,
  enableRowSelection,
  onBulkDelete,
}: {
  table: Table<TData>;
  filterConfig?: FilterConfig[];
  filterValues: Record<string, any>;
  onFilterChange: (col: string, value: any) => void;
  enableRowSelection?: boolean;
  onBulkDelete?: (rows: TData[]) => void;
}) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const {
    exportToCSV,
    exportToExcel,
    exportToPDF,
    exportSelectedToCSV,
    exportSelectedToExcel,
    exportSelectedToPDF,
  } = useDataTableExport(table);

  const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);

  return (
    <div className="flex flex-wrap justify-between items-center gap-3">
      {/* LEFT SIDE — Search + Filters */}
      <div className="flex flex-wrap gap-2 flex-grow items-center">
        {/* Search Input */}
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={table.getState().globalFilter ?? ""}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            className="pl-8 w-full"
          />
        </div>

        {/* Dynamic Filters */}
        {filterConfig && (
          <DataTableFilterInputs
            filters={filterConfig}
            filterValues={filterValues}
            onChange={onFilterChange}
          />
        )}
      </div>

      {/* RIGHT SIDE — Export / Columns / Selected Actions */}
      <div className="flex items-center gap-2">
        {/* Bulk Actions for Selected Rows */}
        {enableRowSelection && (
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                disabled={selectedRows.length === 0}
                className="font-normal"
              >
                Actions <ChevronDown className="ml-2 w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Selected Rows</DropdownMenuLabel>

              {onBulkDelete && (
                <BulkDeleteDialog
                  selectedRows={selectedRows}
                  onConfirm={(rows) => {
                    onBulkDelete(rows);
                    table.resetRowSelection();
                  }}
                  onAfterDelete={() => setMenuOpen(false)}
                />
              )}

              <DropdownMenuItem onClick={exportSelectedToCSV}>
                Export CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportSelectedToExcel}>
                Export Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportSelectedToPDF}>
                Export PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Export Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="font-normal">
              Export <ChevronDown className="ml-2 w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Export Data</DropdownMenuLabel>
            <DropdownMenuItem onClick={exportToCSV}>CSV</DropdownMenuItem>
            <DropdownMenuItem onClick={exportToExcel}>Excel</DropdownMenuItem>
            <DropdownMenuItem onClick={exportToPDF}>PDF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Column Visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="font-normal">
              Columns <ChevronDown className="ml-2 w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
            {table
              .getAllLeafColumns()
              .filter((col) => col.getCanHide())
              .map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={col.getIsVisible()}
                  onCheckedChange={(v) => col.toggleVisibility(!!v)}
                >
                  {col.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
