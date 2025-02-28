"use client";

import BarChart from "@/components/chart/BarChart";
import FTPSankey from "@/components/chart/ftp/sankey";
import { calculateMean } from "@/lib/utils";
import { SpecificAttackRecord } from "@/utils/client/fetchAttackDetectionVis";
import { useMemo } from "react";
import { generateAttackSankeyData, SankeyData } from "@/lib/vis_utils";
import { AttackVisTemplate } from "./template/AttackVisTemplate";

type PortscanVisSectionProps = {
  data:
    | {
        normalData: SpecificAttackRecord[];
        attackData: SpecificAttackRecord[];
      }
    | undefined;
};

export function PortscanVisSection({ data }: PortscanVisSectionProps) {
  // --- Unique Source Port Count
  const uniqueSrcPortPlot = useMemo(() => {
    if (!data) return { categories: [], data: [] };
    const { normalData, attackData } = data;
    const normalSrcPortValues = normalData.map((r) => r.srcPort);
    const attackSrcPortValues = attackData.map((r) => r.srcPort);
    const normalUniqueSrcPort = Array.from(new Set(normalSrcPortValues)).length;
    const attackUniqueSrcPort = Array.from(new Set(attackSrcPortValues)).length;
    return {
      categories: ["Normal", "Attack"],
      data: [normalUniqueSrcPort, attackUniqueSrcPort],
    };
  }, [data]);

  // --- Unique Destination Port Count
  const uniqueDstPortPlot = useMemo(() => {
    if (!data) return { categories: [], data: [] };
    const { normalData, attackData } = data;
    const normalDstPortValues = normalData.map((r) => r.dstPort);
    const attackDstPortValues = attackData.map((r) => r.dstPort);
    const normalUniqueDstPort = Array.from(new Set(normalDstPortValues)).length;
    const attackUniqueDstPort = Array.from(new Set(attackDstPortValues)).length;
    return {
      categories: ["Normal", "Attack"],
      data: [normalUniqueDstPort, attackUniqueDstPort],
    };
  }, [data]);

  // --- Sankey Data using the shared helper function
  const portscanSankeyData: SankeyData = useMemo(() => {
    if (!data) return { nodes: [], links: [], nodeMapping: {} };
    return generateAttackSankeyData(data, 100);
  }, [data]);

  // --- Total Length of Forward Packet Plot (Mean)
  const totalFwdPacketLengthPlot = useMemo(() => {
    if (!data) return { categories: [], data: [] };
    const { normalData, attackData } = data;
    const normalTotalLength = normalData.map((r) => r.totalLengthOfFwdPacket);
    const attackTotalLength = attackData.map((r) => r.totalLengthOfFwdPacket);
    const normalMean = parseFloat(calculateMean(normalTotalLength).toFixed(2));
    const attackMean = parseFloat(calculateMean(attackTotalLength).toFixed(2));
    return {
      categories: ["Normal", "Attack"],
      data: [normalMean, attackMean],
    };
  }, [data]);

  // Define the blocks for the 2x2 grid
  const blocks = [
    {
      component: (
        <BarChart
          title="Number of unique Src Port"
          data={uniqueSrcPortPlot.data}
          categories={uniqueSrcPortPlot.categories}
          yAxisName="Unique Src Port Count"
          enableZoom={false}
          enableSorting={false}
          withBorder={false}
          height={500}
        />
      ),
      accordionTitle: "What is Unique Src Port Count?",
      description:
        "Think of ports as doors on a building—'Unique Src Port Count' is like counting how many " +
        "different doors are being used to send data. In a port scan attack, attackers might use " +
        "many different doors (ports) to probe for vulnerabilities, so this helps spot unusual patterns.",
    },
    {
      component: (
        <BarChart
          title="Number of unique Dst Port"
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
        "Imagine a building with many doors—'Unique Dst Port Count' is like counting how many " +
        "different doors are being targeted. In a port scan attack, attackers often target multiple " +
        "doors (ports) to find open ones, so this metric can help detect suspicious activity.",
    },
    {
      component: (
        <FTPSankey
          data={portscanSankeyData}
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
          title="Total Length of Forward Packet"
          data={totalFwdPacketLengthPlot.data}
          categories={totalFwdPacketLengthPlot.categories}
          yAxisName="Mean Total Length of Forward Packet"
          enableZoom={false}
          enableSorting={false}
          withBorder={false}
          height={500}
        />
      ),
      accordionTitle: "What is Total Length of Forward Packet?",
      description:
        "Imagine sending a package through the mail—'Total Length of Forward Packet' is like measuring " +
        "the total size of all the packages you sent in a conversation. In network terms, it’s the sum of " +
        "the sizes of all data packets sent from your side. Unusual patterns in this size might indicate " +
        "a port scan attack.",
    },
  ];

  if (!data) return null;

  // Render the template with the blocks
  return <AttackVisTemplate blocks={blocks} />;
}