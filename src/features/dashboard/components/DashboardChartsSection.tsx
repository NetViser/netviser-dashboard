"use client";

import { useMemo } from "react";
import PieChart from "@/components/chart/PieChart";
import BarChart from "@/components/chart/BarChart";
import AreaChart from "@/components/chart/AreaChart";
import { DashboardChartsSectionProps } from "../types";

const DashboardChartsSection: React.FC<DashboardChartsSectionProps> = ({ data }) => {
  const getDstPortPieChartData = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.dst_port_distribution as Record<string, number>).map(
      ([key, value]) => ({ name: key, value })
    );
  }, [data]);

  const getAttackClassPieChartData = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.detected_attacks_distribution as Record<string, number>).map(
      ([key, value]) => ({ name: key, value })
    );
  }, [data]);

  const getProtocolPieChartData = useMemo(() => {
    if (!data) return [];
    const protocol_distribution: Record<string, number> = {};
    Object.entries(data.protocol_distribution as Record<string, number>).forEach(
      ([key, value]) => {
        const protocolMapping: Record<string, string> = {
          "6": "TCP",
          "1": "TCP",
          "17": "UDP",
          "0": "UDP",
        };
        const mappedKey = protocolMapping[key] ?? key;
        protocol_distribution[mappedKey] = (protocol_distribution[mappedKey] || 0) + value;
      }
    );
    return Object.entries(protocol_distribution).map(([name, value]) => ({ name, value }));
  }, [data]);

  return (
    <>
      <div className="grid grid-cols-2 gap-6">
        <div className="h-[30rem]" id="protocol-distribution">
          <PieChart
            title="Protocol Distribution"
            data={getProtocolPieChartData}
            showFrequency
            classLabel="Protocol"
          />
        </div>
        <div className="h-[30rem] bg-white rounded-lg shadow-md" id="src-ip-distribution">
          <BarChart
            title="Source IP Distribution"
            xLabelNameLocation="middle"
            xAxisNameGap={60}
            data={Object.values(data?.src_ip_address_distribution as Record<string, number>)}
            categories={Object.keys(data?.src_ip_address_distribution as Record<string, number>).map(String)}
          />
        </div>
        <div className="h-[30rem]" id="dst-port-distribution">
          <PieChart
            title="Destination Port Distribution"
            data={getDstPortPieChartData}
            classLabel="Port"
          />
        </div>
        <div className="h-[30rem]" id="attack-class-distribution">
          <PieChart
            title="Attack Class Distribution"
            data={getAttackClassPieChartData}
            classLabel="Attack Class"
            showFrequency
          />
        </div>
      </div>

      <div className="h-[450px]" id="packets-per-second">
        <AreaChart
          title="Forward Packets Per Second and Backward Packets Per Second"
          dates={data?.fwd_packets_per_second.map((item: any) => item.timestamp) || []}
          chartOption={{ yAxisLabel: "Packets Per Second" }}
          datasets={[
            {
              name: "Forward Packets Per Second",
              data: data?.fwd_packets_per_second.map((item: any) => item.value) || [],
              colorStart: "rgb(255, 158, 68)",
              colorEnd: "rgb(255, 70, 131)",
            },
            {
              name: "Backward Packets Per Second",
              data: data?.bwd_packets_per_second.map((item: any) => item.value) || [],
              colorStart: "rgb(135, 206, 250)",
              colorEnd: "rgb(70, 130, 180)",
            },
          ]}
        />
      </div>
    </>
  );
};

export default DashboardChartsSection;
