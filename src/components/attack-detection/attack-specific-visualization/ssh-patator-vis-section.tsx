"use client";

import BarChart from "@/components/chart/BarChart";
import SankeyChart from "@/components/chart/ftp/sankey"; // Rename import if necessary
import { SpecificAttackRecord } from "@/utils/client/fetchAttackDetectionVis";
import { useMemo } from "react";
import { calculateMean } from "@/lib/utils";
import { generateAttackSankeyData, SankeyData } from "@/lib/vis_utils";

type SSHPatatorVisSectionProps = {
  data:
    | {
        normalData: SpecificAttackRecord[];
        attackData: SpecificAttackRecord[];
      }
    | undefined;
};

export function SSHPatatorVisSection({ data }: SSHPatatorVisSectionProps) {
  // --- Bar Plot for Flow Bytes Per Second remains unchanged
  const sshBarPlotFwdPacketLengthMax = useMemo(() => {
    if (!data) return { categories: [], data: [] };

    const { normalData, attackData } = data;

    const normalFlowByteValues = normalData.map((r) => r.fwdPacketLengthMax);
    const attackFlowByteValues = attackData.map((r) => r.fwdPacketLengthMax);

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
  const sshSankeyData: SankeyData = useMemo(() => {
    return generateAttackSankeyData(data, 25);
  }, [data]);

  // --- Bar Plot for Total TCP Flow Time (replacing Average Packet Size)
  const sshBarPlotTotalTCPFlowTime = useMemo(() => {
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
  const sshBarPlotBwdInitWinBytesMean = useMemo(() => {
    if (!data) return { categories: [], data: [] };

    const { normalData, attackData } = data;
    // Assuming bwdIATMean field exists in the data
    const normalBwdIATMean = normalData.map((r) => (r as any).bwdInitWinBytes);
    const attackBwdIATMean = attackData.map((r) => (r as any).bwdInitWinBytes);

    console.log(normalBwdIATMean, attackBwdIATMean);

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
      {/* BarChart - Fwd Packet Length Max */}
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
        <BarChart
          title="Fwd Packet Length Max"
            data={sshBarPlotFwdPacketLengthMax.data}
            categories={sshBarPlotFwdPacketLengthMax.categories}
            yAxisName="Fwd Packet Length Max"
            enableZoom={false}
            enableSorting={false}
        />
      </div>

      {/* Sankey Diagram */}
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
        
      </div>

      {/* BarChart - Total TCP Flow Time */}
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
        
      </div>

      {/* BarChart - bwdIinitWinBytes */}
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
        
        </div> 
    </div>
  );
}
