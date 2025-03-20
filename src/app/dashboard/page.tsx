"use client";

import Spinner from "@/components/loader/spinner";
import { fetchDashboard } from "@/utils/client/fetchDashboard";
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
import DashBoardTour from "../tour/dashboard_tour";

export default function DashboardPage() {
  const extractFileName = (name: string) => {
    console.log(name);
    const [, , ...words] = name.split("/");
    return words.join("/");
  };

  const router = useRouter();
  const { setActiveSession, sessionID } = useSessionStore();

  const { data, isLoading } = useSWR(
    `${sessionID}/api/dashboard`,
    fetchDashboard,
    {
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
    }
  );

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
    [data]
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
  }, [data]);

  const getAttackClassPieChartData = useMemo(() => {
    if (!data) return [];

    const formattedData = Object.entries(
      data.detected_attacks_distribution as Record<string, number>
    ).map(([key, value]) => ({
      name: key,
      value,
    }));

    return formattedData;
  }, [data]);

  const getProtocolPieChartData = useMemo(() => {
    if (!data) return [];
    // Build an object mapping protocols to their counts
    const protocol_distribution: Record<string, number> = {};
    Object.entries(
      data.protocol_distribution as Record<string, number>
    ).forEach(([key, value]) => {
      const protocolMapping: any = {
        "6": "TCP",
        "1": "TCP",
        "17": "UDP",
        "0": "UDP",
      };

      const mappedKey = protocolMapping[key] ?? key;
      if (protocol_distribution[mappedKey]) {
        protocol_distribution[mappedKey] += value;
      } else {
        protocol_distribution[mappedKey] = value;
      }
    });
    // Convert the object to an array of { name, value } objects
    const formattedData = Object.entries(protocol_distribution).map(
      ([name, value]) => ({
        name,
        value,
      })
    );
    return formattedData;
  }, [data]);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="h-full px-8 py-6 bg-gray-50">
      {/* Header Section */}
      <div className="flex flex-col items-start w-full mb-8">
        <div className="flex items-center justify-between w-full mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Network Analytics Dashboard</h1>
          <DashBoardTour />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-medium text-gray-500">Analyzing:</span>
          <span className="px-4 py-2 text-gray-700 bg-white rounded-lg shadow-sm ring-1 ring-gray-200/50">
            {data ? extractFileName(data?.file_name) : "Unknown"}
          </span>
        </div>
        <div className="w-full mt-6 border-b-2 border-gray-200" />
      </div>

      <div className="flex flex-col gap-y-6 mb-4">
        {/* Summary Cards Section */}
        <div className="flex flex-row items-start gap-x-6" id="summary-cards">
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
              data={Object.values(
                data?.src_ip_address_distribution as Record<string, number>
              )}
              categories={Object.keys(
                data?.src_ip_address_distribution as Record<string, number>
              ).map((key) => String(key))}
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
