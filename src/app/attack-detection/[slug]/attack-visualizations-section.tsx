"use client";

import { useState } from "react";
import { SpecificAttackRecord } from "@/utils/client/fetchAttackDetectionVis";
import { Tabs, Tab } from "@/components/ui/tabs/tabs";
import AttackDetectionTimeSeries from "@/components/attack-detection/time-series/AttackDetectionTimeSeries";
import { FTPPatatorVisSection } from "@/components/attack-detection/attack-specific-visualization/ftp-patator-vis-section";
import { DDOSVisSection } from "@/components/attack-detection/attack-specific-visualization/ddos-vis-section";
import { PortscanVisSection } from "@/components/attack-detection/attack-specific-visualization/portscan-vis-section";
import { DosHulkVisSection } from "@/components/attack-detection/attack-specific-visualization/dos-hulk-vis-section";
import { DoSSlowlorisVisSection } from "@/components/attack-detection/attack-specific-visualization/dos-slowloris-vis-section";
import { SSHPatatorVisSection } from "@/components/attack-detection/attack-specific-visualization/ssh-patator-vis-section";

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

    if (attackType === "SSH-Patator") {
      return <SSHPatatorVisSection data={attackVisualizations} />;
    }

    if (attackType === "DDoS") {
      return <DDOSVisSection data={attackVisualizations} />;
    }

    if (attackType === "Portscan") {
      return <PortscanVisSection data={attackVisualizations} />;
    }

    if (attackType === "DoS Hulk") {
      return <DosHulkVisSection data={attackVisualizations} />;
    }

    if (attackType === "DoS Slowloris") {
      return <DoSSlowlorisVisSection data={attackVisualizations} />;
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
          <AttackDetectionTimeSeries attackType={attackType} />
        </Tab>
      </Tabs>
    </div>
  );
}
