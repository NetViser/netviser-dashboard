"use client";
import React from "react";
import ReactECharts from "echarts-for-react";
import { BarSummaryItem } from "@/utils/client/fetchAttackSummaryXAI";
import { FaExpandAlt } from "react-icons/fa";

type SummaryBarChartProps = {
  minimal?: boolean;
  attackType: string;
  data: BarSummaryItem[];
  onHelpClick?: () => void;
};

export default function SummaryBarChart({
  minimal = false,
  attackType,
  data,
  onHelpClick,
}: SummaryBarChartProps) {
  // Sort the data based on the mean_abs_shap values in descending order
  const sortedData = [...data].sort(
    (a, b) => b.mean_abs_shap - a.mean_abs_shap
  );
  console.log(sortedData);

  // Construct the dataset source array from the sorted data
  const source = [
    ["feature", "value"],
    ...sortedData.map((item) => [item.feature, item.mean_abs_shap]),
  ];

  // Compute the max value dynamically based on the input data
  const maxValue = Math.max(...sortedData.map((item) => item.mean_abs_shap), 0);
  console.log(maxValue);

  // Calculate initial data zoom range: show only top 5 features
  const totalFeatures = sortedData.length;
  const endPercentage = minimal
    ? 100
    : totalFeatures > 0
    ? (5 / totalFeatures) * 100
    : 100;

  const option = {
    dataset: {
      source: source,
    },
    tooltip: {
      trigger: "item",
      formatter: function (params: any) {
        if (params.value && params.value.length >= 2) {
          return `Feature: ${
            params.value[0]
          }<br/>Mean | SHAP | Value: ${params.value[1].toFixed(4)}`;
        }
        return `Value: ${params.value}`;
      },
    },
    xAxis: {
      name: "Mean Absolute Shap Value",
      nameLocation: "middle",
      nameGap: 30, // Adjust to move the label further down
    },
    yAxis: {
      type: "category",
      name: "Feature",
    },
    dataZoom: [
      {
        type: "slider",
        yAxisIndex: 0,
        start: 0,
        end: endPercentage,
      },
    ],
    legend: {},
    toolbox: {
      show: true,
      feature: {
        dataView: { readOnly: false },
        saveAsImage: {},
      },
    },
    grid: {
      left: "0%",
      right: "10%",
      bottom: "8%",
      containLabel: true,
    },
    series: [
      {
        type: "bar",
        encode: {
          x: "value",
          y: "feature",
        },
        itemStyle: {
          color: "#ff0051",
        },
      },
    ],
  };

  // If minimal is true, return only the chart without header or help icon
  if (minimal) {
    return (
      <div className="w-full h-full p-8 overflow-auto">
        <ReactECharts option={option} style={{ height: 360 }} />
      </div>
    );
  }

  return (
    <div className="p-8 py-4 overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {`Feature Important By Mean |SHAP| Value (${attackType})`}
        </h3>
        {onHelpClick && (
          <FaExpandAlt
            className="w-6 h-6 text-gray-600 cursor-pointer transition transform hover:scale-110 hover:text-orange-500"
            onClick={onHelpClick}
          />
        )}
      </div>
      <ReactECharts option={option} style={{ height: 400 }} />
    </div>
  );
}
