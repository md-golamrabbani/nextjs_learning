// app/components/data-table/useDataTableExport.ts

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Table } from "@tanstack/react-table";

/**
 * Hook providing CSV, Excel, and PDF export utilities for Tanstack Table.
 */
export function useDataTableExport<TData extends Record<string, any>>(
  table: Table<TData>
) {
  /**
   * Returns only visible, non-action column keys
   */
  const getVisibleDataColumns = () =>
    table
      .getAllLeafColumns()
      .map((col) => col.id)
      .filter((id) => id !== "actions" && id !== "select");

  /**
   * Prepares visible row data for export
   */
  const getExportData = (rows: TData[]) => {
    const headers = getVisibleDataColumns();
    return rows.map((row) =>
      headers.reduce((acc, key) => {
        acc[key] = row[key];
        return acc;
      }, {} as Record<string, any>)
    );
  };

  // -----------------------
  // CSV Export (All Filtered Rows)
  // -----------------------
  const exportToCSV = () => {
    const rows = table.getFilteredRowModel().rows.map((r) => r.original);
    const exportData = getExportData(rows);

    const ws = XLSX.utils.json_to_sheet(exportData);
    const csv = XLSX.utils.sheet_to_csv(ws);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    a.click();
  };

  // -----------------------
  // Excel Export (All Filtered Rows)
  // -----------------------
  const exportToExcel = () => {
    const rows = table.getFilteredRowModel().rows.map((r) => r.original);
    const exportData = getExportData(rows);

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "data.xlsx");
  };

  // -----------------------
  // PDF Export (All Filtered Rows) — Minimal Style
  // -----------------------
  const exportToPDF = () => {
    const doc = new jsPDF();
    const headers = getVisibleDataColumns();
    const rows = table.getFilteredRowModel().rows.map((r) => r.original);

    const body = rows.map((row) => headers.map((h) => row[h]));

    autoTable(doc, {
      head: [headers],
      body,
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineColor: 200,
        lineWidth: 0.2, // minimal borders
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: 30,
        lineWidth: 0.2,
      },
      bodyStyles: {
        textColor: 60,
      },
      theme: "grid",
      margin: { top: 12 },
    });

    doc.save("data.pdf");
  };

  // -----------------------
  // Selected Row Exports
  // -----------------------
  const exportSelectedToCSV = () => {
    const selected = table.getSelectedRowModel().rows.map((r) => r.original);
    if (!selected.length) return;
    const exportData = getExportData(selected);

    const ws = XLSX.utils.json_to_sheet(exportData);
    const csv = XLSX.utils.sheet_to_csv(ws);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "selected-data.csv";
    a.click();
  };

  const exportSelectedToExcel = () => {
    const selected = table.getSelectedRowModel().rows.map((r) => r.original);
    if (!selected.length) return;
    const exportData = getExportData(selected);

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Selected");
    XLSX.writeFile(wb, "selected-data.xlsx");
  };

  const exportSelectedToPDF = () => {
    const doc = new jsPDF();
    const headers = getVisibleDataColumns();
    const selected = table.getSelectedRowModel().rows.map((r) => r.original);

    if (!selected.length) return;

    const body = selected.map((row) => headers.map((h) => row[h]));

    autoTable(doc, {
      head: [headers],
      body,
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineWidth: 0.2,
      },
      theme: "grid",
      margin: { top: 12 },
    });

    doc.save("selected-data.pdf");
  };

  return {
    exportToCSV,
    exportToExcel,
    exportToPDF,
    exportSelectedToCSV,
    exportSelectedToExcel,
    exportSelectedToPDF,
  };
}
