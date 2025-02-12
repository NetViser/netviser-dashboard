"use client";
import React from "react";
import ReactECharts from "echarts-for-react";
import { BarSummaryItem } from "@/utils/client/fetchAttackSummaryXAI";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SummaryBarChart from "@/components/chart/xai/SummaryBarChart";

type XAIBarSummaryModalProps = {
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-full p-4">
        <DialogHeader>
          <DialogTitle>{`Feature Important By Mean |SHAP| Value (${attackType})`}</DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <SummaryBarChart attackType={attackType} data={data} minimal/>
        </div>
        <div className="w-full p-4 mt-4 border-t border-stone-300">
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
