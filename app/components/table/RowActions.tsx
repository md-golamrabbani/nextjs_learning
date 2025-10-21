"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { DeleteDialog } from "./DeleteDialog";
import { toast } from "sonner";

interface RowActionsProps {
  row: any;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  showEdit?: boolean;
  showDelete?: boolean;
}

export function RowActions({
  row,
  onEdit,
  onDelete,
  showEdit = true,
  showDelete = true,
}: RowActionsProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[160px]">
        {showEdit && (
          <DropdownMenuItem
            onClick={() => {
              onEdit?.(row);
              setMenuOpen(false);
            }}
          >
            Edit
          </DropdownMenuItem>
        )}

        {showDelete && (
          <DeleteDialog
            title="Delete Record"
            description="Are you sure you want to delete this record? This action cannot be undone."
            onConfirm={() => {
              onDelete?.(row);
              setMenuOpen(false);
              toast.success("Deleted!", {
                description: `${row.name || "Record"} has been deleted.`,
                position: "top-center",
              });
            }}
            trigger={
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-red-600 focus:text-red-700"
              >
                Delete
              </DropdownMenuItem>
            }
          />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
