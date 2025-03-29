"use client";

import BarChart from "@/components/chart/BarChart";
import SankeyChart from "@/components/chart/ftp/sankey";
import AttackSpecificVisualizationTemplate from "./AttackSpecificVisualizationTemplate";
import { FeatureDescriptionMap } from "@/utils/specificVisualizationDescriptions";
import { SpecificAttackVisualizationSectionProps } from "../types/index.types";

export function DoSSlowlorisVisSection({ data }: SpecificAttackVisualizationSectionProps) {
  if (!data) return null;

  const { means, sankeyData } = data;
  const { normal, attack } = means;

  // Define the blocks for the AttackVisTemplate using FeatureDescriptionMap
  const blocks = [
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
          title={FeatureDescriptionMap.fwdPSHFlags.title}
          data={[normal.fwdPSHFlags ?? 0, attack.fwdPSHFlags ?? 0]}
          categories={["Normal", "Attack"]}
          yAxisName="Mean Forward PSH Flags (count)"
          enableZoom={false}
          enableSorting={false}
          withBorder={false}
          height={500}
        />
      ),
      accordionTitle: "What is Forward PSH Flags Mean?",
      description: FeatureDescriptionMap.fwdPSHFlags.description,
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
      accordionTitle: "What is Backward Inter-Arrival Time Mean?",
      description: FeatureDescriptionMap.bwdIATMean.description,
    },
  ];

  return <AttackSpecificVisualizationTemplate blocks={blocks} />;
}