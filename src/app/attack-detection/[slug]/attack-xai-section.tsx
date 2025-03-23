"use client";

import React from "react";
import useSWR from "swr";
import { fetchAttackSummaryXAI } from "@/utils/client/fetchAttackSummaryXAI";
import Swal from "sweetalert2";
import SummaryBarChart from "@/components/chart/xai/SummaryBarChart";
import { XAIBarSummaryModal } from "@/components/attack-detection/xai/xai-bar-summary-modal";
import SummaryBeeSwarmChart from "@/components/chart/xai/SummaryBeeSwarmChart";
import { XAIBeeswarmSummaryModal } from "@/components/attack-detection/xai/xai-beeswarm-summary-modal";
import Skeleton from "react-loading-skeleton";
import { useSessionStore } from "@/store/session";
import { useLoadingStore } from "@/store/loadingStore";

type AttackXAISectionProps = {
  attackType: string;
};

export function AttackXAISection({ attackType }: AttackXAISectionProps) {
  const [showBarChartModal, setShowBarChartModal] = React.useState(false);
  const { sessionID } = useSessionStore();
  const [showBeeSwarmChartModal, setShowBeeSwarmChartModal] = React.useState(false);
  const { setLoading } = useLoadingStore();

  // Use SWR to fetch the XAI summary data.
  const { data, error, isLoading } = useSWR(
    `${sessionID}/attack_summary_xai?attack_type=${attackType}`,
    () => fetchAttackSummaryXAI({ attack_type: attackType }),
    {
      shouldRetryOnError: false,
      keepPreviousData: true,
      onError: () => {
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

  // Update global loading state once data or error is available
  React.useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  // Show loading skeletons while fetching data
  if (!data && !error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-md mt-4">
        <h1 className="text-xl font-bold mb-4">XAI Section</h1>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left Container Skeleton */}
          <div className="md:w-1/2 border-2 rounded-lg border-stone-500/50 px-4 pb-4">
            <Skeleton
              style={{
                padding: "1rem",
                borderRadius: "8px",
                height: "3rem",
                marginTop: "1rem",
                marginBottom: "1.5rem",
              }}
              count={1}
              width="70%"
            />
            <Skeleton
              style={{
                padding: "1rem",
                borderRadius: "8px",
                height: "3rem",
                margin: "1rem 1rem 0 0",
              }}
              count={3}
              width="100%"
            />
          </div>
          {/* Right Container Skeleton */}
          <div className="md:w-1/2 border-2 rounded-lg border-stone-500/50 px-4 pb-4">
            <Skeleton
              style={{
                padding: "1rem",
                borderRadius: "8px",
                height: "3rem",
                marginTop: "1rem",
                marginBottom: "1.5rem",
              }}
              count={1}
              width="70%"
            />
            <Skeleton
              style={{
                padding: "1rem",
                borderRadius: "8px",
                height: "3rem",
                margin: "1rem 1rem 0 0",
              }}
              count={3}
              width="100%"
            />
          </div>
        </div>
      </div>
    );
  }

  // If data is undefined or lacks required properties, show a fallback
  if (!data?.bar_summary || !data?.beeswarm_summary) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-md mt-4" id="attackxai">
        <h1 className="text-xl font-bold mb-4">XAI Section</h1>
        <p className="text-gray-500">No summary data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-md mt-4" id="attackxai">
      <h1 className="text-xl font-bold mb-4">XAI Section</h1>
      {/* First Row */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left: Bar Summary Chart */}
        <div className="md:w-1/2 border-2 rounded-lg border-stone-500/50 pr-4">
          <SummaryBarChart
            attackType={attackType}
            data={data.bar_summary}
            onHelpClick={() => setShowBarChartModal(true)}
          />
        </div>
        {/* Right: Beeswarm Summary Chart */}
        <div className="md:w-1/2 border-2 rounded-lg border-stone-500/50 pr-4">
          <SummaryBeeSwarmChart
            attackType={attackType}
            withDataZoom={false}
            onHelpClick={() => setShowBeeSwarmChartModal(true)}
            data={data.beeswarm_summary}
          />
        </div>
      </div>
      {/* Modal: Full width chart with help section */}
      {showBarChartModal && (
        <XAIBarSummaryModal
          open={showBarChartModal}
          onOpenChange={setShowBarChartModal}
          attackType={attackType}
          data={data.bar_summary}
        />
      )}
      {showBeeSwarmChartModal && (
        <XAIBeeswarmSummaryModal
          open={showBeeSwarmChartModal}
          onOpenChange={setShowBeeSwarmChartModal}
          attackType={attackType}
          data={data.beeswarm_summary}
        />
      )}
    </div>
  );
}
