"use client";

import BarChart from "@/components/chart/BarChart";
import SankeyChart from "@/components/chart/ftp/sankey";
import AttackSpecificVisualizationTemplate from "./AttackSpecificVisualizationTemplate";
import { FeatureDescriptionMap } from "@/utils/specificVisualizationDescriptions"; // Import the feature map
import { SpecificAttackVisualizationSectionProps } from "../types/index.types";

export function FTPPatatorVisSection({ data }: SpecificAttackVisualizationSectionProps) {
  if (!data) return null;

  const { means, sankeyData } = data;
  const { normal, attack } = means;

  const blocks = [
    {
      component: (
        <BarChart
          title={FeatureDescriptionMap.flowBytesPerSecond.title}
          data={[normal.flowBytesPerSecond ?? 0, attack.flowBytesPerSecond ?? 0]}
          categories={["Normal", "Attack"]}
          yAxisName="Mean Flow Bytes/s (logscale - bytes)"
          enableZoom={false}
          enableSorting={false}
          withBorder={false}
          height={500}
        />
      ),
      accordionTitle: "What is Mean Flow Bytes Per Second?",
      description: FeatureDescriptionMap.flowBytesPerSecond.description,
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
          title={FeatureDescriptionMap.bwdIATMean.title}
          data={[normal.bwdIATMean ?? 0, attack.bwdIATMean ?? 0]}
          categories={["Normal", "Attack"]}
          yAxisName="Mean Backward Inter-Arrival Time (seconds)"
          enableZoom={false}
          enableSorting={false}
          withBorder={false}
          height={500}
        />
      ),
      accordionTitle: "What is Mean Backward Inter-Arrival Time?",
      description: FeatureDescriptionMap.bwdIATMean.description,
    },
  ];

  return <AttackSpecificVisualizationTemplate blocks={blocks} />;
}