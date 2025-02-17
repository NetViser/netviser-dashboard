"use client";

import BarChart from "@/components/chart/BarChart";
import FTPBoxPlot from "@/components/chart/ftp/boxplot";
import { SpecificAttackRecord } from "@/utils/client/fetchAttackDetectionVis";
import { useMemo } from "react";
import { calculateMean } from "@/lib/utils";
import { categories } from "plotly.js/lib/box";
import FTPSankey from "@/components/chart/ftp/sankey";

type DDOSVisSectionProps = {
  data:
    | {
        normalData: SpecificAttackRecord[];
        attackData: SpecificAttackRecord[];
      }
    | undefined;
};

export function DDOSVisSection({ data }: DDOSVisSectionProps) {
  // --- Acitve Flow
  const activeFlowBarPlot = useMemo(() => {
    if (!data) return { categories: [], data: [] };

    const { normalData, attackData } = data;

    const normalsrcIPValues = normalData.map((r) => r.srcIp);
    const attacksrcIPValues = attackData.map((r) => r.srcIp);

    // unique values and convert to number
    const normalUniqueSrcIP = Array.from(new Set(normalsrcIPValues)).length;
    const attackUniqueSrcIP = Array.from(new Set(attacksrcIPValues)).length;

    return {
      categories: ["Normal", "Attack"],
      data: [normalUniqueSrcIP, attackUniqueSrcIP],
    };
  }, [data]);

  // --- Packet length
  const BarPacketLength = useMemo(() => {
    if (!data) return  { categories: [], data: [] };

    const { normalData, attackData } = data;

    const normalPacketLengthMeanValues = normalData.map((r) => r.packetlengthmean);
    const attackPacketLengthMeanValues = attackData.map((r) => r.packetlengthmean);

    const normalMean = parseFloat(
        calculateMean(normalPacketLengthMeanValues).toFixed(2)
      );
    const attackMean = parseFloat(
        calculateMean(attackPacketLengthMeanValues).toFixed(2)
    );

    return {
        categories: ["Normal", "Attack"],
        data: [normalMean, attackMean],
    }
    
    /*[
        {
          name: "Normal",
          data: normalPacketLengthMeanValues,
          color: "#4CAF50", // Green
        },
        {
          name: "Attack",
          data: attackPacketLengthMeanValues,
          color: "#F44336", // Red
        },
    ];*/
  }, [data]);

  // --- Sankey Data
  const ftpSankeyData = useMemo(() => {
    if (!data) return { nodes: [], links: [] };

    let { attackData } = data;  // Let `attackData` be mutable

    // Limit the number of records to 100
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

  // --- Bar Plot for Flow Duration

  if (!data) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* BarPlot - Active flow */}
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
        <BarChart
            title="Number of unique source IPs"
            data={activeFlowBarPlot.data}
            categories={activeFlowBarPlot.categories}
            yAxisName="unique source IPs"
            enableZoom={false}
            enableSorting={false}
        />
      </div>

      {/* BoxPlot - Flow Bytes */}
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

      {/* Sankey - srcip port dstip */}
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
        <FTPSankey data={ftpSankeyData} title="Sliced Data Sankey Diagram" />
      </div>

      {/* BarPlot - Flow Duration */}
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
       
       </div>
    </div>
  );
}
