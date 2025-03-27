"use client";

import React from "react";
import { useLoadingStore } from "@/store/loadingStore";
import { BarSummarySection } from "@/components/attack-detection/xai/BarSummarySection";
import { BeeswarmSummarySection } from "@/components/attack-detection/xai/BeeswarmSummarySection";
import { useAttackXAISummary } from "@/hooks/api/useAttackXAISummary";

type AttackXAISectionProps = {
  attackType: string;
};

export function AttackXAISection({ attackType }: AttackXAISectionProps) {
  const { setLoading } = useLoadingStore();

  // fetch the XAI summary data
  const { data, error, isLoading } = useAttackXAISummary(attackType);

  // Update global loading state once data or error is available
  React.useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  // If data is undefined or lacks required properties, show a fallback
  if (!isLoading && (!data?.bar_summary || !data?.beeswarm_summary)) {
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
      <div className="flex flex-col gap-6">
        <BarSummarySection
          attackType={attackType}
          barSummaryData={data?.bar_summary}
          isLoading={isLoading && !data && !error}
        />
        <BeeswarmSummarySection
          attackType={attackType}
          beeswarmSummaryData={data?.beeswarm_summary}
          isLoading={isLoading && !data && !error}
        />
      </div>
    </div>
  );
}
