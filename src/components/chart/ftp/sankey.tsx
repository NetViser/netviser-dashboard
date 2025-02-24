"use client";

import React from "react";
import ReactECharts from "echarts-for-react";

// Define the structure of each node and link
export interface SankeyNode {
  name: string;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

// SankeyData now includes a nodeMapping field
export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
  // Maps each node name to its type, e.g., "Source IP", "Source Port", or "Dst Port"
  nodeMapping: Record<string, "Source IP" | "Source Port" | "Dst Port">;
}

interface SankeyChartProps {
  data: SankeyData;
  title?: string;
}

const SankeyChart: React.FC<SankeyChartProps> = ({ data, title = "Sankey Diagram" }) => {
  const options = {
    title: {
      text: title,
      left: "center",
    },
    tooltip: {
      trigger: "item",
      triggerOn: "mousemove",
      formatter: (params: any) => {
        if (params.dataType === "node") {
          const nodeName = params.name;
          const role = data.nodeMapping[nodeName] || "";
          return `${nodeName} (${role})`;
        } else if (params.dataType === "edge") {
          const sourceName = params.data.source;
          const targetName = params.data.target;
          const value = params.data.value;
          const sourceRole = data.nodeMapping[sourceName] || "";
          const targetRole = data.nodeMapping[targetName] || "";
          return `(${sourceRole}) ${sourceName} → (${targetRole}) ${targetName}<br/>Value: ${value}`;
        }
      },
    },
    series: [
      {
        type: "sankey",
        data: data.nodes,
        links: data.links,
        emphasis: {
          focus: "adjacency",
        },
        levels: [
          {
            depth: 0,
            itemStyle: {
              color: "#fbb4ae",
            },
            lineStyle: {
              color: "source",
              opacity: 0.6,
            },
            label: {
              show: true,
              formatter: (params: any) =>
                `${params.name} (${data.nodeMapping[params.name] || ""})`,
            },
          },
          {
            depth: 1,
            itemStyle: {
              color: "#b3cde3",
            },
            lineStyle: {
              color: "source",
              opacity: 0.6,
            },
            label: {
              show: true,
              formatter: (params: any) =>
                `${params.name} (${data.nodeMapping[params.name] || ""})`,
            },
          },
          {
            depth: 2,
            itemStyle: {
              color: "#ccebc5",
            },
            lineStyle: {
              color: "source",
              opacity: 0.6,
            },
            label: {
              show: true,
              formatter: (params: any) =>
                `${params.name} (${data.nodeMapping[params.name] || ""})`,
            },
          },
        ],
        lineStyle: {
          curveness: 0.5,
        },
      },
    ],
  };

  return (
    <div className="flex-1 p-4">
      <ReactECharts option={options} style={{ height: "500px", width: "100%" }} />
    </div>
  );
};

export default SankeyChart;
