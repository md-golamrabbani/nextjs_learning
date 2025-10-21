"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableSkeletonProps {
  columns: number;
  rows?: number;
  filterRows?: number;
}

export function DataTableSkeleton({
  columns,
  rows = 5,
  filterRows = 1,
}: DataTableSkeletonProps) {
  return (
    <div className="space-y-4 p-4 animate-pulse">
      {/* FILTER ROW */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: filterRows }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-36 rounded-md" />
        ))}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableHead key={colIndex}>
                  <Skeleton className="h-4 w-24 rounded-md" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow key={rowIndex} className="hover:bg-muted">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <TableCell key={colIndex} className="py-4">
                    <Skeleton className="h-4 w-full rounded-md" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* FOOTER SKELETON */}
      <div className="flex justify-between items-center mt-2">
        {/* Showing X of Y records */}
        <Skeleton className="h-4 w-32 rounded-md" />
        {/* Pagination buttons */}
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}
