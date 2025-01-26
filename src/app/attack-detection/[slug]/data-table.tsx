import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa"; // Importing icons for skip to first and last page

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalPages: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalPages,
  pageSize,
  currentPage,
  onPageChange,
  onPageSizeChange,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const pageSizes = [5, 10, 20, 50]; // Options for items per page

  return (
    <div className="rounded-lg border bg-white text-black shadow-md">
      <Table className="rounded-lg overflow-hidden">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="uppercase bg-gray-900 text-gray-100">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="text- font-semibold" // Added styles for larger, bolder text
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="hover:bg-orange-100 transition-colors h-12"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="border-t border-gray-300">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-gray-500"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-4 py-3 rounded-b-lg bg-gray-100">
        <div className="flex items-center gap-x-4">
          <Select
            onValueChange={(value) => onPageSizeChange(Number(value))}
            defaultValue={String(pageSize)}
          >
            <SelectTrigger className="w-32 bg-gray-900 text-gray-100">
              <SelectValue placeholder="Rows per page" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-gray-100">
              {pageSizes.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} rows
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-x-2">
          <Button
            className="bg-gray-900 text-white hover:bg-gray-700"
            onClick={() => onPageChange(1)} // Go to first page
            disabled={currentPage === 1}
          >
            <FaAngleDoubleLeft /> {/* Icon for skip to first page */}
          </Button>
          <Button
            className="bg-gray-900 text-white hover:bg-gray-700"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            className="bg-gray-900 text-white hover:bg-gray-700"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
          <Button
            className="bg-gray-900 text-white hover:bg-gray-700"
            onClick={() => onPageChange(totalPages)} // Go to last page
            disabled={currentPage === totalPages}
          >
            <FaAngleDoubleRight /> {/* Icon for skip to last page */}
          </Button>
        </div>
      </div>
    </div>
  );
}
