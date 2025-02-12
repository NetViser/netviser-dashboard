"use client";
import React from "react";
import useSWR from "swr";
import Spinner from "@/components/loader/spinner";
import { fetchAttackSummaryXAI } from "@/utils/client/fetchAttackSummaryXAI";
import Swal from "sweetalert2";
import SummaryBarChart from "@/components/chart/xai/SummaryBarChart";
import { Button } from "@/components/ui/button";
import { XAIBarSummaryModal } from "@/components/attack-detection/xai/xai-bar-summary-modal";
import SummaryBeeSwarmChart from "@/components/chart/xai/SummaryBeeSwarmChart";
import { XAIBeeswarmSummaryModal } from "@/components/attack-detection/xai/xai-beeswarm-summary-modal";

type AttackXAISectionProps = {
  attackType: string;
};

export function AttackXAISection({ attackType }: AttackXAISectionProps) {
  const [showBarChartModal, setShowBarChartModal] = React.useState(false);
  // Use SWR to fetch the XAI summary data.
  const { data, error } = useSWR(
    `/attack_summary_xai?attack_type=${attackType}`,
    () => fetchAttackSummaryXAI({ attack_type: attackType }),
    {
      shouldRetryOnError: false,
      keepPreviousData: true,
      onError: (_error) => {
        Swal.fire({
          icon: "error",
          title: "Have Problem Fetching XAI Summary",
          confirmButtonText: "OK",
          timer: 1000,
          timerProgressBar: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      },
    }
  );

  // Show a loading state while fetching
  if (!data && !error) {
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-md mt-4">
      <h1 className="text-xl font-bold mb-4">XAI Section</h1>
      {/* First Row */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left: Bar Summary Chart */}
        <div className="md:w-1/2 border-2 rounded-lg border-stone-500/50 pr-4">
          <SummaryBarChart
            attackType={attackType}
            data={data?.bar_summary!}
            onHelpClick={() => setShowBarChartModal(true)}
          />
        </div>
        <div className="md:w-1/2 border-2 rounded-lg border-stone-500/50 pr-4">
          <SummaryBeeSwarmChart
            attackType={attackType}
            withDataZoom={false}
            onHelpClick={() => setShowBarChartModal(true)}
            data={data?.beeswarm_summary!}
          />
        </div>
      </div>
      {/* Modal: Full width chart with help section */}
      <XAIBeeswarmSummaryModal
        open={showBarChartModal}
        onOpenChange={setShowBarChartModal}
        attackType={attackType}
        data={data?.beeswarm_summary!}
      />
    </div>
  );
}
