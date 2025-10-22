"use client";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Check,
  ChevronDown,
  ChevronDownIcon,
  Search,
  SearchX,
  X,
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { BiSortDown, BiSortUp } from "react-icons/bi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "../../../components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "../../../components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../../../components/ui/command";
import { BulkDeleteDialog } from "@/app/components/table/BulkDeleteDialog";
import { DateRange } from "react-day-picker";

type FilterType = "select" | "text" | "date" | "number" | "boolean";

interface FilterConfig {
  /** The column key in your table data */
  column: string;
  /** Label or placeholder text */
  label?: string;
  /** Type of input control to render */
  type: FilterType;
  /** mode of input date to render */
  mode?: "single" | "range";
  /** Options for select or boolean fields */
  options?: { label: string; value: string }[];
  /** Optional placeholder for text/date/number inputs */
  placeholder?: string;
  isSearchable?: boolean;
  isMulti?: boolean;
  onChange?: (value: any, allFilters: Record<string, any>) => void;
}

interface CellSpan {
  rowSpan?: number;
  colSpan?: number;
}

// For body rows
interface RowColSpans {
  [rowId: string]: {
    [columnId: string]: CellSpan;
  };
}

// For header
interface HeaderColSpans {
  [columnId: string]: CellSpan;
}

interface DataTableProps<TData extends Record<string, any>, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowColSpans?: RowColSpans;
  headerColSpans?: HeaderColSpans;
  filterConfig?: FilterConfig[];
  enableRowSelection?: boolean;
  renderRowActions?: (row: TData) => React.ReactNode;
  onBulkDelete?: (rows: TData[]) => void;
  stickyHeader?: boolean;
  onPageChange?: (pageIndex: number, pageSize: number) => void;
  onPageSizeChange?: (pageSize: number, pageIndex: number) => void;
}

