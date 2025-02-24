"use client";

import BarChart from "@/components/chart/BarChart";
import FTPSankey from "@/components/chart/ftp/sankey";
import { calculateMean } from "@/lib/utils";
import { SpecificAttackRecord } from "@/utils/client/fetchAttackDetectionVis";
import { useMemo } from "react";
import { generateAttackSankeyData, SankeyData } from "@/lib/vis_utils";

type DDOSVisSectionProps = {
  data:
    | {
        normalData: SpecificAttackRecord[];
        attackData: SpecificAttackRecord[];
      }
    | undefined;
};

export function DDOSVisSection({ data }: DDOSVisSectionProps) {
  // --- Active Flow (Unique Source IPs)
  const activeFlowBarPlot = useMemo(() => {
    if (!data) return { categories: [], data: [] };
    const { normalData, attackData } = data;
    const normalsrcIPValues = normalData.map((r) => r.srcIp);
    const attacksrcIPValues = attackData.map((r) => r.srcIp);
    const normalUniqueSrcIP = Array.from(new Set(normalsrcIPValues)).length;
    const attackUniqueSrcIP = Array.from(new Set(attacksrcIPValues)).length;
    return {
      categories: ["Normal", "Attack"],
      data: [normalUniqueSrcIP, attackUniqueSrcIP],
    };
  }, [data]);

  // --- Packet Length (Average Packet Length)
  const BarPacketLength = useMemo(() => {
    if (!data) return { categories: [], data: [] };
    const { normalData, attackData } = data;
    const normalPacketLengthMeanValues = normalData.map((r) => r.packetlengthmean);
    const attackPacketLengthMeanValues = attackData.map((r) => r.packetlengthmean);
    const normalMean = parseFloat(calculateMean(normalPacketLengthMeanValues).toFixed(2));
    const attackMean = parseFloat(calculateMean(attackPacketLengthMeanValues).toFixed(2));
    return {
      categories: ["Normal", "Attack"],
      data: [normalMean, attackMean],
    };
  }, [data]);

  // --- Sankey Data using the helper function from "@/lib/vis_utils"
  const ddosSankeyData: SankeyData = useMemo(() => {
    // Use a slice count of 25 records
    return generateAttackSankeyData(data, 10);
  }, [data]);

  // --- Bar Plot for Bwd Packet Length Std (Mean)
  const ddos_bwdpacketlengthstd = useMemo(() => {
    if (!data) return { categories: [], data: [] };
    const { normalData, attackData } = data;
    const normalbwdpacketlengthstd = normalData.map((r) => r.bwdpacketlengthstd);
    const attackbwdpacketlengthstd = attackData.map((r) => r.bwdpacketlengthstd);
    const normalMean = parseFloat(calculateMean(normalbwdpacketlengthstd).toFixed(2));
    const attackMean = parseFloat(calculateMean(attackbwdpacketlengthstd).toFixed(2));
    return {
      categories: ["Normal", "Attack"],
      data: [normalMean, attackMean],
    };
  }, [data]);

  if (!data) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* BarChart - Active Flow (Unique Source IPs) */}
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
        <BarChart
          title="Number of unique source IPs"
          data={activeFlowBarPlot.data}
          categories={activeFlowBarPlot.categories}
          yAxisName="Unique Source IPs"
          enableZoom={false}
          enableSorting={false}
        />
      </div>

      {/* BarChart - Average Packet Length */}
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
        <BarChart
          title="Average Packet Length"
          data={BarPacketLength.data}
          categories={BarPacketLength.categories}
          yAxisName="Mean Packet Length"
          enableZoom={false}
          enableSorting={false}
        />
      </div>

      {/* Sankey Diagram */}
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
        <FTPSankey data={ddosSankeyData} title="Sliced Data Sankey Diagram" />
      </div>

      {/* BarChart - Bwd Packet Length Std */}
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
        <BarChart
          title="Bwd Packet Length Std"
          data={ddos_bwdpacketlengthstd.data}
          categories={ddos_bwdpacketlengthstd.categories}
          yAxisName="Bwd Packet Length Std"
          enableZoom={false}
          enableSorting={false}
        />
      </div>
    </div>
  );
}
