"use client";

import React from "react";
import ReactECharts from "echarts-for-react";

type BarChartProps = {
  title: string;
  data: number[];
  categories: string[];
};

export default function BarChart({
  title,
  data,
  categories,
}: BarChartProps) {
  // Sort data and categories together based on data values
  const sortedData = [...data]
    .map((value, index) => ({ value, category: categories[index] }))
    .sort((a, b) => b.value - a.value);

  const sortedValues = sortedData.map((item) => item.value);
  const sortedCategories = sortedData.map((item) => item.category);

  const options = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow", // Highlight the bar when hovering
      },
    },
    grid: { top: 8, right: 16, bottom: 24, left: 36 },
    xAxis: {
      type: "category", // Categories appear on the x-axis for vertical orientation
      data: sortedCategories,
    },
    yAxis: {
      type: "value", // Values appear on the y-axis for vertical orientation
    },
    series: [
      {
        data: sortedValues,
        type: "bar",
        itemStyle: {
          color: "#f97316", // Set bar color to orange
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
