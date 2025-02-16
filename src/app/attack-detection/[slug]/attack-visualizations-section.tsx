"use client";

import { useState } from "react";
import { SpecificAttackRecord } from "@/utils/client/fetchAttackDetectionVis";
import { Tabs, Tab } from "@/components/ui/tabs/tabs";
import AttackDetectionTimeSeries from "@/components/attack-detection/time-series/AttackDetectionTimeSeries";
import { FTPPatatorVisSection } from "@/components/attack-detection/attack-specific-visualization/ftp-patator-vis-section";

type AttackVisualizationsSectionProps = {
  attackType: string;
  attackVisualizations:
    | {
        normalData: SpecificAttackRecord[];
        attackData: SpecificAttackRecord[];
      }
    | undefined;
};

export function AttackVisualizationsSection({
  attackType,
  attackVisualizations,
}: AttackVisualizationsSectionProps) {
  const [activeTab, setActiveTab] = useState("overall");

  const renderSpecificAttackVisualization = () => {
    if (attackType === "FTP-Patator") {
      return <FTPPatatorVisSection data={attackVisualizations} />;
    }

    // Fallback if no matching visualization is found
    return null;
  };

  return (
    <div className="w-full rounded-lg shadow-sm bg-white p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">Attack Specific Visualizations</h2>

      {/* Tabs */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab}>
        <Tab tab="overall" label="Overall">
          {renderSpecificAttackVisualization()}
        </Tab>
        <Tab tab="timeseries" label="Time Series">
          <AttackDetectionTimeSeries />
        </Tab>
      </Tabs>
    </div>
  );
}
