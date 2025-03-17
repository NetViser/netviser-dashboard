"use client";

import React from "react";
import ReactECharts from "echarts-for-react";

type PieChartProps = {
  title: string;
  data: { value: number; name: string }[];
  showFrequency?: boolean; // Toggle frequency display
  classLabel?: string; // New prop to customize the term "Class"
};

export default function PieChart({
  title,
  data,
  showFrequency = false,
  classLabel = "Class", // Default to "Class" if not provided
}: PieChartProps) {
  // Determine if we have a large number of items to adjust layout
  const isLargeDataset = data.length > 10;

  const options = {
    tooltip: {
      trigger: "item",
      formatter: showFrequency
        ? `<b>${classLabel}: {b}</b><br/>Frequency: {c} <br/>Percentage: {d}%`
        : `<b>${classLabel}: {b}</b><br/>Percentage: {d}%`,
    },
    legend: {
      type: "scroll", // Enable scrollable legend
      orient: isLargeDataset ? "vertical" : "horizontal", // Vertical for large datasets, horizontal otherwise
      left: isLargeDataset ? "right" : "center", // Right for large datasets, center otherwise
      top: isLargeDataset ? "middle" : "1%", // Middle for vertical, top for horizontal
      height: isLargeDataset ? "80%" : "auto", // Limit height for vertical scroll
      pageButtonPosition: "end", // Position scroll buttons at the end
      pageTextStyle: {
        color: "#333", // Ensure scroll text is readable
      },
    },
    series: [
      {
        name: "Protocol Type",
        type: "pie",
        radius: isLargeDataset ? ["20%", "50%"] : ["30%", "70%"], // Smaller radius for large datasets
        center: ["50%", "56%"], // Keep centered vertically
        avoidLabelOverlap: true, // Enable overlap avoidance
        label: {
          show: true,
          formatter: showFrequency
            ? `{b}: {c} (Freq), {d}% (Perc)`
            : `{b}: {d}%`, // Keeping this as is, but can include classLabel if needed
          position: "outside",
          overflow: "truncate", // Truncate long labels
          maxWidth: 100, // Limit label width to prevent overlap
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: "bold",
            formatter: showFrequency
              ? `{b}: {c} (Freq), {d}% (Perc)`
              : `{b}: {d}%`, // Keeping this as is, but can include classLabel if needed
          },
        },
        labelLine: {
          show: true,
          length: 15, // Adjust line length for better spacing
          length2: 10,
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