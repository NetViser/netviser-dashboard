"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./column-header";
import { AttackRecord } from "@/utils/client/fetchAttackDetectionRecord";
import { Button } from "@/components/ui/button";
import { PiChalkboardTeacherFill } from "react-icons/pi";

// Function to format ISO 8601 timestamps to millisecond-level precision
function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23", // Use 24-hour clock format
  };

  // Format the date without milliseconds
  const formattedDate = date.toLocaleString("en-US", options);

  // Extract milliseconds and append them to the formatted string
  const milliseconds = date.getMilliseconds().toString().padStart(3, "0");

  return `${formattedDate}.${milliseconds}`;
}

// Protocol mapping
const protocolMapping: Record<number, string> = {
  6: "TCP",
  17: "UDP",
  1: "ICMP",
  2: "IGMP",
  // Add more mappings as needed
};

export type AttackRecordWithXAI = AttackRecord & {
  onShowXAI?: (record: AttackRecord) => void;
};

// Usage in the column definition
export const columns: ColumnDef<AttackRecordWithXAI>[] = [
  {
    accessorKey: "timestamp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Timestamp" />
    ),
    cell: ({ row }) => {
      const isoTimestamp = row.getValue<string>("timestamp");
      return <div>{formatTimestamp(isoTimestamp)}</div>;
    },
  },
  {
    accessorKey: "srcIP",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Source IP" />
    ),
  },
  {
    accessorKey: "dstIP",
    header: "Destination IP",
  },
  {
    accessorKey: "srcPort",
    header: "Source Port",
  },
  {
    accessorKey: "dstPort",
    header: "Destination Port",
  },
  {
    accessorKey: "protocol",
    header: "Protocol",
    cell: ({ row }) => {
      const protocolNumber = row.getValue<number>("protocol");
      const protocolName =
        protocolMapping[protocolNumber] || `Unknown (${protocolNumber})`;
      return <div>{protocolName}</div>;
    },
  },
  {
    accessorKey: "flowBytesPerSecond",
    header: "Flow Bytes/s",
    cell: ({ row }) => {
      const value = row.getValue<number>("flowBytesPerSecond"); // Explicitly cast the type
      return <div className="text-right">{value.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "flowPacketsPerSecond",
    header: "Flow Packets/s",
    cell: ({ row }) => {
      const value = row.getValue<number>("flowPacketsPerSecond"); // Explicitly cast the type
      return <div className="text-right">{value.toFixed(2)}</div>;
    },
  },
  {
    id: "actions",
    header: "Explainability",
    cell: ({ row }) => {
      const rowData = row.original;

      return (
        <div className="w-full flex justify-end">
          <Button
            variant="outline" // Or any other variant you prefer as a base
            className="bg-orange-500 font-semibold text-white hover:text-gray-100 hover:bg-orange-600"
            onClick={() => rowData.onShowXAI?.(rowData)}
          >
            Show XAI
            <PiChalkboardTeacherFill className="w-5 h-5" />
          </Button>
        </div>
      );
    },
  },

  // {
  //   accessorKey: "avgPacketSize",
  //   header: "Avg Packet Size",
  //   cell: ({ row }) => {
  //     const value = row.getValue<number>("avgPacketSize"); // Explicitly cast the type
  //     return <div className="text-right">{value.toFixed(2)}</div>;
  //   },
  // },
];
