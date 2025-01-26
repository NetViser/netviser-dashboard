"use client";

import React from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import Spinner from "@/components/loader/spinner";
import type { DataPoint } from "@/utils/client/fetchAttackDetectionScatter";

interface AttacksScatterProps {
  title?: string;
  feature?: string;
  attackData: DataPoint[];
  benignData: DataPoint[];
  attackName: string;
  isLoading?: boolean;
}

export default function AttacksScatter({
  title = "Network Traffic Distribution by Timestamp",
  feature,
  attackData = [],
  benignData = [],
  attackName,
  isLoading = false,
}: AttacksScatterProps) {
  const formatData = (data: DataPoint[]) => {
    return data.map((point) => [point.timestamp, point.value]);
  };

  const option: EChartsOption = {
    title: {
      text: title,
      left: "5%",
    },
    xAxis: {
      type: "time",
      name: "Timestamp",
    },
    yAxis: {
      name: feature,
      scale: true,
      
    },
    legend: {
      data: [attackName, "Benign"],
      right: "8%",
    },
    grid: {
      top: "14%",
      left: "6%",
      right: "8%",
      bottom: "11%",
      containLabel: true,
    },
    toolbox: {
      left: "center",
      feature: {
        dataZoom: {
          yAxisIndex: "none",
        },
        restore: {},
        saveAsImage: {},
      },
    },
    tooltip: {
      trigger: "axis", // Better for comparing points
      showDelay: 0,
      axisPointer: {
        show: true,
        type: "cross",
        lineStyle: {
          type: "dashed",
          width: 1,
        },
      },
    },
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: 0,
        filterMode: "none",
      },
      {
        type: "slider",
        xAxisIndex: 0,
        filterMode: "none",
      },
    ],
    series: [
      {
        name: attackName,
        type: "effectScatter",
        symbolSize: 8,
        itemStyle: {
          color: "#ff4d4f",
        },
        data: formatData(attackData),
      },
      {
        name: "Benign",
        type: "scatter",
        symbolSize: 8,
        itemStyle: {
          color: "#1890ff",
        },
        data: formatData(benignData),
      },
    ],
  };

  return (
    <div className="bg-white py-4 pt-6 rounded-lg shadow-md h-[560px]">
      {isLoading ? (
        <Spinner />
      ) : (
        <ReactECharts
          option={option}
          opts={{
            width: "auto",
            height: 510,
          }}
        />
      )}
    </div>
  );
}
