"use client";

import React, { useState } from "react";
import useSWR from "swr";
import {
  fetchIndividualXAI,
  fetchIndividualXAIExplaination,
  FetchIndividualXAIExplainationResponse,
  FetchIndividualXAIResponse,
} from "@/utils/client/fetchIndividualXAI";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import Spinner from "@/components/loader/spinner";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TypeIt from "typeit-react";

interface XAIModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attackType: string;
  selectedRow: number;
}

export function XAIModal({
  open,
  onOpenChange,
  attackType,
  selectedRow,
}: XAIModalProps) {
  const [explanationRequested, setExplanationRequested] = useState(false);

  const { data, isLoading } = useSWR<FetchIndividualXAIResponse>(
    open ? ["fetchIndividualXAI", attackType, selectedRow] : null,
    () =>
      fetchIndividualXAI({
        attack_type: attackType,
        data_point_id: selectedRow,
      }),
    {
      shouldRetryOnError: false,
      onError: async (error) => {
        await Swal.fire({
          icon: "error",
          title: "Something went wrong",
          confirmButtonText: "OK",
          timer: 1000,
          timerProgressBar: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        console.error("Failed to fetch individual XAI data:", error);
        onOpenChange(false);
      },
    }
  );

  const { data: explanationData, isLoading: explanationLoading } =
    useSWR<FetchIndividualXAIExplainationResponse>(
      explanationRequested
        ? ["fetchIndividualXAIExplaination", attackType, selectedRow]
        : null,
      () =>
        fetchIndividualXAIExplaination({
          attack_type: attackType,
          data_point_id: selectedRow,
        }),
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
          console.error("Failed to fetch individual XAI explanation:", error);
        },
      }
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col justify-center min-w-[100vw]">
        <DialogHeader>
          <DialogTitle>XAI - Individual Network Instance</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full w-full items-center space-y-4">
          {isLoading && (
            <div className="h-[40vh] flex items-center justify-center">
              <Spinner />
            </div>
          )}

          {data && (
            <img
              src={data.force_plot_url}
              alt="Force Plot"
              className="w-full mb-4"
              loading="lazy"
            />
          )}

          <div className="w-full p-4 relative">
            <div className="mb-2 text-lg font-semibold text-orange-500">
              Need help understanding the force plot?
            </div>

            {!explanationRequested && (
              <Button
                onClick={() => setExplanationRequested(true)}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold flex items-center transition-colors duration-200 ease-in-out border-2 border-stone-500"
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
                      style={{
                        borderRadius: "8px",
                        height: "1.5rem",
                      }}
                      count={4}
                      width="100%"
                    />
                  ) : explanationData ? (
                    <TypeIt
                      as="div"
                      options={{
                        speed: 5,
                        waitUntilVisible: true,
                        cursor: false,
                      }}
                      className="text-stone-800 text-base"
                    >
                      {explanationData.explanation}
                    </TypeIt>
                  ) : (
                    <div className="text-red-500">Failed to load explanation.</div>
                  )}
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
