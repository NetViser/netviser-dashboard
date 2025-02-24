"use client";

import BarChart from "@/components/chart/BarChart";
import FTPSankey from "@/components/chart/ftp/sankey";
import { calculateMean } from "@/lib/utils";
import { SpecificAttackRecord } from "@/utils/client/fetchAttackDetectionVis";
import { useMemo } from "react";
import { generateAttackSankeyData, SankeyData } from "@/lib/vis_utils";

type DosHulkVisSectionProps = {
  data:
    | {
        normalData: SpecificAttackRecord[];
        attackData: SpecificAttackRecord[];
      }
    | undefined;
};

export function DosHulkVisSection({ data }: DosHulkVisSectionProps) {
  // --- Bar Plot for bwdpacketlengthstd (Mean)
  const bwdPacketLengthStdPlot = useMemo(() => {
    if (!data) return { categories: [], data: [] };
    const { normalData, attackData } = data;
    const normalValues = normalData.map((r) => r.bwdpacketlengthstd);
    const attackValues = attackData.map((r) => r.bwdpacketlengthstd);
    const normalMean = parseFloat(calculateMean(normalValues).toFixed(2));
    const attackMean = parseFloat(calculateMean(attackValues).toFixed(2));
    return {
      categories: ["Normal", "Attack"],
      data: [normalMean, attackMean],
    };
  }, [data]);

  // --- Bar Plot for Unique Destination Port Count
  const uniqueDstPortPlot = useMemo(() => {
    if (!data) return { categories: [], data: [] };
    const { normalData, attackData } = data;
    const normalDstPorts = normalData.map((r) => r.dstPort);
    const attackDstPorts = attackData.map((r) => r.dstPort);
    const normalUnique = Array.from(new Set(normalDstPorts)).length;
    const attackUnique = Array.from(new Set(attackDstPorts)).length;
    return {
      categories: ["Normal", "Attack"],
      data: [normalUnique, attackUnique],
    };
  }, [data]);

  // --- Sankey Diagram Data using the helper function
  const dosHulkSankeyData: SankeyData = useMemo(() => {
    return generateAttackSankeyData(data, 10);
  }, [data]);

  // --- Bar Plot for fwdPacketLengthMax (Mean)
  const fwdPacketLengthMaxPlot = useMemo(() => {
    if (!data) return { categories: [], data: [] };
    const { normalData, attackData } = data;
    const normalValues = normalData.map((r) => r.fwdPacketLengthMax);
    const attackValues = attackData.map((r) => r.fwdPacketLengthMax);
    const normalMean = parseFloat(calculateMean(normalValues).toFixed(2));
    const attackMean = parseFloat(calculateMean(attackValues).toFixed(2));
    return {
      categories: ["Normal", "Attack"],
      data: [normalMean, attackMean],
    };
  }, [data]);

  if (!data) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* BarChart - Mean bwdpacketlengthstd */}
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
        <BarChart
          title="Mean Bwd Packet Length Std"
          data={bwdPacketLengthStdPlot.data}
          categories={bwdPacketLengthStdPlot.categories}
          yAxisName="Bwd Packet Length Std"
          enableZoom={false}
          enableSorting={false}
        />
      </div>

      {/* BarChart - Unique Destination Port Count */}
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
        <BarChart
          title="Number of Unique Dst Port"
          data={uniqueDstPortPlot.data}
          categories={uniqueDstPortPlot.categories}
          yAxisName="Unique Dst Port Count"
          enableZoom={false}
          enableSorting={false}
        />
      </div>

      {/* Sankey Diagram */}
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
        <FTPSankey
          data={dosHulkSankeyData}
          title="Sliced Data Sankey Diagram"
        />
      </div>

      {/* BarChart - Mean fwdPacketLengthMax */}
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
        <BarChart
          title="Mean Fwd Packet Length Max"
          data={fwdPacketLengthMaxPlot.data}
          categories={fwdPacketLengthMaxPlot.categories}
          yAxisName="Fwd Packet Length Max"
          enableZoom={false}
          enableSorting={false}
        />
      </div>
    </div>
  );
}
