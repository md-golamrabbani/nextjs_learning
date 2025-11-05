// app/components/data-table/types.ts

import { ColumnDef } from "@tanstack/react-table";
import { DateRange } from "react-day-picker";

export type FilterType = "select" | "text" | "date" | "number" | "boolean";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  /** Column key in your data */
  column: string;

  /** Display label / placeholder text */
  label?: string;

  /** Component type */
  type: FilterType;

  /** If type = "date", choose range or single date */
  mode?: "single" | "range";

  /** For select/boolean filters */
  options?: FilterOption[];

  /** Show search input inside select dropdown */
  isSearchable?: boolean;

  /** Allow multiple select options */
  isMulti?: boolean;

  /** Placeholder text (optional) */
  placeholder?: string;

  /** Fired when filter changes (optional) */
  onChange?: (value: any, allFilters: Record<string, any>) => void;
}

export interface CellSpan {
  rowSpan?: number;
  colSpan?: number;
}

export interface RowColSpans {
  [rowId: string]: {
    [columnId: string]: CellSpan;
  };
}

export interface HeaderColSpans {
  [columnId: string]: CellSpan;
}

export interface DataTableProps<TData extends Record<string, any>, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  /** Server Pagination */
  serverPagination?: boolean;
  apiUrl?: string;
  totalPages?: number;
  pageSize?: number;
  initialPage?: number;

  /** Pagination UI style */
  paginationTheme?: "simple" | "shadcn";

  /** Row span / col span support */
  rowColSpans?: RowColSpans;
  headerColSpans?: HeaderColSpans;

  /** Filtering */
  filterConfig?: FilterConfig[];

  /** Row Selection + Bulk actions */
  enableRowSelection?: boolean;
  onBulkDelete?: (rows: TData[]) => void;
  renderRowActions?: (row: TData) => React.ReactNode;

  /** Table UI */
  stickyHeader?: boolean;

  /** Pagination callbacks */
  onPageChange?: (pageIndex: number, pageSize: number) => void;
  onPageSizeChange?: (pageSize: number, pageIndex: number) => void;
}
