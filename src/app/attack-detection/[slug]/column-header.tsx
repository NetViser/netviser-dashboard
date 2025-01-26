import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: any; // Keeping it flexible since sorting logic is removed
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  return <div className={cn("flex items-center space-x-2", className)}>{title}</div>;
}
