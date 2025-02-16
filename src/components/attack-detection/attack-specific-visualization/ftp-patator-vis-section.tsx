"use client";

import BarChart from "@/components/chart/BarChart";
import FTPSankey from "@/components/chart/ftp/sankey";
import { SpecificAttackRecord } from "@/utils/client/fetchAttackDetectionVis";
import { useMemo } from "react";
import { calculateMean } from "@/lib/utils";

type FTPPatatorVisSectionProps = {
  data:
    | {
        normalData: SpecificAttackRecord[];
        attackData: SpecificAttackRecord[];
      }
    | undefined;
};

export function FTPPatatorVisSection({ data }: FTPPatatorVisSectionProps) {
  // --- Prepare data for FTPBoxPlot - Flow Bytes Per Second
  const ftpBarPlotFlowByte = useMemo(() => {
    if (!data) return { categories: [], data: [] };

    const { normalData, attackData } = data;

    const normalFlowByteValues = normalData.map((r) => r.flowBytesPerSecond);
    const attackFlowByteValues = attackData.map((r) => r.flowBytesPerSecond);

    const normalMean = parseFloat(
      calculateMean(normalFlowByteValues).toFixed(2)
    );
    const attackMean = parseFloat(
      calculateMean(attackFlowByteValues).toFixed(2)
    );

    return {
      categories: ["Normal", "Attack"],
      data: [normalMean, attackMean],
    };
  }, [data]);

  // --- Sankey Data
  const ftpSankeyData = useMemo(() => {
    if (!data) return { nodes: [], links: [] };

    const { attackData } = data;

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
  }, [data]);

  // --- Bar Plot for Average Packet Size
  const ftpBarPlotAvgPacketSize = useMemo(() => {
    if (!data) {
      return {
        categories: [],
        data: [],
      };
    }

    const { normalData, attackData } = data;
    const normalAvgPacket = normalData.map((r) => r.averagePacketSize);
    const attackAvgPacket = attackData.map((r) => r.averagePacketSize);

    const normalMean = parseFloat(calculateMean(normalAvgPacket).toFixed(2));
    const attackMean = parseFloat(calculateMean(attackAvgPacket).toFixed(2));

    return {
      categories: ["Normal", "Attack"],
      data: [normalMean, attackMean],
    };
  }, [data]);

  // --- Bar Plot for Flow Duration
  const ftpBarplotFlowDuration = useMemo(() => {
    if (!data) return { categories: [], data: [] };

    const { normalData, attackData } = data;
    const normalFlowDuration = normalData.map((r) => r.flowDuration);
    const attackFlowDuration = attackData.map((r) => r.flowDuration);

    const normalMean = parseFloat(calculateMean(normalFlowDuration).toFixed(2));
    const attackMean = parseFloat(calculateMean(attackFlowDuration).toFixed(2));

    return {
      categories: ["Normal", "Attack"],
      data: [normalMean, attackMean],
    };
  }, [data]);

  if (!data) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* BarPlot - Flow Bytes */}
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
        <BarChart
          title="Average Flow Bytes Per Second"
          data={ftpBarPlotFlowByte.data}
          categories={ftpBarPlotFlowByte.categories}
          yAxisName="Mean Flow Bytes/s"
          enableZoom={false}
          enableSorting={false}
        />
      </div>

      {/* Sankey */}
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
        <FTPSankey data={ftpSankeyData} />
      </div>

      {/* BarPlot - Average Packet Size */}
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
        <BarChart
          title="Average Packet Size"
          data={ftpBarPlotAvgPacketSize.data}
          categories={ftpBarPlotAvgPacketSize.categories}
          yAxisName="Mean Packet Size"
          enableZoom={false}
          enableSorting={false}
        />
      </div>

      {/* BarPlot - Flow Duration */}
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
        <BarChart
          title="Average Flow Duration"
          data={ftpBarplotFlowDuration.data}
          categories={ftpBarplotFlowDuration.categories}
          yAxisName="Mean Flow Duration"
          enableZoom={false}
          enableSorting={false}
        />
      </div>
    </div>
  );
}
