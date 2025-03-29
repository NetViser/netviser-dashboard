import { AttackRecord } from "@/lib/api/fetchAttackDetectionRecord";
import { ColumnDef } from "@tanstack/react-table";

export type AttackRecordsSectionProps = {
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

export interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: any; // Keeping it flexible since sorting logic is removed
  title: string;
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalPages: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}
