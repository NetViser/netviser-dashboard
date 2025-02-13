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
      top: "5%",
    },
    series: [
      {
        name: "Protocol Type",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "60%"], // Moves the chart down
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
    <div className="bg-white p-8 py-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <ReactECharts
        style={{ height: "360px", width: "100%" }}
        option={options}
      />
    </div>
  );
}
