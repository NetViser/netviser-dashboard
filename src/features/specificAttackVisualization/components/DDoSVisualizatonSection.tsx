"use client";

import BarChart from "@/components/chart/BarChart";
import FTPSankey from "@/components/chart/ftp/sankey";
import AttackSpecificVisualizationTemplate from "./AttackSpecificVisualizationTemplate";
import { FeatureDescriptionMap } from "@/utils/specificVisualizationDescriptions";
import { SpecificAttackVisualizationSectionProps } from "../types";

export function DDOSVisSection({ data }: SpecificAttackVisualizationSectionProps) {
  if (!data) return null;

  const { means, sankeyData, uniqueSrcIps } = data;
  const { normal, attack } = means;

  const blocks = [
    {
      component: (
        <BarChart
          title={FeatureDescriptionMap.uniqueSrcIps.title}
          data={[uniqueSrcIps.normal, uniqueSrcIps.attack]}
          categories={["Normal", "Attack"]}
          yAxisName="Unique Source IPs (count)"
          enableZoom={false}
          enableSorting={false}
          withBorder={false}
          height={500}
        />
      ),
      accordionTitle: "What is Unique Source IPs?",
      description: FeatureDescriptionMap.uniqueSrcIps.description,
    },
    {
      component: (
        <BarChart
          title={FeatureDescriptionMap.packetlengthmean.title}
          data={[normal.packetlengthmean ?? 0, attack.packetlengthmean ?? 0]}
          categories={["Normal", "Attack"]}
          yAxisName="Mean Packet Length (bytes)"
          enableZoom={false}
          enableSorting={false}
          withBorder={false}
          height={500}
        />
      ),
      accordionTitle: "What is Average Packet Length?",
      description: FeatureDescriptionMap.packetlengthmean.description,
    },
    {
      component: (
        <FTPSankey
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
          title={FeatureDescriptionMap.bwdpacketlengthstd.title}
          data={[normal.bwdpacketlengthstd ?? 0, attack.bwdpacketlengthstd ?? 0]}
          categories={["Normal", "Attack"]}
          yAxisName="Mean Bwd Packet Length Std (units)"
          enableZoom={false}
          enableSorting={false}
          withBorder={false}
          height={500}
        />
      ),
      accordionTitle: "What is Bwd Packet Length Std?",
      description: FeatureDescriptionMap.bwdpacketlengthstd.description,
    },
  ];

  return <AttackSpecificVisualizationTemplate blocks={blocks} />;
}