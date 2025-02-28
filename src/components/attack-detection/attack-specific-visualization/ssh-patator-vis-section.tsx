"use client";

import BarChart from "@/components/chart/BarChart";
import SankeyChart from "@/components/chart/ftp/sankey";
import { SpecificAttackRecord } from "@/utils/client/fetchAttackDetectionVis";
import { useMemo } from "react";
import { calculateMean } from "@/lib/utils";
import { generateAttackSankeyData, SankeyData } from "@/lib/vis_utils";
import { AttackVisTemplate } from "./template/AttackVisTemplate"; // Adjust the import path as needed

type SSHPatatorVisSectionProps = {
  data:
    | {
        normalData: SpecificAttackRecord[];
        attackData: SpecificAttackRecord[];
      }
    | undefined;
};

export function SSHPatatorVisSection({ data }: SSHPatatorVisSectionProps) {
  // --- Bar Plot for Fwd Packet Length Max
  const sshBarPlotFwdPacketLengthMax = useMemo(() => {
    if (!data) return { categories: [], data: [] };
    const { normalData, attackData } = data;
    const normalValues = normalData.map((r) => r.fwdPacketLengthMax);
    const attackValues = attackData.map((r) => r.fwdPacketLengthMax);
    const normalMean = parseFloat(calculateMean(normalValues).toFixed(2));
    const attackMean = parseFloat(calculateMean(attackValues).toFixed(2));
    return { categories: ["Normal", "Attack"], data: [normalMean, attackMean] };
  }, [data]);

  // --- Sankey Data
  const sshSankeyData: SankeyData = useMemo(() => {
    if (!data) return { nodes: [], links: [], nodeMapping: {} };
    return generateAttackSankeyData(data, 25);
  }, [data]);

  // --- Bar Plot for Total TCP Flow Time
  const sshBarPlotTotalTCPFlowTime = useMemo(() => {
    if (!data) return { categories: [], data: [] };
    const { normalData, attackData } = data;
    const normalValues = normalData.map((r) => (r as any).totalTCPFlowTime);
    const attackValues = attackData.map((r) => (r as any).totalTCPFlowTime);
    const normalMean = parseFloat(calculateMean(normalValues).toFixed(2));
    const attackMean = parseFloat(calculateMean(attackValues).toFixed(2));
    return { categories: ["Normal", "Attack"], data: [normalMean, attackMean] };
  }, [data]);

  // --- Bar Plot for Bwd Init Win Bytes
  const sshBarPlotBwdInitWinBytesMean = useMemo(() => {
    if (!data) return { categories: [], data: [] };
    const { normalData, attackData } = data;
    const normalValues = normalData.map((r) => (r as any).bwdInitWinBytes);
    const attackValues = attackData.map((r) => (r as any).bwdInitWinBytes);
    const normalMean = parseFloat(calculateMean(normalValues).toFixed(2));
    const attackMean = parseFloat(calculateMean(attackValues).toFixed(2));
    return { categories: ["Normal", "Attack"], data: [normalMean, attackMean] };
  }, [data]);

  // Define the blocks for the AttackVisTemplate
  const blocks = [
    {
      component: (
        <BarChart
          title="Fwd Packet Length Max"
          data={sshBarPlotFwdPacketLengthMax.data}
          categories={sshBarPlotFwdPacketLengthMax.categories}
          yAxisName="Mean Fwd Packet Length Max"
          enableZoom={false}
          enableSorting={false}
          withBorder={false}
          height={500}
        />
      ),
      accordionTitle: "What is Fwd Packet Length Max?",
      description:
        "Imagine sending a package through the mail—'Fwd Packet Length Max' is like measuring " +
        "the size of the largest package you sent in a conversation. In network terms, it’s the " +
        "biggest chunk of data sent from your side to the other. If this size suddenly changes a " +
        "lot, it might mean something unusual, like an attack, is happening!",
    },
    {
      component: (
        <SankeyChart data={sshSankeyData} title="Sankey Diagram" />
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
          data={sshBarPlotTotalTCPFlowTime.data}
          categories={sshBarPlotTotalTCPFlowTime.categories}
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
          title="Bwd Init Win Bytes"
          data={sshBarPlotBwdInitWinBytesMean.data}
          categories={sshBarPlotBwdInitWinBytesMean.categories}
          yAxisName="Mean Bwd Init Win Bytes"
          enableZoom={false}
          enableSorting={false}
          withBorder={false}
          height={500}
        />
      ),
      accordionTitle: "What is Bwd Init Win Bytes?",
      description:
        "Imagine a window that controls how much data can be sent at once—'Bwd Init Win Bytes' " +
        "is like the starting size of that window for data coming back to you. In network terms, " +
        "it’s the initial amount of data the other side can send without waiting for confirmation. " +
        "Unusual changes in this size might signal something fishy, like an attack!",
    },
  ];

  if (!data) return null;

  // Render the template with the blocks
  return <AttackVisTemplate blocks={blocks} />;
}