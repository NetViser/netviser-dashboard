"use client";

import { columns as baseColumns } from "./columns";
import { DataTable } from "./data-table";
import { AttackRecord } from "@/utils/client/fetchAttackDetectionRecord";

type Props = {
  attackRecords: {
    attack_data: AttackRecord[];
    total_pages: number;
  } | undefined;
  attackType: string;
  explainabilityMode: "Visualization" | "XAI";
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onShowXAI: (rowId: number) => void;
};

export function AttackRecordsSection({
  attackRecords,
  attackType,
  explainabilityMode,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onShowXAI,
}: Props) {
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
    <div className="w-full rounded-lg shadow-sm bg-white p-6">
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
