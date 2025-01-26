"use client";

import React from "react";
import ReactECharts from "echarts-for-react";

interface FTPBoxPlotProps {
  chartTitle: string;
  yAxisName: string;
  groups: {
    name: string;
    data: number[];
    color?: string;
  }[];
}

export default function FTPBoxPlot({
  chartTitle,
  yAxisName,
  groups,
}: FTPBoxPlotProps) {
  // Ensure there is at least one group item
  if (!groups || groups.length === 0) {
    throw new Error("The 'groups' prop must contain at least one group.");
  }

  // Extract group names and combine group data into a single array for boxplot transformation
  const groupNames = groups.map((group) => group.name);
  const combinedData = groups.map((group) => group.data);

  const options = {
    title: {
      text: chartTitle,
      left: "center",
    },
    tooltip: {
      trigger: "item",
      axisPointer: {
        type: "shadow",
      },
    },
    dataset: [
      {
        // Format the combined data into a single array for boxplot transformation
        source: combinedData,
      },
      {
        // Transform the dataset into a boxplot
        transform: {
          type: "boxplot",
          config: {
            itemNameFormatter: function (params: any) {
              return groupNames[params.value];
            },
          },
        },
      },
      {
        // Identify outliers from the boxplot transformation
        fromDatasetIndex: 1,
        fromTransformResult: 1,
      },
    ],
    xAxis: {
      type: "category",
      boundaryGap: true,
      nameGap: 30,
      splitArea: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: "value",
      name: yAxisName,
      scale: true,
      splitArea: {
        show: true,
      },
    },
    series: [
      {
        name: "boxplot",
        type: "boxplot",
        datasetIndex: 1,
        itemStyle: {
          color: (params: any) => {
            // Get color from group data or use default
            return groups[params.dataIndex]?.color || "#1976d2";
          },
          borderColor: (params: any) => {
            // Use slightly darker version of the fill color
            return groups[params.dataIndex]?.color || "#004ba0";
          },
          borderWidth: 2,
        },
      },
      {
        name: "outlier",
        type: "scatter",
        datasetIndex: 2,
      },
    ],
  };

  console.log("Chart Data:", combinedData);

  return (
    <div className="flex-1">
      <ReactECharts option={options} />
    </div>
  );
}
