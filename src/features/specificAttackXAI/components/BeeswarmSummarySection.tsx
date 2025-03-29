"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { fetchAttackBeeswarmSummaryXAIExplanation } from "@/lib/api/fetchAttackSummaryXAI";
import Swal from "sweetalert2";
import BeeSwarmChart from "@/components/chart/xai/BeeswarmChart";
import Skeleton from "react-loading-skeleton";
import DescriptionAccordion from "@/components/accordion/DescriptionAccordion";
import { XAI_VIS_DESCRIPTIONS } from "@/utils/XAIVisualizationDescriptions";
import { Button } from "@/components/ui/button";
import { BeeswarmSummarySectionProps } from "../types/index.types";

export default function BeeswarmSummarySection({
  attackType,
  beeswarmSummaryData,
  isLoading,
}: BeeswarmSummarySectionProps) {
  const [explanationRequested, setExplanationRequested] = useState(false);

  const { data: explanationData, isLoading: explanationLoading } = useSWR(
    explanationRequested
      ? ["fetchAttackBeeswarmSummaryXAIExplanation", attackType]
      : null,
    () => fetchAttackBeeswarmSummaryXAIExplanation({ attack_type: attackType }),
    {
      shouldRetryOnError: false,
      onError: async (error) => {
        await Swal.fire({
          icon: "error",
          title: "Failed to fetch beeswarm explanation",
          confirmButtonText: "OK",
          timer: 1000,
          timerProgressBar: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        console.error("Failed to fetch beeswarm explanation:", error);
      },
    }
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
        <Skeleton
          height={300}
          containerClassName="p-4"
          style={{ borderRadius: "8px" }}
        />
        <div className="p-4 border-t border-gray-200">
          <Skeleton
            height={40}
            width="70%"
            style={{ marginBottom: "1rem", borderRadius: "8px" }}
          />
          <Skeleton
            height={20}
            count={2}
            style={{ marginBottom: "0.5rem", borderRadius: "8px" }}
          />
          <Skeleton
            height={30}
            width={160}
            style={{ marginTop: "1rem", borderRadius: "8px" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border-2 shadow-sm flex flex-col">
      <BeeSwarmChart
        attackType={attackType}
        withDataZoom={false}
        data={beeswarmSummaryData}
      />
      <div className="p-4 border-t border-gray-200">
        <DescriptionAccordion
          title={XAI_VIS_DESCRIPTIONS.bee_swarm.title}
          description={XAI_VIS_DESCRIPTIONS.bee_swarm.description}
        />
        <div className="mt-4">
          <div className="mb-2 text-lg font-semibold text-orange-500">
            Need help understanding the beeswarm plot?
          </div>
          {!explanationRequested && (
            <Button
              onClick={() => setExplanationRequested(true)}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold flex items-center transition-colors duration-200 ease-in-out border-2 border-stone-500 w-40"
              disabled={explanationLoading || !beeswarmSummaryData}
              id="explanation-button-gemini-beeswarm"
            >
              Ask Gemini?
              <img
                src="/gemini-icon.svg"
                alt="Gemini Icon"
                className="w-5 h-5 ml-2"
              />
            </Button>
          )}
          {explanationRequested && (
            <div
              className="bg-gray-100 p-4 rounded-lg shadow-md"
              id="explanation-beeswarm"
            >
              <div className="relative">
                <img
                  src="/gemini-icon.svg"
                  alt="Gemini Icon"
                  className="w-6 h-6 absolute top-0 left-0"
                />
                <div className="pl-8">
                  {explanationLoading ? (
                    <Skeleton
                      style={{ borderRadius: "8px", height: "1.5rem" }}
                      count={4}
                      width="100%"
                    />
                  ) : explanationData ? (
                    <p className="text-stone-800 text-base animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {explanationData.explanation}
                    </p>
                  ) : (
                    <div className="text-red-500">
                      Failed to load explanation.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}