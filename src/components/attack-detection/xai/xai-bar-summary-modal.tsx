"use client";

import React, { useState } from "react";
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TypeIt from "typeit-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  BarSummaryItem,
  fetchAttackBarSummaryXAIExplanation,
  FetchAttackBarSummaryXAIExplanationResponse,
} from "@/utils/client/fetchAttackSummaryXAI";
import SummaryBarChart from "@/components/chart/xai/SummaryBarChart";
import Swal from "sweetalert2";

export type XAIBarSummaryModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attackType: string;
  data: BarSummaryItem[];
};

export function XAIBarSummaryModal({
  open,
  onOpenChange,
  attackType,
  data,
}: XAIBarSummaryModalProps) {
  // When the user clicks the button, we start fetching the explanation.
  const [explanationRequested, setExplanationRequested] = useState(false);

  const { data: explanationData, isLoading: explanationLoading } =
    useSWR<FetchAttackBarSummaryXAIExplanationResponse>(
      explanationRequested
        ? ["fetchAttackBarSummaryXAIExplanation", attackType]
        : null,
      () => fetchAttackBarSummaryXAIExplanation({ attack_type: attackType }),
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
          console.error("Failed to fetch summary explanation:", error);
        },
      }
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-full p-4">
        <DialogHeader>
          <DialogTitle>
            {`Feature Importance By Mean |SHAP| Value (${attackType})`}
          </DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <SummaryBarChart attackType={attackType} data={data} minimal />
        </div>
        <div className="w-full p-4 mt-4 border-t border-stone-300">
          <div className="mb-2 text-lg font-semibold text-orange-500">
            Need help understanding the force plot?
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
            <div className="bg-gray-100 p-4 rounded-lg shadow-md mt-4">
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
                    // The key ensures that TypeIt re-mounts when the text changes.
                    <TypeIt
                      key={explanationData.explanation}
                      as="div"
                      options={{
                        speed: 1,
                        waitUntilVisible: true,
                        cursor: false,
                      }}
                      className="text-stone-800 text-base"
                    >
                      {explanationData.explanation}
                    </TypeIt>
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
