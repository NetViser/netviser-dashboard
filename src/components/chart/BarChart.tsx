"use client";

import React from "react";
import ReactECharts from "echarts-for-react";

type BarChartProps = {
  title: string;
  data: number[];
  categories: string[];
  yAxisName?: string;
  xAxisName?: string;
  enableZoom?: boolean;
  enableSorting?: boolean;
  xLabelNameLocation?: "start" | "middle" | "end";
  xAxisNameGap?: number;
  withBorder?: boolean;
  height?: number;
};

export default function BarChart({
  title,
  data,
  categories,
  yAxisName: y = "Frequency",
  xAxisName: x = "Categories",
  xLabelNameLocation = "middle",
  xAxisNameGap = 20,
  enableZoom = true,
  enableSorting = true,
  withBorder = false,
  height = 400,
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

  const dataZoomOption = enableZoom
    ? [
        { type: "slider", start: 0, end: 10 },
        { type: "inside", start: 0, end: 10 },
      ]
    : [];

  const options = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params: any) => {
        const param = params[0];
        return `<div style="padding:8px;">
                  <div style="font-weight:bold;">${param.name}</div>
                  <div>${y}: ${param.value}</div>
                </div>`;
      },
      backgroundColor: "#fff",
      borderColor: "#ccc",
      borderWidth: 1,
      textStyle: { color: "#333" },
    },
    grid: { top: "12%", left: "1%", right: "3%", containLabel: true },
    xAxis: {
      type: "category",
      data: sortedCategories,
      name: x,
      nameLocation: xLabelNameLocation,
      nameGap: xAxisNameGap,
      axisLabel: { interval: 0, rotate: 30 },
    },
    yAxis: {
      type: "value",
      name: y,
      nameGap: 20,
      nameTextStyle: { align: "left" },
    },
    dataZoom: dataZoomOption,
    series: [
      {
        data: sortedValues,
        type: "bar",
        itemStyle: { color: "#f97316" },
      },
    ],
  };

  if (withBorder) {
    return (
      <div className="bg-white p-8 py-4 rounded-lg shadow-md w-full h-full">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <ReactECharts option={options} style={{ height: height }} />
      </div>
    );
  }

  return (
    <div className="px-8 py-4 w-full h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="flex-1">
        <ReactECharts option={options} style={{ height: height }} />
      </div>
    </div>
  );
}
