"use client";

import { toast } from "sonner";
import { DeleteDialog } from "./DeleteDialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface BulkDeleteDialogProps {
  selectedRows: any[];
  onConfirm: (rows: any[]) => void;
  onAfterDelete?: () => void;
}

export function BulkDeleteDialog({
  selectedRows,
  onConfirm,
  onAfterDelete,
}: BulkDeleteDialogProps) {
  return (
    <DeleteDialog
      title="Delete Selected Records"
      description={`Are you sure you want to delete ${
        selectedRows.length
      } record${
        selectedRows.length > 1 ? "s" : ""
      }? This action cannot be undone.`}
      onConfirm={() => {
        onConfirm(selectedRows);
        onAfterDelete?.();
        toast.success("Deleted!", {
          description: `${selectedRows.length} record${
            selectedRows.length > 1 ? "s" : ""
          } deleted.`,
          position: "top-center",
        });
      }}
      trigger={
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="text-red-600 focus:text-red-700"
        >
          Delete Selected
        </DropdownMenuItem>
      }
    />
  );
}
