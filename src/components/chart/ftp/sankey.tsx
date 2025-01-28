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
  apidata: SankeyData;
}

const FTPSankey: React.FC<FTPSankeyProps> = ({ apidata }) => {
  // Mock data for the Sankey diagram
  const data = apidata

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
