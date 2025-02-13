"use client";

import { useMemo, useState } from "react";
import FTPBoxPlot from "@/components/chart/ftp/boxplot";
import FTPSankey from "@/components/chart/ftp/sankey";
import FTPScatterChart from "@/components/chart/ftp/scatter";
import { SpecificAttackRecord } from "@/utils/client/fetchAttackDetectionVis";
import { Tabs, Tab } from "@/components/ui/tabs/tabs";
import AttackDetectionTimeSeries from "@/components/attack-detection/time-series/AttackDetectionTimeSeries";

type AttackVisualizationsSectionProps = {
  attackVisualizations:
    | {
        normalData: SpecificAttackRecord[];
        attackData: SpecificAttackRecord[];
      }
    | undefined;
};

export function AttackVisualizationsSection({
  attackVisualizations,
}: AttackVisualizationsSectionProps) {
  const [activeTab, setActiveTab] = useState("overall");

  // --- Prepare data for FTPBoxPlot - Flow Bytes Per Second
  const ftpBoxPlotFlowBytesPerSecondData = useMemo(() => {
    if (!attackVisualizations) return [];

    const { normalData, attackData } = attackVisualizations;
    const normalFlowBytes = normalData.map((r) => r.flowBytesPerSecond);
    const attackFlowBytes = attackData.map((r) => r.flowBytesPerSecond);

    return [
      {
        name: "Normal",
        data: normalFlowBytes,
        color: "#4CAF50",
      },
      {
        name: "Attack",
        data: attackFlowBytes,
        color: "#F44336",
      },
    ];
  }, [attackVisualizations]);

  // --- Sankey Data
  const ftpSankeyData = useMemo(() => {
    if (!attackVisualizations) return { nodes: [], links: [] };

    const { attackData } = attackVisualizations;

    const nodes = Array.from(
      new Set(
        attackData.flatMap((record) => [
          String(record.srcPort),
          String(record.dstPort),
          String(record.srcIp),
        ])
      )
    ).map((name) => ({ name }));

    const srcIpLinks = attackData.map((record) => ({
      source: String(record.srcIp),
      target: String(record.srcPort),
      value: record.srcIpPortPairCount,
    }));

    const portLinks = attackData.map((record) => ({
      source: String(record.srcPort),
      target: String(record.dstPort),
      value: record.portPairCount,
    }));

    return {
      nodes,
      links: [...srcIpLinks, ...portLinks],
    };
  }, [attackVisualizations]);

  // --- Scatter Data
  const ftpScatterData = useMemo(() => {
    if (!attackVisualizations) {
      return {
        normalData: [],
        attackData: [],
      };
    }

    const { normalData, attackData } = attackVisualizations;
    const normalAvgPacket = normalData.map((r) => r.averagePacketSize);
    const attackAvgPacket = attackData.map((r) => r.averagePacketSize);

    return {
      normalData: normalAvgPacket,
      attackData: attackAvgPacket,
    };
  }, [attackVisualizations]);

  // --- Boxplot for Flow Duration
  const ftpBoxplotFlowDuration = useMemo(() => {
    if (!attackVisualizations) return [];

    const { normalData, attackData } = attackVisualizations;
    const normalFlowDuration = normalData.map((r) => r.flowDuration);
    const attackFlowDuration = attackData.map((r) => r.flowDuration);

    return [
      {
        name: "Normal",
        data: normalFlowDuration,
        color: "#4CAF50",
      },
      {
        name: "Attack",
        data: attackFlowDuration,
        color: "#F44336",
      },
    ];
  }, [attackVisualizations]);

  if (!attackVisualizations) return null;

  return (
    <div className="w-full rounded-lg shadow-sm bg-white p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">Attack Specific Visualizations</h2>

      {/* Tabs */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab}>
        <Tab tab="overall" label="Overall">
          <div className="grid grid-cols-2 gap-4">
            {/* BoxPlot - Flow Bytes */}
            <div className="p-6 rounded-lg border-2 flex flex-col">
              <FTPBoxPlot
                chartTitle="Distribution of Flow Bytes Per Second (Normal vs Attack)"
                yAxisName="Flow Bytes Per Second"
                groups={ftpBoxPlotFlowBytesPerSecondData}
              />
            </div>

            {/* Sankey */}
            <div className="bg-white p-6 rounded-lg border-2 shadow-sm flex flex-col">
              <FTPSankey data={ftpSankeyData} />
            </div>

            {/* Scatter - Average Packet Size */}
            <div className="bg-white p-6 rounded-lg border-2 shadow-sm flex flex-col">
              <h3 className="font-semibold mb-2">Average Packet Size</h3>
              <FTPScatterChart
                normalData={ftpScatterData.normalData}
                attackData={ftpScatterData.attackData}
              />
            </div>

            {/* BoxPlot - Flow Duration */}
            <div className="bg-white p-6 rounded-lg border-2 shadow-sm flex flex-col">
              <h3 className="font-semibold mb-2">Flow Duration</h3>
              <FTPBoxPlot
                chartTitle="Distribution of Flow Duration (Normal vs Attack)"
                yAxisName="Flow Duration"
                groups={ftpBoxplotFlowDuration}
              />
            </div>
          </div>
        </Tab>
        <Tab tab="timeseries" label="Time Series">
          <AttackDetectionTimeSeries />
        </Tab>
      </Tabs>
    </div>
  );
}
