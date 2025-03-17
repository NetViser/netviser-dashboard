"use client";

import BarChart from "@/components/chart/BarChart";
import FTPSankey from "@/components/chart/ftp/sankey";
import { FetchSpecificAttackResponse } from "@/utils/client/fetchAttackDetectionOverview";
import { AttackVisTemplate } from "./template/AttackVisTemplate"; // Adjust the import path as needed
import { FeatureDescriptionMap } from "@/utils/vis_descriptions"; // Import the feature map

type DosHulkVisSectionProps = {
  data: FetchSpecificAttackResponse | undefined;
};

export function DosHulkVisSection({ data }: DosHulkVisSectionProps) {
  if (!data) return null;

  const { means, sankeyData, uniqueDstPorts } = data;
  const { normal, attack } = means;

  // Define the blocks for the AttackVisTemplate using FeatureDescriptionMap
  const blocks = [
    {
      component: (
        <BarChart
          title={FeatureDescriptionMap.bwdpacketlengthstd.title}
          data={[normal.bwdpacketlengthstd ?? 0, attack.bwdpacketlengthstd ?? 0]}
          categories={["Normal", "Attack"]}
          yAxisName="Mean Bwd Packet Length Std (bytes)"
          enableZoom={false}
          enableSorting={false}
          withBorder={false}
          height={500}
        />
      ),
      accordionTitle: "What is Mean Bwd Packet Length Std?",
      description: FeatureDescriptionMap.bwdpacketlengthstd.description,
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
          title={FeatureDescriptionMap.fwdPacketLengthMax.title}
          data={[normal.fwdPacketLengthMax ?? 0, attack.fwdPacketLengthMax ?? 0]}
          categories={["Normal", "Attack"]}
          yAxisName="Mean Fwd Packet Length Max (bytes)"
          enableZoom={false}
          enableSorting={false}
          withBorder={false}
          height={500}
        />
      ),
      accordionTitle: "What is Mean Fwd Packet Length Max?",
      description: FeatureDescriptionMap.fwdPacketLengthMax.description,
    },
  ];

  return <AttackVisTemplate blocks={blocks} />;
}