"use client";

import BarChart from "@/components/chart/BarChart";
import SankeyChart from "@/components/chart/ftp/sankey";
import { SpecificAttackRecord } from "@/utils/client/fetchAttackDetectionVis";
import { useMemo } from "react";
import { calculateMean } from "@/lib/utils";
import { generateAttackSankeyData, SankeyData } from "@/lib/vis_utils";
import { AttackVisTemplate } from './template/AttackVisTemplate';

type FTPPatatorVisSectionProps = {
  data:
    | {
        normalData: SpecificAttackRecord[];
        attackData: SpecificAttackRecord[];
      }
    | undefined;
};

export function FTPPatatorVisSection({ data }: FTPPatatorVisSectionProps) {
  // --- Bar Plot for Flow Bytes Per Second
  const ftpBarPlotFlowByte = useMemo(() => {
    if (!data) return { categories: [], data: [] };
    const { normalData, attackData } = data;
    const normalFlowByteValues = normalData.map((r) => r.flowBytesPerSecond);
    const attackFlowByteValues = attackData.map((r) => r.flowBytesPerSecond);
    const normalMean = parseFloat(calculateMean(normalFlowByteValues).toFixed(2));
    const attackMean = parseFloat(calculateMean(attackFlowByteValues).toFixed(2));
    return { categories: ["Normal", "Attack"], data: [normalMean, attackMean] };
  }, [data]);

  // --- Sankey Data
  const ftpSankeyData: SankeyData = useMemo(() => {
    if (!data) return { nodes: [], links: [], nodeMapping: {} };
    return generateAttackSankeyData(data, 25);
  }, [data]);

  // --- Bar Plot for Total TCP Flow Time
  const ftpBarPlotTotalTCPFlowTime = useMemo(() => {
    if (!data) return { categories: [], data: [] };
    const { normalData, attackData } = data;
    const normalTotalTCPFlowTime = normalData.map((r) => (r as any).totalTCPFlowTime);
    const attackTotalTCPFlowTime = attackData.map((r) => (r as any).totalTCPFlowTime);
    const normalMean = parseFloat(calculateMean(normalTotalTCPFlowTime).toFixed(2));
    const attackMean = parseFloat(calculateMean(attackTotalTCPFlowTime).toFixed(2));
    return { categories: ["Normal", "Attack"], data: [normalMean, attackMean] };
  }, [data]);

  // --- Bar Plot for bwdIATMean
  const ftpBarPlotBwdIATMean = useMemo(() => {
    if (!data) return { categories: [], data: [] };
    const { normalData, attackData } = data;
    const normalBwdIATMean = normalData.map((r) => (r as any).bwdIATMean);
    const attackBwdIATMean = attackData.map((r) => (r as any).bwdIATMean);
    const normalMean = parseFloat(calculateMean(normalBwdIATMean).toFixed(2));
    const attackMean = parseFloat(calculateMean(attackBwdIATMean).toFixed(2));
    return { categories: ["Normal", "Attack"], data: [normalMean, attackMean] };
  }, [data]);

  // Define the blocks for the AttackVisTemplate
  const blocks = [
    {
      component: (
        <BarChart
          title="Average Flow Bytes Per Second"
          data={ftpBarPlotFlowByte.data}
          categories={ftpBarPlotFlowByte.categories}
          yAxisName="Mean Flow Bytes/s"
          enableZoom={false}
          enableSorting={false}
          withBorder={false}
          height={500}
        />
      ),
      accordionTitle: "What is Mean Flow Bytes Per Second?",
      description:
        "Imagine you're sending messages back and forth with a friend. " +
        '"Mean Flow Bytes Per Second" measures the average amount of data ' +
        "moving each second. In network terms, it shows how much data is flowing " +
        "between two points, helping us spot unusual patterns, like an attack " +
        "flooding the system with data!",
    },
    {
      component: (
        <SankeyChart data={ftpSankeyData} title="Sankey Diagram" />
      ),
      accordionTitle: "How to Read a Sankey Diagram?",
      description:
        "Think of a Sankey diagram like a map of a river system! The 'rivers' (lines) show how " +
        "data flows from one place to another—like from a Source IP to a Source Port, then to a " +
        "Destination Port. The thicker the river, the more data is flowing. The boxes (nodes) are " +
        "like stops along the way, labeled with roles (e.g., 'Source IP'). Hover over them to see " +
        "details! Here, it helps us track how normal or attack traffic moves through the network.",
    },
    {
      component: (
        <BarChart
          title="Total TCP Flow Time"
          data={ftpBarPlotTotalTCPFlowTime.data}
          categories={ftpBarPlotTotalTCPFlowTime.categories}
          yAxisName="Mean Total TCP Flow Time"
          enableZoom={false}
          enableSorting={false}
          withBorder={false}
          height={500}
        />
      ),
      accordionTitle: "What is Total TCP Flow Time?",
      description:
        "Picture a phone call with a friend—'Total TCP Flow Time' is like measuring " +
        "how long the entire conversation lasts from start to finish. In network terms, " +
        "it’s the total time data takes to travel back and forth between two points. If " +
        "this time suddenly gets way longer or shorter, it might mean something sneaky, " +
        "like an attack, is happening!",
    },
    {
      component: (
        <BarChart
          title="Backward Inter-Arrival Time Mean"
          data={ftpBarPlotBwdIATMean.data}
          categories={ftpBarPlotBwdIATMean.categories}
          yAxisName="Mean bwdIATMean"
          enableZoom={false}
          enableSorting={false}
          withBorder={false}
          height={500}
        />
      ),
      accordionTitle: "What is Mean bwdIATMean?",
      description:
        "Think of 'Mean bwdIATMean' as a way to measure the average waiting time " +
        "between messages arriving back to you in a conversation. In the world of " +
        "networks, it shows how quickly data packets come from the other side. Big " +
        "changes in this time can hint at something odd, like a cyber attack, " +
        "messing with the usual flow!",
    },
  ];

  if (!data) return null;

  // Render the template with the blocks
  return <AttackVisTemplate blocks={blocks} />;
}