"use client";

import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import {
  DataSchema,
  HighlightItem,
} from "@/utils/client/fetchAttackDetectionTimeSeries";

type AttackTimeSeriesChartProps = {
  attackType: string;
  data: DataSchema;          // main data from your endpoint
  highlight?: HighlightItem[][]; // optional highlight intervals
};

export default function AttackTimeSeriesChart({
  attackType,
  data,
  highlight,
}: AttackTimeSeriesChartProps) {
  /**
   * Build the ECharts option using `useMemo` for performance.
   */
  const option = useMemo(() => {
    // 1. Convert timestamps & values into [timestamp, value] for the main line
    const mainSeriesData = data.timestamps.map((ts, idx) => [ts, data.values[idx]]);

    // 2. Attack / Other points (already [ts, val])
    const attackPoints = data.attackMarkPoint; // red scatter
    const otherPoints = data.otherAttackMarkPoint; // orange scatter

    // 3. For highlight intervals, we produce two arrays:
    //    - markAreaAttackData => intervals where start.name == attackType
    //    - markAreaOtherData  => intervals where start.name == 'otherAttack'
    //      (If you store different strings for "other" intervals, adjust accordingly.)
    const markAreaAttackData =
      highlight
        ?.filter(([start]) => start.name === attackType)
        .map(([start, end]) => [
          { xAxis: start.xAxis, name: start.name },
          { xAxis: end.xAxis }
        ]) ?? [];

    const markAreaOtherData =
      highlight
        ?.filter(([start]) => start.name === "otherAttack")
        .map(([start, end]) => [
          { xAxis: start.xAxis, name: start.name },
          { xAxis: end.xAxis }
        ]) ?? [];

    return {
      title: {
        text: `Time Series: ${attackType}`,
        left: "center",
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "time",
        boundaryGap: false,
      },
      yAxis: {
        type: "value",
        name: data.feature,
      },
      dataZoom: [
        {
          type: "inside",
          start: 0,
          end: 100,
        },
        {
          type: "slider",
          start: 0,
          end: 100,
        },
      ],
      series: [
        // Main line series
        {
          name: data.feature || "Main Series",
          type: "line",
          showSymbol: false,
          data: mainSeriesData,
          itemStyle: {
            color: "rgb(2,153,105)",
          },
        },
        // Attack Markers (red scatter), plus its intervals
        {
          name: "Attack Markers",
          type: "scatter",
          data: attackPoints,
          symbolSize: 8,
          itemStyle: {
            color: "red",
          },
          z: 10,
          markArea: markAreaAttackData.length
            ? {
                itemStyle: {
                  // Light red highlight
                  color: "rgba(255, 173, 177, 0.4)",
                },
                data: markAreaAttackData,
              }
            : undefined,
        },
        // Other Attacks (orange scatter), plus its intervals
        {
          name: "Other Attacks",
          type: "scatter",
          data: otherPoints,
          symbolSize: 8,
          itemStyle: {
            color: "orange",
          },
          z: 10,
          markArea: markAreaOtherData.length
            ? {
                itemStyle: {
                  // Orange highlight
                  color: "rgba(255, 165, 0, 0.3)",
                },
                data: markAreaOtherData,
              }
            : undefined,
        },
      ],
    };
  }, [attackType, data, highlight]);

  return (
    <div className="w-full h-[600px]">
      <ReactECharts
        option={option}
        echarts={echarts}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
}
