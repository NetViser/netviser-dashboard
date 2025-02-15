"use client";

import { useMemo, useState } from "react";
import FTPSankey from "@/components/chart/ftp/sankey";
import BarChart from "@/components/chart/BarChart";
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
  const ftpBarPlotFlowByte = useMemo(() => {
    if (!attackVisualizations) return { categories: [], data: [] };
  
    const { normalData, attackData } = attackVisualizations;
  
    const normalFlowByteValues = normalData.map((r) => r.flowBytesPerSecond);
    const attackFlowByteValues = attackData.map((r) => r.flowBytesPerSecond);
  
    const calculateMean = (values: number[]) =>
      values.reduce((sum, value) => sum + value, 0) / values.length;
  
    const normalMean = parseFloat(calculateMean(normalFlowByteValues).toFixed(2));
    const attackMean = parseFloat(calculateMean(attackFlowByteValues).toFixed(2));
  
    return {
      categories: ["Normal", "Attack"],
      data: [normalMean, attackMean],
    };
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
  const ftpBarPlotAvgPacketSize = useMemo(() => {
    if (!attackVisualizations) {
      return {
        categories: [],
        data: [],
      };
    }

    const { normalData, attackData } = attackVisualizations;
    const normalAvgPacket = normalData.map((r) => r.averagePacketSize);
    const attackAvgPacket = attackData.map((r) => r.averagePacketSize);

    const calculateMean = (values: number[]) =>
      values.reduce((sum, value) => sum + value, 0) / values.length;
  
    const normalMean = parseFloat(calculateMean(normalAvgPacket).toFixed(2));
    const attackMean = parseFloat(calculateMean(attackAvgPacket).toFixed(2));

    return {
      categories: ["Normal", "Attack"],
      data: [normalMean, attackMean],
    };
  }, [attackVisualizations]);

  // --- Boxplot for Flow Duration
  const ftpBarplotFlowDuration = useMemo(() => {
    if (!attackVisualizations) return { categories: [], data: [] };

    const { normalData, attackData } = attackVisualizations;
    const normalFlowDuration = normalData.map((r) => r.flowDuration);
    const attackFlowDuration = attackData.map((r) => r.flowDuration);

    const calculateMean = (values: number[]) =>
      values.reduce((sum, value) => sum + value, 0) / values.length;
  
    const normalMean = parseFloat(calculateMean(normalFlowDuration).toFixed(2));
    const attackMean = parseFloat(calculateMean(attackFlowDuration).toFixed(2));

    return {
      categories: ["Normal", "Attack"],
      data: [normalMean, attackMean],
    }
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
            <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
              <BarChart title = "Average Flow Bytes Per Second"
                data={ftpBarPlotFlowByte.data}
                categories={ftpBarPlotFlowByte.categories}
                yAxisName="Mean Flow Bytes/s"

                enableZoom={false}
                enableSorting={false}>
              </BarChart>
            </div>

            {/* Sankey */}
            <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
              <FTPSankey data={ftpSankeyData} />
            </div>

            {/* Scatter - Average Packet Size */}
            <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
              <BarChart title = "Average Packet Size"
                data={ftpBarPlotAvgPacketSize.data}
                categories={ftpBarPlotAvgPacketSize.categories}
                yAxisName="Mean Packet Size"
                enableZoom={false}
                enableSorting={false}>
              </BarChart>
            </div>

            {/* BoxPlot - Flow Duration */}
            <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
              <BarChart title = "Average Flow Duration"
                data={ftpBarplotFlowDuration.data}
                categories={ftpBarplotFlowDuration.categories}
                yAxisName="Mean Flow Duration"
                enableZoom={false}
                enableSorting={false}>
              </BarChart>
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
