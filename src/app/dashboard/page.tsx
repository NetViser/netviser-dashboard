"use client";

import Spinner from "@/components/loader/spinner";
import { fetchDashboard } from "@/utils/client/fetchDashboard";
import ReactECharts from "echarts-for-react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useSessionStore } from "@/store/session";
import SummaryCard from "@/components/dashboard/SummaryCard";
import { FcAbout } from "react-icons/fc";
import { useMemo } from "react";
import BarChart from "@/components/chart/BarChart";
import PieChart from "@/components/chart/PieChart";
import AreaChart from "@/components/chart/AreaChart";
import { ChartWrapper } from "@/components/chart/ChartWrapper";

export default function DashboardPage() {
  const extractFileName = (name: string) => {
    console.log(name);
    const [, , ...words] = name.split("/");
    return words.join("/");
  };

  const router = useRouter();
  const { setActiveSession } = useSessionStore();

  const { data, isLoading } = useSWR("/api/dashboard", fetchDashboard, {
    shouldRetryOnError: false,

    onError: async (error) => {
      await Swal.fire({
        icon: "error",
        title: "Session Expired",
        confirmButtonText: "OK",
        timer: 1000,
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      console.error("Failed to get file name:", error);
      setActiveSession(false);
      router.push("/");
    },
  });

  const summaryCards = useMemo(
    () => [
      {
        title: "Total Rows",
        value: data?.total_rows ?? "N/A",
      },
      {
        title: "Total Detected Attacks",
        value: data?.total_detected_attacks ?? "N/A",
      },
      {
        title: "Detected Attack Types",
        value:
          Object.keys(data?.detected_attacks_distribution || {}).length ??
          "N/A",
      },
    ],
    [data, isLoading]
  );

  const getDstPortPieChartData = useMemo(() => {
    if (!data) return [];

    const formattedData = Object.entries(
      data.dst_port_distribution as Record<string, number>
    ).map(([key, value]) => ({
      name: key,
      value,
    }));

    return formattedData;
  }, [data, isLoading]);

  const getAttackClassPieChartData = useMemo(() => {
    if (!data) return [];

    const formattedData = Object.entries(
      data.detected_attacks_distribution as Record<string, number>
    ).map(([key, value]) => ({
      name: key,
      value,
    }));

    return formattedData;
  }, [data, isLoading]);

  const getProtocolPieChartData = useMemo(() => {
    if (!data) return [];
    // Map 17 to TCP and 6 to UDP
    const formattedData = Object.entries(
      data.protocol_distribution as Record<string, number>
    ).map(([key, value]) => ({
      name: key === "6" ? "TCP" : key === "17" ? "UDP" : key,
      value,
    }));
    return formattedData;
  }, [data, isLoading]);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="h-full px-6 py-4">
      {/* Header Section */}
      <div className="flex flex-col items-start w-full">
        <div className="text-2xl font-bold">Dashboard</div>
        <div className="text-xl font-medium mb-6 text-gray-500">
          {data ? extractFileName(data?.file_name) : "Unknown"}
        </div>
      </div>

      <div className="flex flex-col gap-y-6 mb-4">
        {/* Summary Cards Section */}
        <div className="flex flex-row items-start gap-x-6">
          {summaryCards.map((card, index) => (
            <SummaryCard
              key={index}
              title={card.title}
              value={card.value}
              icon={<FcAbout size={32} />}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="h-[30rem]">
            <PieChart
              title="Protocol Distribution"
              data={getProtocolPieChartData}
              showFrequency
            />
          </div>
          <div className="h-[30rem]">
            <BarChart
              title="Source IP Distribution"
              xLabelNameLocation="middle"
              xAxisNameGap={60}
              data={Object.values(
                data?.src_ip_address_distribution as Record<string, number>
              )}
              categories={Object.keys(
                data?.src_ip_address_distribution as Record<string, number>
              ).map((key) => String(key))}
            />
          </div>
          <div className="h-[30rem]">
            <PieChart
              title="Destination Port Distribution"
              data={getDstPortPieChartData}
            />
          </div>
          <div className="h-[30rem]">
            <PieChart
              title="Attack Class Distribution"
              data={getAttackClassPieChartData}
            />
          </div>
        </div>

        <div className="h-[450px]">
          <AreaChart
            title="Forward Packets Per Second and Backward Packets Per Second"
            dates={
              data?.fwd_packets_per_second.map((item) => item.timestamp) || []
            }
            chartOption={{ yAxisLabel: "Packets Per Second" }}
            datasets={[
              {
                name: "Forward Packets Per Second",
                data:
                  data?.fwd_packets_per_second.map((item) => item.value) || [],
                colorStart: "rgb(255, 158, 68)",
                colorEnd: "rgb(255, 70, 131)",
              },
              {
                name: "Backward Packets Per Second",
                data:
                  data?.bwd_packets_per_second.map((item) => item.value) || [],
                colorStart: "rgb(135, 206, 250)",
                colorEnd: "rgb(70, 130, 180)",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
