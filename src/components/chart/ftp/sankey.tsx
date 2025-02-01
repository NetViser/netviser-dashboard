"use client";

import React from "react";
import ReactECharts from "echarts-for-react";

// Define the structure of each node
interface SankeyNode {
  name: string;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

interface FTPSankeyProps {
  data: SankeyData;
}

const labelMap: Record<string, string> = {
  "172.16.0.1": "Source IP",
  "21": "Dest Port",
  // Everything else we'll consider "Source Port"
  // but you could expand this map or compute logic as needed.
};

const FTPSankey: React.FC<FTPSankeyProps> = ({ data }) => {
  const options = {
    title: {
      text: "Sankey Diagram",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      triggerOn: "mousemove",
      // Custom formatter for nodes and edges
      formatter: (params: any) => {
        if (params.dataType === "node") {
          // Node tooltip
          const nodeName = params.name;
          const role = labelMap[nodeName] || "Source Port";
          return `${nodeName} (${role})`;
        } else if (params.dataType === "edge") {
          // Edge tooltip
          const sourceName = params.data.source;
          const targetName = params.data.target;
          const value = params.data.value;

          const sourceRole = labelMap[sourceName] || "Source Port";
          const targetRole = labelMap[targetName] || "Source Port";

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
                `${params.name} (${labelMap[params.name] || "Source Port"})`,
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
                `${params.name} (${labelMap[params.name] || "Source Port"})`,
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
                `${params.name} (${labelMap[params.name] || "Source Port"})`,
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

export default FTPSankey;
