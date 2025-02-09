"use client";

import React from "react";
import useSWR from "swr";
import {
  fetchIndividualXAI,
  FetchIndividualXAIResponse,
} from "@/utils/client/fetchIndividualXAI";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import Spinner from "@/components/loader/spinner";

interface XAIModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attackType: string;
  selectedRow: number;
}

/**
 * XAIModal fetches individual XAI data using SWR and displays the force plot image (and text summary)
 * in a modal dialog.
 */
export function XAIModal({
  open,
  onOpenChange,
  attackType,
  selectedRow,
}: XAIModalProps) {
  // Only fetch when the modal is open.
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col justify-center min-w-[95vw]">
        <DialogHeader>
          <DialogTitle>XAI - Individual Network Instance</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full items-center space-y-4">
          {isLoading && <Spinner />}
          {data && (
            <>
              <img
                src={data.force_plot_url}
                alt="Force Plot"
                width="100%"
                style={{ marginBottom: "1rem" }}
                loading="lazy"
              />
            </>
          )}
        </div>

        <DialogFooter className="justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
