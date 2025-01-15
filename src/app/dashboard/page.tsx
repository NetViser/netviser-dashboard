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
import { use, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import PieChart from "highcharts-react-official";
import pieoptions from "@/components/dashboard/PieChartOption";
import HorizontalBarChart from "@/components/dashboard/HorizontalBarChart";
import BarChart from "@/components/dashboard/BarChart";
import CustomPieChart from "@/components/dashboard/PieChart";

export default function DashboardPage() {
  const extractFileName = (name: string) => {
    console.log(name);
    const [, , ...words] = name.split("/");
    return words.join("/");
  };

  const router = useRouter();
  const { setActiveSession, isActiveSession } = useSessionStore();


  const { data, isLoading } = useSWR("/api/dashboard", fetchDashboard, {
    shouldRetryOnError: false,

    onError: async (error) => {
      await Swal.fire({
        icon: "error",
        title: "Session Expired",
        confirmButtonText: "OK",
        timer: 3000,
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
        value: data?.detected_attack_types.length ?? "N/A",
      },
    ],
    [data, isLoading],
  );

  const getDstPortPieChartData = useMemo(() => {
    if (!data) return [];

    const formattedData = Object.entries(
      data.dst_port_distribution as Record<string, number>,
    ).map(([key, value]) => ({
      name: key,
      value,
    }));

    return formattedData;
  }, [data, isLoading]);

  return (
    <div className="min-h-screen pt-24 px-6 bg-sky-50">
      {isLoading ? (
        <Spinner />
      ) : (
        <div>
          {/* Header Section */}
          <div className="flex flex-col items-start">
            <div className="text-2xl font-bold">Dashboard</div>
            <div className="text-xl font-medium mb-6 text-gray-500">
              {data ? extractFileName(data?.file_name) : "Unknown"}
            </div>
          </div>

          {/* Summary Cards Section */}
          <div className="flex flex-col gap-y-6">
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

            <div className="grid grid-cols-2 gap-6 mb-6">
              <HorizontalBarChart
                title="Protocol Distribution"
                data={Object.values(
                  data?.protocol_distribution as Record<string, number>,
                )}
                categories={Object.keys(
                  data?.protocol_distribution as Record<string, number>,
                ).map((key) => String(key))}
              />

              <BarChart
                title="Source IP Distribution"
                data={Object.values(
                  data?.src_ip_address_distribution as Record<string, number>,
                )}
                categories={Object.keys(
                  data?.src_ip_address_distribution as Record<string, number>,
                ).map((key) => String(key))}
              />

              <CustomPieChart
                title="Destination Port Distribution"
                data={getDstPortPieChartData}
              />

              <PieChart highcharts={Highcharts} options={pieoptions} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