export function DataTable<TData extends Record<string, any>, TValue>({
  columns,
  data,
  rowColSpans,
  headerColSpans,
  filterConfig,
  enableRowSelection,
  renderRowActions,
  onBulkDelete,
  stickyHeader,
  onPageChange,
  onPageSizeChange,
}: DataTableProps<TData, TValue>) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filterValues, setFilterValues] = React.useState<Record<string, any>>(
    {}
  );

  const tableColumns: ColumnDef<TData, TValue>[] = React.useMemo(() => {
    const baseCols = [...columns]; // copy to avoid mutating props

    if (renderRowActions) {
      baseCols.push({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            {renderRowActions(row.original)}
          </div>
        ),
      });
    }

    return baseCols;
  }, [columns, renderRowActions]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (updater) => {
      setPagination((old) =>
        typeof updater === "function" ? updater(old) : updater
      );
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: enableRowSelection,
  });

  // -------------------------
  // EXPORT HANDLERS
  // -------------------------
  const exportToExcel = () => {
    const exportData = table
      .getFilteredRowModel()
      .rows.map((row) => row.original);
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "data.xlsx");
  };

  const exportToCSV = () => {
    const exportData = table
      .getFilteredRowModel()
      .rows.map((row) => row.original);
    const ws = XLSX.utils.json_to_sheet(exportData);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    a.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    const headers = table
      .getAllLeafColumns()
      .map((col) => col.id)
      .filter((id) => id !== "actions" && id !== "select");

    const exportData = table
      .getFilteredRowModel()
      .rows.map((row) =>
        headers.map((id) => row.original[id as keyof typeof row.original])
      );

    autoTable(doc, {
      head: [headers],
      body: exportData,
    });

    doc.save("data.pdf");
  };

  // Export selected rows to CSV
  const exportSelectedToCSV = () => {
    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((r) => r.original);
    if (!selectedRows.length) return;

    const ws = XLSX.utils.json_to_sheet(selectedRows);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "selected-data.csv";
    a.click();
  };

  // Export selected rows to Excel
  const exportSelectedToExcel = () => {
    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((r) => r.original);
    if (!selectedRows.length) return;

    const ws = XLSX.utils.json_to_sheet(selectedRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Selected Data");
    XLSX.writeFile(wb, "selected-data.xlsx");
  };

  // Export selected rows to PDF
  const exportSelectedToPDF = () => {
    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((r) => r.original);
    if (!selectedRows.length) return;

    const doc = new jsPDF();

    const headers = table
      .getAllLeafColumns()
      .map((col) => col.id)
      .filter((id) => id !== "actions" && id !== "select");

    const body = selectedRows.map((row) => headers.map((id) => row[id]));

    autoTable(doc, {
      head: [headers],
      body,
    });

    doc.save("selected-data.pdf");
  };

  return (
    <div className="space-y-4">
      {/* FILTERS & EXPORT */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        {/* LEFT SIDE — Search + Custom Filters */}
        <div className="flex flex-wrap flex-grow items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search ..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-8 max-w-xs" // add padding-left for icon space
            />
          </div>

          {/* Dynamically render filters passed as props */}
          {filterConfig?.map((filter) => {
            const col = table.getColumn(filter.column);
            if (!col) return null;

            switch (filter.type) {
              case "select":
                return (
                  <Select
                    key={filter.column}
                    value={
                      filter.isMulti
                        ? (col.getFilterValue() as string[] | undefined)?.join(
                            ","
                          ) || "__all__"
                        : col.getFilterValue() === undefined
                        ? "__all__"
                        : String(col.getFilterValue())
                    }
                    onValueChange={(value) => {
                      let newValue: any;

                      if (filter.isMulti) {
                        const current: string[] =
                          (col.getFilterValue() as string[]) || [];
                        const newValues = current.includes(value)
                          ? current.filter((v) => v !== value)
                          : [...current, value];
                        newValue =
                          newValues.length === 0 ? undefined : newValues;
                      } else {
                        newValue = value === "__all__" ? undefined : value;
                      }

                      col.setFilterValue(newValue);

                      // Update central filter state
                      const updatedFilters = {
                        ...filterValues,
                        [filter.column]: newValue,
                      };
                      setFilterValues(updatedFilters);

                      // Call optional callback for AJAX
                      filter.onChange?.(newValue, updatedFilters);
                    }}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue>
                        {filter.isMulti
                          ? (col.getFilterValue() as string[] | undefined)
                              ?.length
                            ? (col.getFilterValue() as string[])
                                .map(
                                  (v) =>
                                    filter.options?.find(
                                      (opt) => opt.value === v
                                    )?.label || v
                                )
                                .join(", ")
                            : filter.options?.find((opt) => opt.value === "")
                                ?.label || "All"
                          : col.getFilterValue() === undefined
                          ? filter.options?.find((opt) => opt.value === "")
                              ?.label || "All"
                          : filter.options?.find(
                              (opt) =>
                                opt.value === String(col.getFilterValue())
                            )?.label || ""}
                      </SelectValue>
                    </SelectTrigger>

                    <SelectContent className="max-h-100 overflow-y-auto">
                      {filter.isSearchable ? (
                        <Command>
                          <CommandInput
                            placeholder={`Search ${filter.label || ""}...`}
                          />
                          <CommandEmpty>No results found.</CommandEmpty>

                          <CommandGroup>
                            {filter.options?.map((opt) => {
                              const val =
                                opt.value === "" ? "__all__" : opt.value; // fix empty string
                              const selected = filter.isMulti
                                ? (
                                    col.getFilterValue() as string[] | undefined
                                  )?.includes(opt.value)
                                : col.getFilterValue() === opt.value;

                              return (
                                <CommandItem
                                  key={val}
                                  value={val}
                                  onSelect={(v) => {
                                    const actualValue =
                                      v === "__all__" ? "" : v; // convert back
                                    if (filter.isMulti) {
                                      // Get current selected values or empty array
                                      const current: string[] =
                                        (col.getFilterValue() as string[]) ||
                                        [];

                                      // Check if actualValue is already selected
                                      let newValues: string[];
                                      if (actualValue === "") {
                                        // Selecting "All" clears other selections
                                        newValues = [];
                                      } else if (
                                        current.includes(actualValue)
                                      ) {
                                        // Remove value if already selected
                                        newValues = current.filter(
                                          (x) => x !== actualValue
                                        );
                                      } else {
                                        // Add new value
                                        newValues = [...current, actualValue];
                                      }

                                      // Update filter value (undefined = no filter)
                                      col.setFilterValue(
                                        newValues.length === 0
                                          ? undefined
                                          : newValues
                                      );
                                    } else {
                                      col.setFilterValue(
                                        actualValue === ""
                                          ? undefined
                                          : actualValue
                                      );
                                    }
                                  }}
                                >
                                  <label>{opt.label}</label>
                                  {filter.isMulti &&
                                    (
                                      col.getFilterValue() as
                                        | string[]
                                        | undefined
                                    )?.includes(opt.value) && (
                                      <Check className="ml-auto h-4 w-4" />
                                    )}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </Command>
                      ) : (
                        <SelectGroup>
                          {filter.options?.map((opt) => {
                            const val =
                              opt.value === "" ? "__all__" : opt.value; // fix empty string
                            const selected = filter.isMulti
                              ? (
                                  col.getFilterValue() as string[] | undefined
                                )?.includes(opt.value)
                              : col.getFilterValue() === opt.value;

                            return (
                              <SelectItem key={val} value={val}>
                                <span>{opt.label}</span>
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      )}
                    </SelectContent>
                  </Select>
                );

              case "text":
                return (
                  <Input
                    key={filter.column}
                    placeholder={filter.placeholder || filter.label}
                    onChange={(e) => {
                      const value = e.target.value;
                      col.setFilterValue(value);

                      const updatedFilters = {
                        ...filterValues,
                        [filter.column]: value,
                      };
                      setFilterValues(updatedFilters);

                      filter.onChange?.(value, updatedFilters);
                    }}
                    className="max-w-fit"
                  />
                );

              case "date": {
                const isRangeMode = filter.mode === "range";

                const currentValue = col.getFilterValue() as
                  | Date
                  | DateRange
                  | undefined;

                return (
                  <Popover key={filter.column}>
                    <div
                      className={`relative flex items-center ${
                        isRangeMode ? "w-56" : "w-36"
                      }`}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date"
                          className={`justify-between font-normal w-full`}
                        >
                          {isRangeMode
                            ? currentValue && (currentValue as DateRange).from
                              ? (currentValue as DateRange).to
                                ? `${format(
                                    (currentValue as DateRange).from!,
                                    "yyyy-MM-dd"
                                  )} → ${format(
                                    (currentValue as DateRange).to!,
                                    "yyyy-MM-dd"
                                  )}`
                                : format(
                                    (currentValue as DateRange).from!,
                                    "yyyy-MM-dd"
                                  )
                              : filter.label || "Select Date Range"
                            : currentValue
                            ? format(currentValue as Date, "yyyy-MM-dd")
                            : filter.label || "Select Date"}
                          {!currentValue && (
                            <ChevronDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </PopoverTrigger>

                      {currentValue && (
                        <button
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          onClick={(e) => {
                            e.stopPropagation();
                            col.setFilterValue(undefined);
                            const updatedFilters = {
                              ...filterValues,
                              [filter.column]: undefined,
                            };
                            setFilterValues(updatedFilters);
                            filter.onChange?.(undefined, updatedFilters);
                          }}
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                      )}
                    </div>

                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode={isRangeMode ? "range" : "single"}
                        numberOfMonths={isRangeMode ? 2 : 1}
                        required={isRangeMode ? false : undefined}
                        selected={currentValue as any}
                        onSelect={(val: Date | DateRange | undefined) => {
                          const newValue = val ?? undefined;
                          col.setFilterValue(newValue);
                          const updatedFilters = {
                            ...filterValues,
                            [filter.column]: newValue,
                          };
                          setFilterValues(updatedFilters);
                          filter.onChange?.(newValue, updatedFilters);
                        }}
                        className="rounded-md"
                      />
                    </PopoverContent>
                  </Popover>
                );
              }

              case "number":
                return (
                  <Input
                    key={filter.column}
                    type="number"
                    placeholder={filter.placeholder || filter.label}
                    onChange={(e) => {
                      const value = e.target.value;
                      col.setFilterValue(value);

                      const updatedFilters = {
                        ...filterValues,
                        [filter.column]: value,
                      };
                      setFilterValues(updatedFilters);

                      filter.onChange?.(value, updatedFilters);
                    }}
                  />
                );

              default:
                return null;
            }
          })}
        </div>

        {/* RIGHT SIDE — Export + Columns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* checked selectd */}
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="font-normal"
                disabled={Object.keys(rowSelection).length === 0}
              >
                Actions{" "}
                <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Selected Rows Actions</DropdownMenuLabel>

              <BulkDeleteDialog
                selectedRows={table
                  .getSelectedRowModel()
                  .rows.map((r) => r.original)}
                onConfirm={(rows) => {
                  onBulkDelete?.(rows);
                  table.resetRowSelection();
                }}
                onAfterDelete={() => setMenuOpen(false)}
              />

              <DropdownMenuItem onClick={exportSelectedToCSV}>
                Export CSV
              </DropdownMenuItem>

              <DropdownMenuItem onClick={exportSelectedToExcel}>
                Export Excel
              </DropdownMenuItem>

              <DropdownMenuItem onClick={exportSelectedToPDF}>
                Export PDF
              </DropdownMenuItem>

              {/* Add more actions as needed */}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="font-normal">
                Export{" "}
                <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Data</DropdownMenuLabel>
              <DropdownMenuItem onClick={exportToCSV}>CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={exportToExcel}>Excel</DropdownMenuItem>
              <DropdownMenuItem onClick={exportToPDF}>PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Columns Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="font-normal">
                Columns{" "}
                <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              {table
                .getAllLeafColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-md border overflow-auto relative">
        <Table className="relative">
          <TableHeader
            className={stickyHeader ? "sticky top-0 bg-accent z-10" : ""}
          >
            {table.getHeaderGroups().map((headerGroup, hgIndex) => (
              <TableRow key={headerGroup.id}>
                {enableRowSelection && (
                  <TableHead
                    className={`w-8 text-sm bg-accent`}
                    rowSpan={headerColSpans?.select?.rowSpan}
                    colSpan={headerColSpans?.select?.colSpan}
                  >
                    <Checkbox
                      checked={table.getIsAllRowsSelected()}
                      onCheckedChange={(value) =>
                        table.toggleAllRowsSelected(!!value)
                      }
                      aria-label="Select all rows"
                      className="bg-white"
                      ref={(el) => {
                        if (el)
                          (el as any).indeterminate =
                            table.getIsSomeRowsSelected();
                      }}
                    />
                  </TableHead>
                )}

                {headerGroup.headers.map((header) => {
                  const isSorted = header.column.getIsSorted();
                  const isActionCol = header.id === "actions";
                  const spans = headerColSpans?.[header.id] || {};

                  return (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className={`cursor-pointer select-none text-sm bg-accent ${
                        isActionCol ? "text-right" : ""
                      } ${
                        spans.colSpan || spans.rowSpan
                          ? "border-l border-r"
                          : ""
                      }`}
                      colSpan={spans.colSpan}
                      rowSpan={spans.rowSpan}
                    >
                      <div
                        className={`flex items-center gap-1 ${
                          isActionCol ? "justify-end" : ""
                        }`}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {isSorted === "asc" && <BiSortUp className="h-4 w-4" />}
                        {isSorted === "desc" && (
                          <BiSortDown className="h-4 w-4" />
                        )}
                        {!isSorted && (
                          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getPaginationRowModel().rows?.length ? (
              table.getPaginationRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={row.getIsSelected() ? "bg-gray-200" : ""}
                >
                  {enableRowSelection && (
                    <TableCell
                      className={
                        row.getIsSelected()
                          ? "border-l-2 border-l-green-500"
                          : ""
                      }
                    >
                      <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                        ref={(el) => {
                          if (el)
                            (el as any).indeterminate = row.getIsSomeSelected();
                        }}
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
                        className={
                          spans.colSpan || spans.rowSpan
                            ? "border-l border-r"
                            : ""
                        }
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
                  colSpan={
                    table.getAllLeafColumns().filter((c) => c.getIsVisible())
                      .length + (enableRowSelection ? 1 : 0)
                  }
                  className="h-94 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                    <div className="rounded-full bg-muted p-4">
                      <SearchX className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <p className="text-base font-medium text-foreground">
                      No results found
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your filters or search terms.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(value) => {
              const newSize = Number(value);
              table.setPageSize(newSize);
              // Trigger parent callback if provided
              onPageSizeChange?.(
                newSize,
                table.getState().pagination.pageIndex
              );
            }}
          >
            <SelectTrigger className="w-16 border rounded-md p-1 text-sm">
              <SelectValue placeholder="Rows" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 25, 50, 100, 250, 500].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.previousPage();
              const { pageIndex, pageSize } = table.getState().pagination;
              onPageChange?.(pageIndex - 1, pageSize);
            }}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.nextPage();
              const { pageIndex, pageSize } = table.getState().pagination;
              onPageChange?.(pageIndex + 1, pageSize);
            }}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
