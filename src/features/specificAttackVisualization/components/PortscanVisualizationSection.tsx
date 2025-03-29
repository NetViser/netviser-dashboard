"use client";

import BarChart from "@/components/chart/BarChart";
import FTPSankey from "@/components/chart/ftp/sankey";
import AttackSpecificVisualizationTemplate from "./AttackSpecificVisualizationTemplate";
import { FeatureDescriptionMap } from "@/utils/specificVisualizationDescriptions"; // Import the feature map
import { SpecificAttackVisualizationSectionProps } from "../types/index.types";


export function PortscanVisSection({ data }: SpecificAttackVisualizationSectionProps) {
  if (!data) return null;

  const { means, sankeyData, uniqueDstPorts, uniqueSrcPorts } = data; // Assumes backend will provide uniqueSrcPorts
  const { normal, attack } = means;

  // Define the blocks for the AttackVisTemplate using FeatureDescriptionMap
  const blocks = [
    {
      component: (
        <BarChart
          title={FeatureDescriptionMap.uniqueSrcPorts.title}
          data={[uniqueSrcPorts.normal, uniqueSrcPorts.attack]}
          categories={["Normal", "Attack"]}
          yAxisName="Unique Src Port Count (count)"
          enableZoom={false}
          enableSorting={false}
          withBorder={false}
          height={500}
        />
      ),
      accordionTitle: "What is Unique Src Port Count?",
      description: FeatureDescriptionMap.uniqueSrcPorts.description,
    },
    {
      component: (
        <BarChart
          title={FeatureDescriptionMap.uniqueDstPorts.title}
          data={[uniqueDstPorts.normal, uniqueDstPorts.attack]}
          categories={["Normal", "Attack"]}
          yAxisName="Unique Dst Port Count (count)"
          enableZoom={false}
          enableSorting={false}
          withBorder={false}
          height={500}
        />
      ),
      accordionTitle: "What is Unique Dst Port Count?",
      description: FeatureDescriptionMap.uniqueDstPorts.description,
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
          title={FeatureDescriptionMap.totalLengthOfFwdPacket.title}
          data={[normal.totalLengthOfFwdPacket ?? 0, attack.totalLengthOfFwdPacket ?? 0]}
          categories={["Normal", "Attack"]}
          yAxisName="Mean Total Length of Forward Packet (bytes)"
          enableZoom={false}
          enableSorting={false}
          withBorder={false}
          height={500}
        />
      ),
      accordionTitle: "What is Total Length of Forward Packet?",
      description: FeatureDescriptionMap.totalLengthOfFwdPacket.description,
    },
  ];

  return <AttackSpecificVisualizationTemplate blocks={blocks} />;
}