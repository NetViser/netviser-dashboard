"use client";

import React from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from 'echarts';

type BarChartProps = {
  title: string;
  data: number[];
  categories: string[];
  yAxisName?: string;
  enableZoom?: boolean; // New prop to control zooming functionality
  enableSorting?: boolean; // New prop to control sorting functionality
};

export default function BarChart({
  title,
  data,
  categories,
  yAxisName: y = "Frequency",
  enableZoom = true, // Default to true if not provided
  enableSorting = true, // Default to true if not provided
}: BarChartProps) {
  const { sortedValues, sortedCategories } = enableSorting
    ? data
        .map((value, index) => ({ value, category: categories[index] }))
        .sort((a, b) => b.value - a.value)
        .reduce(
          (acc, item) => {
            acc.sortedValues.push(item.value);
            acc.sortedCategories.push(item.category);
            return acc;
          },
          { sortedValues: [] as number[], sortedCategories: [] as string[] }
        )
    : {
        sortedValues: data,
        sortedCategories: categories,
      };

  // Conditional dataZoom based on enableZoom prop
  const dataZoomOption = enableZoom
    ? [
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
      ]
    : [];

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
      containLabel: true,
    },
    xAxis: {
      type: "category", // Categories appear on the x-axis for vertical orientation
      data: sortedCategories,
    },
    yAxis: {
      type: "value", // Values appear on the y-axis for vertical orientation
      name: y,
    },
    dataZoom: dataZoomOption, // Apply conditional zoom
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
