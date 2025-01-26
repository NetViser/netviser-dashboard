"use client";

import React from "react";
import ReactECharts from "echarts-for-react";
import { colors } from "@/app/theme";

type HorizontalBarChartProps = {
  title: string;
  data: number[];
  categories: string[];
};

export default function HorizontalBarChart({
  title,
  data,
  categories,
}: HorizontalBarChartProps) {
  const options = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow", // Highlight the bar when hovering
      },
    },
    grid: {      
      top: '20%',
      left: '1%',
      right: '3%',
      bottom: '4%',
      containLabel: true },
    xAxis: {
      type: "value", // Make this the value axis for horizontal bars
      name: 'Frequency',
      
      nameLocation: 'center',
    },
    yAxis: {
      type: "category", // Categories appear on the y-axis for horizontal orientation
      data: categories,
    },
    series: [
      {
        data: data,
        type: "bar",
        itemStyle: {
          color: "#f97316",
        },
      },
    ],
  };

  return (
    <div className="bg-white p-8 py-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <ReactECharts option={options} />
    </div>
  );
}
