"use client";

import React from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from 'echarts';

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
      trigger: "item",
      axisPointer: {
        type: "shadow", // Highlight the bar when hovering
      },
    },
    grid: {      
      top: '12%',
      left: '1%',
      right: '3%',
      containLabel: true },
    xAxis: {
      type: "category", // Categories appear on the x-axis for vertical orientation
      data: sortedCategories,
    },
    yAxis: {
      type: "value", // Values appear on the y-axis for vertical orientation
      name: 'Frequency',
    },
    dataZoom: [
      {
        type: "slider", // Adds a slider at the bottom for horizontal zooming
        start: 0, // Start percentage of the data visible
        end: 10, // End percentage of the data visible
      },
      {
        type: "inside", // Allows zooming via mouse wheel or touch gestures
        start: 0,
        end: 10,
      },
    ],
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
      <ReactECharts option={options} style={{ height: 400 }} />
    </div>
  );
}
