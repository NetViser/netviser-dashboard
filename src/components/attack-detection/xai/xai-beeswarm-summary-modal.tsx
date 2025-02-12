"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaExpandAlt } from "react-icons/fa";
import SummaryBeeSwarmChart from "@/components/chart/xai/SummaryBeeSwarmChart";
import { BeeswarmSummaryItem } from "@/utils/client/fetchAttackSummaryXAI";

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-full p-4">
        <DialogHeader>
          <DialogTitle>{`SHAP Beeswarm Plot (${attackType})`}</DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <SummaryBeeSwarmChart attackType={attackType} data={data} minimal withDataZoom />
        </div>
        <div className="w-full p-4 border-t border-stone-300">
          <div className="mb-2 text-lg font-semibold text-orange-500">
            Need help understanding the force plot?
          </div>
          <Button
            onClick={() => {}}
            className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold flex items-center transition-colors duration-200 ease-in-out border-2 border-stone-500 w-40"
          >
            Ask Gemini?
            <img
              src="/gemini-icon.svg"
              alt="Gemini Icon"
              className="w-5 h-5 ml-2"
            />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
