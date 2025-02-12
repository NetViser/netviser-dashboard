"use client";
import React, { useState } from "react";
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Swal from "sweetalert2";
import { ReactTyped } from "react-typed";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaExpandAlt } from "react-icons/fa";
import SummaryBeeSwarmChart from "@/components/chart/xai/SummaryBeeSwarmChart";

import {
  BeeswarmSummaryItem,
  fetchAttackBeeswarmSummaryXAIExplanation,
  FetchAttackBeeswarmSummaryXAIExplanationResponse,
} from "@/utils/client/fetchAttackSummaryXAI";

type XAIBeeswarmSummaryModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attackType: string;
  data: BeeswarmSummaryItem[];
};

export function XAIBeeswarmSummaryModal({
  open,
  onOpenChange,
  attackType,
  data,
}: XAIBeeswarmSummaryModalProps) {
  // Local state controlling whether we should fetch the Gemini explanation
  const [explanationRequested, setExplanationRequested] = useState(false);

  // Use SWR to fetch the beeswarm explanation only when explanationRequested = true
  const { data: explanationData, isLoading: explanationLoading } =
    useSWR<FetchAttackBeeswarmSummaryXAIExplanationResponse>(
      explanationRequested
        ? ["fetchAttackBeeswarmSummaryXAIExplanation", attackType]
        : null,
      () => fetchAttackBeeswarmSummaryXAIExplanation({ attack_type: attackType }),
      {
        shouldRetryOnError: false,
        onError: async (error) => {
          await Swal.fire({
            icon: "error",
            title: "Failed to fetch explanation",
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-full p-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{`SHAP Beeswarm Plot (${attackType})`}</DialogTitle>
        </DialogHeader>
        <div className="mx-16 -mt-10">
          {/* Render the beeswarm chart */}
          <SummaryBeeSwarmChart
            attackType={attackType}
            data={data}
            minimal
            withDataZoom
          />
        </div>
        <div className="w-full p-4 border-t border-stone-300 -mt-10">
          <div className="mb-2 text-lg font-semibold text-orange-500">
            Need help understanding the beeswarm plot?
          </div>

          {!explanationRequested && (
            <Button
              onClick={() => setExplanationRequested(true)}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold flex items-center transition-colors duration-200 ease-in-out border-2 border-stone-500 w-40"
              disabled={explanationLoading || !data}
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
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
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
                    <ReactTyped
                      strings={[explanationData.explanation]}
                      typeSpeed={1}
                      backSpeed={0}
                      showCursor={false}
                      className="text-stone-800 text-base"
                    />
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
      </DialogContent>
    </Dialog>
  );
}
