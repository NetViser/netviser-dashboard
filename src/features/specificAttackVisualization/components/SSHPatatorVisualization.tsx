"use client";

import BarChart from "@/components/chart/BarChart";
import SankeyChart from "@/components/chart/ftp/sankey";
import AttackSpecificVisualizationTemplate from "./AttackSpecificVisualizationTemplate";
import { FeatureDescriptionMap } from "@/utils/specificVisualizationDescriptions"; // Import the feature map
import { SpecificAttackVisualizationSectionProps } from "../types";

export function SSHPatatorVisSection({ data }: SpecificAttackVisualizationSectionProps) {
  if (!data) return null;

  const { means, sankeyData } = data;
  const { normal, attack } = means;

  // Define the blocks for the AttackVisTemplate using FeatureDescriptionMap
  const blocks = [
    {
      component: (
        <BarChart
          title={FeatureDescriptionMap.fwdPacketLengthMax.title}
          data={[normal.fwdPacketLengthMax ?? 0, attack.fwdPacketLengthMax ?? 0]}
          categories={["Normal", "Attack"]}
          yAxisName="Mean Forward Packet Length Max (bytes)"
          enableZoom={false}
          enableSorting={false}
          withBorder={false}
          height={500}
        />
      ),
      accordionTitle: "What is Forward Packet Length Max?",
      description: FeatureDescriptionMap.fwdPacketLengthMax.description,
    },
    {
      component: (
        <SankeyChart
          data={sankeyData}
          title={FeatureDescriptionMap.sankeyData.title}
        />
      ),
      accordionTitle: "How to Read a Sankey Diagram?",
      description: FeatureDescriptionMap.sankeyData.description,
    },
    {
      component: (
        <BarChart
          title={FeatureDescriptionMap.totalTCPFlowTime.title}
          data={[normal.totalTCPFlowTime ?? 0, attack.totalTCPFlowTime ?? 0]}
          categories={["Normal", "Attack"]}
          yAxisName="Mean Total TCP Flow Time (seconds)"
          enableZoom={false}
          enableSorting={false}
          withBorder={false}
          height={500}
        />
      ),
      accordionTitle: "What is Total TCP Flow Time?",
      description: FeatureDescriptionMap.totalTCPFlowTime.description,
    },
    {
      component: (
        <BarChart
          title={FeatureDescriptionMap.bwdInitWinBytes.title}
          data={[normal.bwdInitWinBytes ?? 0, attack.bwdInitWinBytes ?? 0]}
          categories={["Normal", "Attack"]}
          yAxisName="Mean Bwd Init Win Bytes (bytes)"
          enableZoom={false}
          enableSorting={false}
          withBorder={false}
          height={500}
        />
      ),
      accordionTitle: "What is Bwd Init Win Bytes?",
      description: FeatureDescriptionMap.bwdInitWinBytes.description,
    },
  ];

  return <AttackSpecificVisualizationTemplate blocks={blocks} />;
}