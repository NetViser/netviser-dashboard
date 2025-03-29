"use client";

import { cn } from "@/utils/utils";
import { DataTableColumnHeaderProps } from "./types";

export function DataTableColumnHeader<TData, TValue>({
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  return <div className={cn("flex items-center space-x-2", className)}>{title}</div>;
}
