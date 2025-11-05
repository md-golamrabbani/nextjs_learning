"use client";
import React from "react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function DataTablePagination<TData>({
  table,
  serverPagination,
  totalPages,
  paginationTheme = "shadcn",
  onPageChange,
  onPageSizeChange,
}: {
  table: Table<TData>;
  serverPagination?: boolean;
  totalPages?: number;
  paginationTheme?: "simple" | "shadcn";
  onPageChange?: (pageIndex: number, pageSize: number) => void;
  onPageSizeChange?: (pageSize: number, pageIndex: number) => void;
}) {
  const paginationState = table.getState().pagination;

  const handlePageChange = (pageIndex: number) => {
    table.setPageIndex(pageIndex);
    onPageChange?.(pageIndex, paginationState.pageSize);
  };

  const handleNext = () => {
    table.nextPage();
    onPageChange?.(paginationState.pageIndex + 1, paginationState.pageSize);
  };

  const handlePrev = () => {
    table.previousPage();
    onPageChange?.(paginationState.pageIndex - 1, paginationState.pageSize);
  };

  const total =
    serverPagination && totalPages
      ? totalPages
      : Math.max(
          1,
          Math.ceil(
            table.getFilteredRowModel().rows.length / paginationState.pageSize
          )
        );

  if (paginationTheme === "simple") {
    return (
      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          disabled={!table.getCanPreviousPage()}
          onClick={handlePrev}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!table.getCanNextPage()}
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-end mt-4">
      <Pagination>
        <PaginationContent>
          {/* Previous */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePrev();
              }}
              className={
                !table.getCanPreviousPage()
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>

          {/* Page Numbers */}
          {(() => {
            const current = paginationState.pageIndex;
            const pages: (number | "ellipsis")[] = [];

            pages.push(0);

            const start = Math.max(1, current - 1);
            const end = Math.min(total - 2, current + 1);

            if (start > 1) pages.push("ellipsis");
            for (let i = start; i <= end; i++) pages.push(i);
            if (end < total - 2) pages.push("ellipsis");

            if (total > 1) pages.push(total - 1);

            return pages.map((page, i) =>
              page === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === current}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page);
                    }}
                  >
                    {page + 1}
                  </PaginationLink>
                </PaginationItem>
              )
            );
          })()}

          {/* Next */}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNext();
              }}
              className={
                !table.getCanNextPage() ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
