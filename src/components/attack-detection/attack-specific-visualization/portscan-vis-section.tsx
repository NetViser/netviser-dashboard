"use client";

import BarChart from "@/components/chart/BarChart";
import FTPSankey from "@/components/chart/ftp/sankey";
import { calculateMean } from "@/lib/utils";
import { SpecificAttackRecord } from "@/utils/client/fetchAttackDetectionVis";
import { useMemo } from "react";

type PortscanVisSectionProps = {
  data:
    | {
        normalData: SpecificAttackRecord[];
        attackData: SpecificAttackRecord[];
      }
    | undefined;
};

export function PortscanVisSection({ data }: PortscanVisSectionProps) {
  // --- Unique Source Port Count
  const uniqueSrcPortPlot = useMemo(() => {
    if (!data) return { categories: [], data: [] };

    const { normalData, attackData } = data;

    const normalSrcPortValues = normalData.map((r) => r.srcPort);
    const attackSrcPortValues = attackData.map((r) => r.srcPort);

    const normalUniqueSrcPort = Array.from(new Set(normalSrcPortValues)).length;
    const attackUniqueSrcPort = Array.from(new Set(attackSrcPortValues)).length;

    return {
      categories: ["Normal", "Attack"],
      data: [normalUniqueSrcPort, attackUniqueSrcPort],
    };
  }, [data]);

  // --- Unique Destination Port Count
  const uniqueDstPortPlot = useMemo(() => {
    if (!data) return { categories: [], data: [] };

    const { normalData, attackData } = data;

    const normalDstPortValues = normalData.map((r) => r.dstPort);
    const attackDstPortValues = attackData.map((r) => r.dstPort);

    const normalUniqueDstPort = Array.from(new Set(normalDstPortValues)).length;
    const attackUniqueDstPort = Array.from(new Set(attackDstPortValues)).length;

    return {
      categories: ["Normal", "Attack"],
      data: [normalUniqueDstPort, attackUniqueDstPort],
    };
  }, [data]);

  // --- Sankey Data
  const ftpSankeyData = useMemo(() => {
    if (!data) return { nodes: [], links: [] };

    let { attackData } = data; // Let `attackData` be mutable

    // Limit the number of records to 25
    attackData = attackData.slice(0, 25);

    const nodes = Array.from(
      new Set(
        attackData.flatMap((record) => [
          String(record.srcPort),
          String(record.dstIp),
          String(record.srcIp),
        ])
      )
    ).map((name) => ({ name }));

    const srcIpLinks = attackData.map((record) => ({
      source: String(record.srcIp),
      target: String(record.srcPort),
      value: record.srcIpPortPairCount,
    }));

    const portLinks = attackData.map((record) => ({
      source: String(record.srcPort),
      target: String(record.dstIp),
      value: record.portPairCount,
    }));

    return {
      nodes,
      links: [...srcIpLinks, ...portLinks],
    };
  }, [data]);

  // --- Total Length of Forward Packet Plot (replaces Bwd Packet Length Std)
  const totalFwdPacketLengthPlot = useMemo(() => {
    if (!data) return { categories: [], data: [] };

    const { normalData, attackData } = data;

    const normalTotalLength = normalData.map((r) => r.totalLengthOfFwdPacket);
    const attackTotalLength = attackData.map((r) => r.totalLengthOfFwdPacket);

    const normalMean = parseFloat(calculateMean(normalTotalLength).toFixed(2));
    const attackMean = parseFloat(calculateMean(attackTotalLength).toFixed(2));

    return {
      categories: ["Normal", "Attack"],
      data: [normalMean, attackMean],
    };
  }, [data]);

  if (!data) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* BarChart - Unique Source Port */}
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
        <BarChart
          title="Number of unique Src Port"
          data={uniqueSrcPortPlot.data}
          categories={uniqueSrcPortPlot.categories}
          yAxisName="Unique Src Port Count"
          enableZoom={false}
          enableSorting={false}
        />
      </div>

      {/* BarChart - Unique Destination Port */}
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
        <BarChart
          title="Number of unique Dst Port"
          data={uniqueDstPortPlot.data}
          categories={uniqueDstPortPlot.categories}
          yAxisName="Unique Dst Port Count"
          enableZoom={false}
          enableSorting={false}
        />
      </div>

      {/* Sankey - srcip port dstip */}
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
        <FTPSankey data={ftpSankeyData} title="Sliced Data Sankey Diagram" />
      </div>

      {/* BarChart - Total Length of Forward Packet */}
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
        <BarChart
          title="Total Length of Forward Packet"
          data={totalFwdPacketLengthPlot.data}
          categories={totalFwdPacketLengthPlot.categories}
          yAxisName="Total Length of Forward Packet"
          enableZoom={false}
          enableSorting={false}
        />
      </div>
    </div>
  );
}
