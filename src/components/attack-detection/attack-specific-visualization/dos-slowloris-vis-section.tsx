"use client";

import BarChart from "@/components/chart/BarChart";
import SankeyChart from "@/components/chart/ftp/sankey"; // Updated Sankey component name
import { calculateMean } from "@/lib/utils";
import { SpecificAttackRecord } from "@/utils/client/fetchAttackDetectionVis";
import { useMemo } from "react";
import { generateAttackSankeyData, SankeyData } from "@/lib/vis_utils";

type DoSSlowlorisVisSectionProps = {
  data:
    | {
        normalData: SpecificAttackRecord[];
        attackData: SpecificAttackRecord[];
      }
    | undefined;
};

export function DoSSlowlorisVisSection({ data }: DoSSlowlorisVisSectionProps) {
  // --- Bar Plot for Total TCP Flow Time (Mean)
  const totalTCPFlowTimePlot = useMemo(() => {
    if (!data) return { categories: [], data: [] };
    const { normalData, attackData } = data;
    const normalTotalTCPFlowTime = normalData.map((r) => (r as any).totalTCPFlowTime);
    const attackTotalTCPFlowTime = attackData.map((r) => (r as any).totalTCPFlowTime);
    const normalMean = parseFloat(calculateMean(normalTotalTCPFlowTime).toFixed(2));
    const attackMean = parseFloat(calculateMean(attackTotalTCPFlowTime).toFixed(2));
    return {
      categories: ["Normal", "Attack"],
      data: [normalMean, attackMean],
    };
  }, [data]);

  // --- Sankey Diagram Data using the shared helper function (slice count = 10)
  const slowlorisSankeyData: SankeyData = useMemo(() => {
    return generateAttackSankeyData(data, 10);
  }, [data]);

  // --- Bar Plot for fwdPSHFlags (Mean)
  const fwdPSHFlagsPlot = useMemo(() => {
    if (!data) return { categories: [], data: [] };
    const { normalData, attackData } = data;
    // Assuming the data has a "fwdPSHFlags" field
    const normalFwdPSHFlags = normalData.map((r) => (r as any).fwdPSHFlags);
    const attackFwdPSHFlags = attackData.map((r) => (r as any).fwdPSHFlags);
    const normalMean = parseFloat(calculateMean(normalFwdPSHFlags).toFixed(2));
    const attackMean = parseFloat(calculateMean(attackFwdPSHFlags).toFixed(2));
    return {
      categories: ["Normal", "Attack"],
      data: [normalMean, attackMean],
    };
  }, [data]);

  // --- Bar Plot for bwdIATMean (Mean)
  const bwdIATMeanPlot = useMemo(() => {
    if (!data) return { categories: [], data: [] };
    const { normalData, attackData } = data;
    const normalBwdIATMean = normalData.map((r) => (r as any).bwdIATMean);
    const attackBwdIATMean = attackData.map((r) => (r as any).bwdIATMean);
    const normalMean = parseFloat(calculateMean(normalBwdIATMean).toFixed(2));
    const attackMean = parseFloat(calculateMean(attackBwdIATMean).toFixed(2));
    return {
      categories: ["Normal", "Attack"],
      data: [normalMean, attackMean],
    };
  }, [data]);

  if (!data) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* BarChart - Total TCP Flow Time */}
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
        <BarChart
          title="Total TCP Flow Time"
          data={totalTCPFlowTimePlot.data}
          categories={totalTCPFlowTimePlot.categories}
          yAxisName="Mean Total TCP Flow Time"
          enableZoom={false}
          enableSorting={false}
        />
      </div>

      {/* Sankey Diagram */}
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
        <SankeyChart data={slowlorisSankeyData} title="Sankey Diagram" />
      </div>

      {/* BarChart - Forward PSH Flags */}
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
        <BarChart
          title="Forward PSH Flags Mean"
          data={fwdPSHFlagsPlot.data}
          categories={fwdPSHFlagsPlot.categories}
          yAxisName="Mean fwdPSHFlags"
          enableZoom={false}
          enableSorting={false}
        />
      </div>

      {/* BarChart - Backward IAT Mean */}
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
        <BarChart
          title="Backward IAT Mean"
          data={bwdIATMeanPlot.data}
          categories={bwdIATMeanPlot.categories}
          yAxisName="Mean bwdIATMean"
          enableZoom={false}
          enableSorting={false}
        />
      </div>
    </div>
  );
}
