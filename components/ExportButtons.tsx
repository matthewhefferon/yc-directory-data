"use client";

import { exportToCsv, exportToSql } from "@/lib/export";

interface ExportButtonsProps {
  data?: any[];
  onExport?: (format: "csv" | "sql") => void;
}

export default function ExportButtons({ data, onExport }: ExportButtonsProps) {
  const handleDownload = async (format: "csv" | "sql") => {
    if (onExport) {
      onExport(format);
      return;
    }

    // Fallback: fetch ALL companies if no data provided
    const res = await fetch("/api/fetch-yc-all");
    const allData = await res.json();

    if (format === "csv") exportToCsv(allData);
    if (format === "sql") exportToSql(allData);
  };

  return (
    <div className="flex gap-3 justify-end">
      <button
        onClick={() => handleDownload("csv")}
        className="bg-yc-orange hover:bg-yc-orange-hover hover:scale-105 active:bg-yc-orange-active text-white px-3 py-1.5 rounded font-medium transition-all duration-200"
      >
        Download CSV
      </button>
      <button
        onClick={() => handleDownload("sql")}
        className="bg-yc-orange hover:bg-yc-orange-hover hover:scale-105 active:bg-yc-orange-active text-white px-3 py-1.5 rounded font-medium transition-all duration-200"
      >
        Download SQL
      </button>
    </div>
  );
}
