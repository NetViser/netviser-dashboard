"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./ColumnHeader";
import { AttackRecord } from "@/lib/api/fetchAttackDetectionRecord";
import { Button } from "@/components/ui/button";
import { FaExpandAlt } from "react-icons/fa";
import { formatTimestamp } from "./utils";

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
            className="bg-orange-500 font-semibold text-white hover:text-gray-100 hover:bg-orange-600 group"
            onClick={() => rowData.onShowXAI?.(rowData)}
          >
            Show XAI
            <FaExpandAlt className="w-5 h-5 text-white ml-1 transition transform group-hover:scale-110" />
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
