"use client";

import { columns as baseColumns } from "./Columns";
import { DataTable } from "./DataTable";
import { AttackRecordsSectionProps } from "./types";

export function AttackRecordsSection({
  attackRecords,
  explainabilityMode,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onShowXAI,
}: AttackRecordsSectionProps) {
  // Decide which columns to use
  const columnsToRender = explainabilityMode === "XAI"
    ? baseColumns
    : baseColumns.filter((col) => col.id !== "actions");

  // Modify data for callback
  const recordsWithCallback =
    attackRecords?.attack_data.map((row) => ({
      ...row,
      onShowXAI: () => onShowXAI(row.id),
    })) || [];

  return (
    <div className="w-full rounded-lg shadow-sm bg-white p-6" id="attack-records">
      <h2 className="text-xl font-bold mb-4">Detected Attacks Records</h2>
      <DataTable
        columns={columnsToRender}
        data={recordsWithCallback}
        totalPages={attackRecords?.total_pages || 0}
        pageSize={pageSize}
        currentPage={page}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}
