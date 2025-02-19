"use client";

import React from "react";
import ReactECharts from "echarts-for-react";

type PieChartProps = {
  title: string;
  data: { value: number; name: string }[];
  showFrequency?: boolean; // New prop to toggle frequency display
};

export default function PieChart({
  title,
  data,
  showFrequency = false,
}: PieChartProps) {
  const options = {
    tooltip: {
      trigger: "item",
      formatter: showFrequency
        ? "<b>Class: {b}</b><br/>Frequency: {c} <br/>Percentage: {d}%"
        : "<b>Class: {b}</b><br/>Percentage: {d}%",
    },
    legend: {
      left: "center",
      top: "1%",
    },
    series: [
      {
        name: "Protocol Type",
        type: "pie",
        radius: ["30%", "70%"],
        center: ["50%", "56%"], // Moves the chart down
        avoidLabelOverlap: false,
        label: {
          show: true,
          formatter: showFrequency
            ? "{b}: {c} (Freq), {d}% (Perc)"
            : "{b}: {d}%",
          position: "outside",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: "bold",
            formatter: showFrequency
              ? "{b}: {c} (Freq), {d}% (Perc)"
              : "{b}: {d}%",
          },
        },
        labelLine: {
          show: true,
        },
        data: data,
      },
    ],
  };

  return (
    <div className="bg-white p-8 py-4 rounded-lg shadow-md h-full">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <ReactECharts
        option={options}
        style={{ height: "calc(100% - 2rem)" }}
      />
    </div>
  );
}
