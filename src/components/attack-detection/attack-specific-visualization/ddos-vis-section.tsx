"use client";

import BarChart from "@/components/chart/BarChart";
import FTPSankey from "@/components/chart/ftp/sankey";
import { calculateMean } from "@/lib/utils";
import { SpecificAttackRecord } from "@/utils/client/fetchAttackDetectionVis";
import { useMemo } from "react";
import { generateAttackSankeyData, SankeyData } from "@/lib/vis_utils";
import { AttackVisTemplate } from "./template/AttackVisTemplate"; // Adjust the import path as needed

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
    const normalSrcIPValues = normalData.map((r) => r.srcIp);
    const attackSrcIPValues = attackData.map((r) => r.srcIp);
    const normalUniqueSrcIP = Array.from(new Set(normalSrcIPValues)).length;
    const attackUniqueSrcIP = Array.from(new Set(attackSrcIPValues)).length;
    return {
      categories: ["Normal", "Attack"],
      data: [normalUniqueSrcIP, attackUniqueSrcIP],
    };
  }, [data]);

  // --- Packet Length (Average Packet Length)
  const barPacketLength = useMemo(() => {
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

  // --- Sankey Data
  const ddosSankeyData: SankeyData = useMemo(() => {
    if (!data) return { nodes: [], links: [], nodeMapping: {} };
    return generateAttackSankeyData(data, 10);
  }, [data]);

  // --- Bar Plot for Bwd Packet Length Std (Mean)
  const ddosBwdPacketLengthStd = useMemo(() => {
    if (!data) return { categories: [], data: [] };
    const { normalData, attackData } = data;
    const normalBwdPacketLengthStd = normalData.map((r) => r.bwdpacketlengthstd);
    const attackBwdPacketLengthStd = attackData.map((r) => r.bwdpacketlengthstd);
    const normalMean = parseFloat(calculateMean(normalBwdPacketLengthStd).toFixed(2));
    const attackMean = parseFloat(calculateMean(attackBwdPacketLengthStd).toFixed(2));
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
          title="Number of Unique Source IPs"
          data={activeFlowBarPlot.data}
          categories={activeFlowBarPlot.categories}
          yAxisName="Unique Source IPs"
          enableZoom={false}
          enableSorting={false}
          withBorder={false}
          height={500}
        />
      ),
      accordionTitle: "What is Unique Source IPs?",
      description:
        "Imagine a crowd of people trying to enter a building—'Unique Source IPs' is like counting " +
        "how many different people (IPs) are sending data. In a DDoS attack, you might see a lot more " +
        "people (IPs) trying to flood the network, which can be a sign of trouble!",
    },
    {
      component: (
        <BarChart
          title="Average Packet Length"
          data={barPacketLength.data}
          categories={barPacketLength.categories}
          yAxisName="Mean Packet Length"
          enableZoom={false}
          enableSorting={false}
          withBorder={false}
          height={500}
        />
      ),
      accordionTitle: "What is Average Packet Length?",
      description:
        "Think of packets as envelopes carrying data—'Average Packet Length' is like measuring " +
        "the average size of these envelopes. In a DDoS attack, attackers might send unusually " +
        "large or small envelopes to overwhelm the network, so this helps spot suspicious patterns.",
    },
    {
      component: (
        <FTPSankey data={ddosSankeyData} title="Sliced Data Sankey Diagram" />
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
          title="Bwd Packet Length Std"
          data={ddosBwdPacketLengthStd.data}
          categories={ddosBwdPacketLengthStd.categories}
          yAxisName="Mean Bwd Packet Length Std"
          enableZoom={false}
          enableSorting={false}
          withBorder={false}
          height={500}
        />
      ),
      accordionTitle: "What is Bwd Packet Length Std?",
      description:
        "Imagine the sizes of envelopes coming back to you—'Bwd Packet Length Std' measures how " +
        "much these sizes vary. In a DDoS attack, the variation might be unusually high or low, " +
        "helping us detect if something’s off with the incoming data.",
    },
  ];

  if (!data) return null;

  // Render the template with the blocks
  return <AttackVisTemplate blocks={blocks} />;
}