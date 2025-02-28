"use client";

import BarChart from "@/components/chart/BarChart";
import SankeyChart from "@/components/chart/ftp/sankey";
import { SpecificAttackRecord } from "@/utils/client/fetchAttackDetectionVis";
import { useMemo } from "react";
import { calculateMean } from "@/lib/utils";
import { generateAttackSankeyData, SankeyData } from "@/lib/vis_utils";
import { AttackVisTemplate } from "./template/AttackVisTemplate"; // Adjust the import path as needed

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

  // --- Sankey Diagram Data
  const slowlorisSankeyData: SankeyData = useMemo(() => {
    if (!data) return { nodes: [], links: [], nodeMapping: {} };
    return generateAttackSankeyData(data, 10);
  }, [data]);

  // --- Bar Plot for fwdPSHFlags (Mean)
  const fwdPSHFlagsPlot = useMemo(() => {
    if (!data) return { categories: [], data: [] };
    const { normalData, attackData } = data;
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

  // Define the blocks for the AttackVisTemplate
  const blocks = [
    {
      component: (
        <BarChart
          title="Total TCP Flow Time"
          data={totalTCPFlowTimePlot.data}
          categories={totalTCPFlowTimePlot.categories}
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
        "like a Slowloris attack, is happening!",
    },
    {
      component: (
        <SankeyChart data={slowlorisSankeyData} title="Sankey Diagram" />
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
          title="Forward PSH Flags Mean"
          data={fwdPSHFlagsPlot.data}
          categories={fwdPSHFlagsPlot.categories}
          yAxisName="Mean fwdPSHFlags"
          enableZoom={false}
          enableSorting={false}
          withBorder={false}
          height={500}
        />
      ),
      accordionTitle: "What is Forward PSH Flags Mean?",
      description:
        "Imagine sending a letter with an 'urgent' stamp—'Forward PSH Flags' is like counting how " +
        "often you use that stamp in your messages. In network terms, it’s a signal that the data " +
        "should be pushed immediately. If this happens a lot more or less than usual, it might " +
        "indicate a Slowloris attack trying to keep connections open.",
    },
    {
      component: (
        <BarChart
          title="Backward IAT Mean"
          data={bwdIATMeanPlot.data}
          categories={bwdIATMeanPlot.categories}
          yAxisName="Mean bwdIATMean"
          enableZoom={false}
          enableSorting={false}
          withBorder={false}
          height={500}
        />
      ),
      accordionTitle: "What is Backward IAT Mean?",
      description:
        "Think of 'Backward IAT Mean' as measuring the average time between replies in a conversation. " +
        "In network terms, it tracks how quickly data packets arrive from the other side. In a Slowloris " +
        "attack, these times might be unusually long as the attacker tries to keep connections open slowly.",
    },
  ];

  if (!data) return null;

  // Render the template with the blocks
  return <AttackVisTemplate blocks={blocks} />;
}