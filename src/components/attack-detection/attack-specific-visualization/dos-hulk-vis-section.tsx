"use client";

import BarChart from "@/components/chart/BarChart";
import FTPSankey from "@/components/chart/ftp/sankey";
import { calculateMean } from "@/lib/utils";
import { SpecificAttackRecord } from "@/utils/client/fetchAttackDetectionVis";
import { useMemo } from "react";
import { generateAttackSankeyData, SankeyData } from "@/lib/vis_utils";
import { AttackVisTemplate } from "./template/AttackVisTemplate"; // Adjust the import path as needed

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

  // --- Sankey Diagram Data
  const dosHulkSankeyData: SankeyData = useMemo(() => {
    if (!data) return { nodes: [], links: [], nodeMapping: {} };
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

  // Define the blocks for the AttackVisTemplate
  const blocks = [
    {
      component: (
        <BarChart
          title="Mean Bwd Packet Length Std"
          data={bwdPacketLengthStdPlot.data}
          categories={bwdPacketLengthStdPlot.categories}
          yAxisName="Mean Bwd Packet Length Std"
          enableZoom={false}
          enableSorting={false}
          withBorder={false}
          height={500}
        />
      ),
      accordionTitle: "What is Mean Bwd Packet Length Std?",
      description:
        "Imagine the sizes of envelopes coming back to you—'Mean Bwd Packet Length Std' measures " +
        "how much these sizes vary on average. In a DoS Hulk attack, this variation might be " +
        "unusually high or low, helping us detect if something’s off with the incoming data.",
    },
    {
      component: (
        <BarChart
          title="Number of Unique Dst Port"
          data={uniqueDstPortPlot.data}
          categories={uniqueDstPortPlot.categories}
          yAxisName="Unique Dst Port Count"
          enableZoom={false}
          enableSorting={false}
          withBorder={false}
          height={500}
        />
      ),
      accordionTitle: "What is Unique Dst Port Count?",
      description:
        "Think of ports as doors to a building—'Unique Dst Port Count' is like counting how many " +
        "different doors are being targeted. In a DoS Hulk attack, attackers might target specific " +
        "doors (ports) to overwhelm the system, so this helps spot unusual patterns.",
    },
    {
      component: (
        <FTPSankey
          data={dosHulkSankeyData}
          title="Sliced Data Sankey Diagram"
        />
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
          title="Mean Fwd Packet Length Max"
          data={fwdPacketLengthMaxPlot.data}
          categories={fwdPacketLengthMaxPlot.categories}
          yAxisName="Mean Fwd Packet Length Max"
          enableZoom={false}
          enableSorting={false}
          withBorder={false}
          height={500}
        />
      ),
      accordionTitle: "What is Mean Fwd Packet Length Max?",
      description:
        "Imagine sending a package through the mail—'Mean Fwd Packet Length Max' is like measuring " +
        "the average size of the largest package you sent in each conversation. In network terms, it’s " +
        "the average of the biggest chunk of data sent from your side. If this size changes a lot, " +
        "it might mean something unusual, like an attack, is happening!",
    },
  ];

  if (!data) return null;

  // Render the template with the blocks
  return <AttackVisTemplate blocks={blocks} />;
}