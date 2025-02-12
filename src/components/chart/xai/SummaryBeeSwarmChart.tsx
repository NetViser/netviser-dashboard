"use client";
import React from "react";
import ReactECharts from "echarts-for-react";
import { BeeswarmSummaryItem } from "@/utils/client/fetchAttackSummaryXAI";
import { FaExpandAlt } from "react-icons/fa";

type SummaryBeeSwarmChartProps = {
  withDataZoom?: boolean;
  minimal?: boolean;
  attackType: string;
  data: BeeswarmSummaryItem[];
  onHelpClick?: () => void;
};

export default function SummaryBeeSwarmChart({
  withDataZoom = false,
  minimal = false,
  attackType,
  data,
  onHelpClick,
}: SummaryBeeSwarmChartProps) {
  // Extract unique features from the data.
  const uniqueFeatures = Array.from(new Set(data.map((item) => item.feature)));

  // Compute the average absolute SHAP value per feature for ordering.
  const featureAverages: { [key: string]: number } = {};
  uniqueFeatures.forEach((feature) => {
    const featureData = data.filter((item) => item.feature === feature);
    const avg =
      featureData.reduce((acc, item) => acc + Math.abs(item.shap_value), 0) /
      featureData.length;
    featureAverages[feature] = avg;
  });

  // Order features by average absolute SHAP value (ascending order).
  const sortedFeatures = uniqueFeatures.sort(
    (a, b) => featureAverages[a] - featureAverages[b]
  );

  // Create a mapping from feature to a base y-value (0, 1, 2, ...).
  const featureMapping: { [key: string]: number } = {};
  sortedFeatures.forEach((feature, index) => {
    featureMapping[feature] = index;
  });

  // Prepare series data.
  // Each data point: [shap_value, y_jitter, normalized_feature_value, original_feature_value, feature]
  const seriesData = data.map((item) => [
    item.shap_value,
    item.y_jitter, // ideally computed as featureMapping[item.feature] + jitter
    item.normalized_feature_value,
    item.original_feature_value,
    item.feature,
  ]);

  // Here we use 100% so that all features are initially shown.
  const endPercentage = 100;

  // Conditionally add dataZoom only if withDataZoom is true.
  const dataZoomOption = withDataZoom
    ? [
        {
          type: "slider",
          yAxisIndex: 0,
          orient: "vertical",
          left: "3%",
          start: 0,
          end: endPercentage,
        },
      ]
    : undefined;

  const gridLeft = withDataZoom ? "7%" : "0%";
  const graphicRight = minimal ? "3%" : "6%";

  // Define the ECharts option.
  const option = {
    tooltip: {
      trigger: "item",
      formatter: function (params: any) {
        // params.value = [shap_value, y_jitter, norm, original_feature_value, feature]
        const value = params.value;
        return (
          "Feature: " +
          value[4] +
          "<br/>" +
          "SHAP: " +
          value[0].toFixed(3) +
          "<br/>" +
          "Feature Value: " +
          value[3].toFixed(3)
        );
      },
    },
    xAxis: {
      name: "SHAP Value (Impact on Model Output)",
      nameLocation: "middle", // center the x-axis label
      nameGap: 30,
      type: "value",
    },
    yAxis: {
      type: "category",
      name: "Feature",
      data: sortedFeatures, // using sorted feature names as categories
    },
    dataZoom: dataZoomOption,
    series: [
      {
        type: "scatter",
        symbolSize: 8,
        data: seriesData,
        itemStyle: {
          color: function (params: any) {
            const norm = params.data[2]; // normalized_feature_value in [0,1]
            if (norm <= 0.5) {
              const ratio = norm / 0.5;
              return interpolateColor("#008bfb", "#ab14a6", ratio);
            } else {
              const ratio = (norm - 0.5) / 0.5;
              return interpolateColor("#ab14a6", "#ff0051", ratio);
            }
          },
        },
      },
    ],
    visualMap: {
      show: true,
      calculable: false,
      min: 0,
      max: 1,
      dimension: 2, // normalized_feature_value
      orient: "vertical",
      right: "0%", // control horizontal position (right-aligned)
      top: "20%", // control vertical position (centered)
      text: ["High", "Low"],
      formatter: function (value: number) {
        if (value < 0.33) return "Low";
        if (value < 0.66) return "Medium";
        return "High";
      },
      inRange: {
        color: ["#008bfb", "#ab14a6", "#ff0051"],
      },
    },
    // Add a graphic element to place a small label above "High".
    graphic: [
      {
        type: "text",
        right: graphicRight,
        top: "37%", // vertically centered (adjust as needed)
        rotation: Math.PI / 2, // rotate 90 degrees (in radians)
        style: {
          text: "Feature Value",
          textAlign: "center",
          fill: "#000",
          fontSize: 12,
        },
      },
    ],
    grid: {
      containLabel: true,
      left: gridLeft,
      top: "8%",
      right: "10%",
    },
  };

  // Helper functions for color interpolation.
  function interpolateColor(color1: string, color2: string, factor: number) {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    if (!c1 || !c2) return color1;
    const result = {
      r: Math.round(c1.r + (c2.r - c1.r) * factor),
      g: Math.round(c1.g + (c2.g - c1.g) * factor),
      b: Math.round(c1.b + (c2.b - c1.b) * factor),
    };
    return rgbToHex(result.r, result.g, result.b);
  }

  function hexToRgb(hex: string) {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    const intVal = parseInt(hex, 16);
    return {
      r: (intVal >> 16) & 255,
      g: (intVal >> 8) & 255,
      b: intVal & 255,
    };
  }

  function rgbToHex(r: number, g: number, b: number) {
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  }

  // Render based on the minimal prop.
  if (minimal) {
    return (
      <div className="w-full h-full p-8 overflow-auto">
        <ReactECharts option={option} style={{ height: "400px", width: "100%" }} />
      </div>
    );
  }

  return (
    <div className="p-8 py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {`SHAP Beeswarm Plot (${attackType})`}
        </h3>
        {onHelpClick && (
          <FaExpandAlt
            className="w-6 h-6 text-gray-600 cursor-pointer transition transform hover:scale-110 hover:text-orange-500"
            onClick={onHelpClick}
          />
        )}
      </div>
      <ReactECharts option={option} style={{ height: 400, width: "100%" }} />
    </div>
  );
}
