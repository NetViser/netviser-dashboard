"use client";

import React from "react";
import ReactECharts from "echarts-for-react";

// Define the structure of each node
interface SankeyNode {
  name: string;
  // Additional properties can be added as needed
}

// Define the structure of each link
interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

// Define the overall data structure
interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

interface FTPSankeyProps {
  // Define any props if needed in the future
}

const FTPSankey: React.FC<FTPSankeyProps> = () => {
  // Mock data for the Sankey diagram
  const data: SankeyData = {
    nodes: [
      { name: "Start" },
      { name: "Process A" },
      { name: "Process B" },
      { name: "Decision" },
      { name: "End 1" },
      { name: "End 2" },
    ],
    links: [
      { source: "Start", target: "Process A", value: 10 },
      { source: "Start", target: "Process B", value: 5 },
      { source: "Process A", target: "Decision", value: 7 },
      { source: "Process B", target: "Decision", value: 5 },
      { source: "Decision", target: "End 1", value: 8 },
      { source: "Decision", target: "End 2", value: 4 },
    ],
  };

  // Define the chart options
  const options = {
    title: {
      text: "Sankey Diagram",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      triggerOn: "mousemove",
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
          },
          {
            depth: 3,
            itemStyle: {
              color: "#decbe4",
            },
            lineStyle: {
              color: "source",
              opacity: 0.6,
            },
          },
        ],
        lineStyle: {
          curveness: 0.5,
        },
      },
    ],
    // // Optional: Configure the layout to make it more visually appealing
    // tooltip: {
    //   trigger: "item",
    //   triggerOn: "mousemove",
    //   formatter: (params: any) => {
    //     if (params.dataType === "node") {
    //       return `${params.name}`;
    //     } else if (params.dataType === "edge") {
    //       return `${params.source} → ${params.target}: ${params.value}`;
    //     }
    //   },
    // },
  };

  return (
    <div className="flex-1 p-4">
      <ReactECharts option={options} style={{ height: "500px", width: "100%" }} />
    </div>
  );
};

export default FTPSankey;
