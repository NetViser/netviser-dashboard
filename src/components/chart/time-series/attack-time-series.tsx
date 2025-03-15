"use client";

import React, { useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { Switch } from "@/components/ui/switch";
import {
  DataSchema,
  HighlightItem,
} from "@/utils/client/fetchAttackDetectionTimeSeries";
import { name } from "plotly.js/lib/scatter";

type AttackTimeSeriesChartProps = {
  attackType: string;
  data: DataSchema; // main data from your endpoint
  highlight?: HighlightItem[][]; // optional highlight intervals
  /**
   * When set to false, the filter toggles for port-specific events will be hidden.
   * Defaults to false.
   */
  enablePortFilters?: boolean;
};

export default function AttackTimeSeriesChart({
  attackType,
  data,
  highlight,
  enablePortFilters = false,
}: AttackTimeSeriesChartProps) {
  // Local state to control whether to filter by Port 20, 21, or 22 events
  const [filterPort20, setFilterPort20] = useState<boolean>(false);
  const [filterPort21, setFilterPort21] = useState<boolean>(false);
  const [filterPort22, setFilterPort22] = useState<boolean>(false);

  const isFTP = attackType === "FTP-Patator";
  const isSSH = attackType === "SSH-Patator";

  // Check if port mark points are available
  const hasPort20Events = data.port20MarkPoint && data.port20MarkPoint?.length > 0;
  const hasPort21Events = data.port21MarkPoint && data.port21MarkPoint?.length > 0;
  const hasPort22Events = data.port22MarkPoint && data.port22MarkPoint?.length > 0;

  const option = useMemo(() => {
    // Build the main series data from timestamps and values
    const mainSeriesData = data.timestamps.map((ts, idx) => [ts, data.values[idx]]);

    // Filter main series data if a port filter is active and events exist.
    let filteredMainSeriesData = mainSeriesData;
    if (filterPort20 && hasPort20Events) {
      filteredMainSeriesData = mainSeriesData.filter(([ts]) =>
        data.port20MarkPoint!.some(([portTs]) => portTs === ts)
      );
    } else if (filterPort21 && hasPort21Events) {
      filteredMainSeriesData = mainSeriesData.filter(([ts]) =>
        data.port21MarkPoint!.some(([portTs]) => portTs === ts)
      );
    } else if (filterPort22 && hasPort22Events) {
      filteredMainSeriesData = mainSeriesData.filter(([ts]) =>
        data.port22MarkPoint!.some(([portTs]) => portTs === ts)
      );
    }

    // Build mark areas for attack intervals for the given attackType and for "otherAttack"
    const markAreaAttackData =
      highlight
        ?.filter(([start]) => start.name === attackType)
        .map(([start, end]) => [
          { xAxis: start.xAxis, name: start.name },
          { xAxis: end.xAxis },
        ]) ?? [];

    const markAreaOtherData =
      highlight
        ?.filter(([start]) => start.name === "otherAttack")
        .map(([start, end]) => [
          { xAxis: start.xAxis, name: start.name },
          { xAxis: end.xAxis },
        ]) ?? [];

    return {
      title: {
        text:
          filterPort20 && isFTP && hasPort20Events
            ? `Port 20 Events: ${attackType}`
            : filterPort21 && isFTP && hasPort21Events
            ? `Port 21 Events: ${attackType}`
            : filterPort22 && isSSH && hasPort22Events
            ? `Port 22 Events: ${attackType}`
            : `Time Series: ${attackType}`,
        left: "center",
      },
      tooltip: { trigger: "axis" },
      xAxis: { type: "time", boundaryGap: false },
      yAxis: { type: "value", name: `${data.feature} (${data.feature_unit})`, nameLocation: "center", nameGap: 100 },
      dataZoom: [
        { type: "inside", start: 0, end: 100 },
        { type: "slider", start: 0, end: 100 },
      ],
      series: [
        // Main line series (filtered if needed)
        {
          name: data.feature || "Main Series",
          type: "line",
          showSymbol: false,
          data: filteredMainSeriesData,
          itemStyle: { color: "rgb(2,153,105)" },
        },
        // Attack Markers
        {
          name: "Attack Markers",
          type: "scatter",
          data: data.attackMarkPoint,
          symbolSize: 8,
          itemStyle: { color: "red" },
          z: 10,
          markArea: markAreaAttackData.length
            ? {
                itemStyle: { color: "rgba(255, 173, 177, 0.4)" },
                data: markAreaAttackData,
              }
            : undefined,
        },
        // Other Attack Markers
        {
          name: "Other Attacks",
          type: "scatter",
          data: data.otherAttackMarkPoint,
          symbolSize: 8,
          itemStyle: { color: "orange" },
          z: 10,
          markArea: markAreaOtherData.length
            ? {
                itemStyle: { color: "rgba(255, 165, 0, 0.3)" },
                data: markAreaOtherData,
              }
            : undefined,
        },
      ],
    };
  }, [
    attackType,
    data,
    highlight,
    filterPort20,
    filterPort21,
    filterPort22,
    isFTP,
    isSSH,
    hasPort20Events,
    hasPort21Events,
    hasPort22Events,
  ]);

  return (
    <div className="w-full">
      {enablePortFilters && (isFTP || isSSH) && (
        <div className="flex items-center justify-end mb-4 space-x-6">
          {isFTP && (
            <>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-800">
                  Show only Port 20 events
                </span>
                <Switch
                  checked={filterPort20}
                  onCheckedChange={(checked) => {
                    setFilterPort20(checked);
                    if (checked) {
                      setFilterPort21(false);
                      setFilterPort22(false);
                    }
                  }}
                  disabled={!hasPort20Events}
                />
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-800">
                  Show only Port 21 events
                </span>
                <Switch
                  checked={filterPort21}
                  onCheckedChange={(checked) => {
                    setFilterPort21(checked);
                    if (checked) {
                      setFilterPort20(false);
                      setFilterPort22(false);
                    }
                  }}
                  disabled={!hasPort21Events}
                />
              </div>
            </>
          )}
          {isSSH && (
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-800">
                Show only Port 22 events
              </span>
              <Switch
                checked={filterPort22}
                onCheckedChange={(checked) => {
                  setFilterPort22(checked);
                  if (checked) {
                    setFilterPort20(false);
                    setFilterPort21(false);
                  }
                }}
                disabled={!hasPort22Events}
              />
            </div>
          )}
        </div>
      )}
      <ReactECharts
        option={option}
        echarts={echarts}
        style={{ height: "500px", width: "100%" }}
      />
    </div>
  );
}
