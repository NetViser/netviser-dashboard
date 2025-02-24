"use client";

import BarChart from "@/components/chart/BarChart";
import SankeyChart from "@/components/chart/ftp/sankey"; // Rename import if necessary
import { SpecificAttackRecord } from "@/utils/client/fetchAttackDetectionVis";
import { useMemo } from "react";
import { calculateMean } from "@/lib/utils";
import { generateAttackSankeyData, SankeyData } from "@/lib/vis_utils";

type FTPPatatorVisSectionProps = {
  data:
    | {
        normalData: SpecificAttackRecord[];
        attackData: SpecificAttackRecord[];
      }
    | undefined;
};

export function FTPPatatorVisSection({ data }: FTPPatatorVisSectionProps) {
  // --- Bar Plot for Flow Bytes Per Second remains unchanged
  const ftpBarPlotFlowByte = useMemo(() => {
    if (!data) return { categories: [], data: [] };

    const { normalData, attackData } = data;

    const normalFlowByteValues = normalData.map((r) => r.flowBytesPerSecond);
    const attackFlowByteValues = attackData.map((r) => r.flowBytesPerSecond);

    const normalMean = parseFloat(
      calculateMean(normalFlowByteValues).toFixed(2)
    );
    const attackMean = parseFloat(
      calculateMean(attackFlowByteValues).toFixed(2)
    );

    return {
      categories: ["Normal", "Attack"],
      data: [normalMean, attackMean],
    };
  }, [data]);

  // --- Sankey Data using the shared helper function
  const ftpSankeyData: SankeyData = useMemo(() => {
    return generateAttackSankeyData(data, 25);
  }, [data]);

  // --- Bar Plot for Total TCP Flow Time (replacing Average Packet Size)
  const ftpBarPlotTotalTCPFlowTime = useMemo(() => {
    if (!data) return { categories: [], data: [] };

    const { normalData, attackData } = data;
    // Assuming totalTCPFlowTime field exists in the data
    const normalTotalTCPFlowTime = normalData.map(
      (r) => (r as any).totalTCPFlowTime
    );
    const attackTotalTCPFlowTime = attackData.map(
      (r) => (r as any).totalTCPFlowTime
    );

    const normalMean = parseFloat(
      calculateMean(normalTotalTCPFlowTime).toFixed(2)
    );
    const attackMean = parseFloat(
      calculateMean(attackTotalTCPFlowTime).toFixed(2)
    );

    return {
      categories: ["Normal", "Attack"],
      data: [normalMean, attackMean],
    };
  }, [data]);

  // --- Bar Plot for bwdIATMean (replacing Average Flow Duration)
  const ftpBarPlotBwdIATMean = useMemo(() => {
    if (!data) return { categories: [], data: [] };

    const { normalData, attackData } = data;
    // Assuming bwdIATMean field exists in the data
    const normalBwdIATMean = normalData.map((r) => (r as any).bwdIATMean);
    const attackBwdIATMean = attackData.map((r) => (r as any).bwdIATMean);

    const normalMean = parseFloat(
      calculateMean(normalBwdIATMean).toFixed(2)
    );
    const attackMean = parseFloat(
      calculateMean(attackBwdIATMean).toFixed(2)
    );

    return {
      categories: ["Normal", "Attack"],
      data: [normalMean, attackMean],
    };
  }, [data]);

  if (!data) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* BarChart - Flow Bytes Per Second */}
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
        <BarChart
          title="Average Flow Bytes Per Second"
          data={ftpBarPlotFlowByte.data}
          categories={ftpBarPlotFlowByte.categories}
          yAxisName="Mean Flow Bytes/s"
          enableZoom={false}
          enableSorting={false}
        />
      </div>

      {/* Sankey Diagram */}
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
        <SankeyChart data={ftpSankeyData} title="Sankey Diagram" />
      </div>

      {/* BarChart - Total TCP Flow Time */}
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
        <BarChart
          title="Total TCP Flow Time"
          data={ftpBarPlotTotalTCPFlowTime.data}
          categories={ftpBarPlotTotalTCPFlowTime.categories}
          yAxisName="Mean Total TCP Flow Time"
          enableZoom={false}
          enableSorting={false}
        />
      </div>

      {/* BarChart - bwdIATMean */}
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
        <BarChart
          title="Backward Inter-Arrival Time Mean"
          data={ftpBarPlotBwdIATMean.data}
          categories={ftpBarPlotBwdIATMean.categories}
          yAxisName="Mean bwdIATMean"
          enableZoom={false}
          enableSorting={false}
        />
      </div>
    </div>
  );
}
