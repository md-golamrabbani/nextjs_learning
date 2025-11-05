"use client";
import * as React from "react";
import { format } from "date-fns";
import { FilterConfig } from "./types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { X, ChevronDown } from "lucide-react";

/**
 * Renders dynamic filters for DataTable based on filterConfig.
 */
export function DataTableFilterInputs({
  filters,
  filterValues,
  onChange,
}: {
  filters: FilterConfig[];
  filterValues: Record<string, any>;
  onChange: (column: string, value: any) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {filters.map((filter) => {
        const value = filterValues[filter.column];

        // ----------------------
        // SELECT FILTER
        // ----------------------
        // SELECT FILTER
        if (filter.type === "select") {
          return (
            <Select
              key={filter.column}
              value={value ?? "__all__"}
              onValueChange={(v) =>
                onChange(filter.column, v === "__all__" ? undefined : v)
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder={filter.label || "Select"} />
              </SelectTrigger>

              <SelectContent>
                {/* Always include reset / all / no-filter option */}
                <SelectItem value="__all__">All</SelectItem>

                {filter.options?.map((opt) => (
                  <SelectItem
                    key={opt.value || "__all__"}
                    value={opt.value === "" ? "__all__" : opt.value}
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }

        // ----------------------
        // TEXT FILTER
        // ----------------------
        if (filter.type === "text") {
          return (
            <Input
              key={filter.column}
              placeholder={filter.placeholder || filter.label}
              value={value || ""}
              onChange={(e) =>
                onChange(filter.column, e.target.value || undefined)
              }
              className="w-40"
            />
          );
        }

        // ----------------------
        // NUMBER FILTER
        // ----------------------
        if (filter.type === "number") {
          return (
            <Input
              key={filter.column}
              type="number"
              placeholder={filter.placeholder || filter.label}
              value={value ?? ""}
              onChange={(e) =>
                onChange(
                  filter.column,
                  e.target.value !== "" ? Number(e.target.value) : undefined
                )
              }
              className="w-28"
            />
          );
        }

        // ----------------------
        // DATE FILTER (Single / Range)
        // ----------------------
        if (filter.type === "date") {
          const isRange = filter.mode === "range";
          const display = isRange
            ? value?.from
              ? value.to
                ? `${format(value.from, "yyyy-MM-dd")} → ${format(
                    value.to,
                    "yyyy-MM-dd"
                  )}`
                : format(value.from, "yyyy-MM-dd")
              : filter.label || "Select Date"
            : value
            ? format(value, "yyyy-MM-dd")
            : filter.label || "Select Date";

          return (
            <Popover key={filter.column}>
              <PopoverTrigger asChild>
                <button className="px-3 py-2 text-sm border rounded w-44 flex justify-between">
                  {display}
                  <ChevronDown className="w-4 h-4 opacity-60" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Calendar
                  mode={isRange ? "range" : "single"}
                  numberOfMonths={isRange ? 2 : 1}
                  required
                  selected={value}
                  onSelect={(date: any) =>
                    onChange(filter.column, date ?? undefined)
                  }
                />
              </PopoverContent>
              {value && (
                <button
                  className="ml-1 text-muted-foreground"
                  onClick={() => onChange(filter.column, undefined)}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </Popover>
          );
        }

        return null;
      })}
    </div>
  );
}
