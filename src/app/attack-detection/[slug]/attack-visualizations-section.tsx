"use client";

import React, { useEffect } from "react";
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Swal from "sweetalert2";
import {
  fetchSpecificAttackDetection,
  FetchSpecificAttackResponse,
} from "@/utils/client/fetchAttackDetectionOverview";
import { Tabs, Tab } from "@/components/ui/tabs/tabs";
import AttackDetectionTimeSeries from "@/components/attack-detection/time-series/AttackDetectionTimeSeries";
import { FTPPatatorVisSection } from "@/components/attack-detection/attack-specific-visualization/ftp-patator-vis-section";
import { DDOSVisSection } from "@/components/attack-detection/attack-specific-visualization/ddos-vis-section";
import { PortscanVisSection } from "@/components/attack-detection/attack-specific-visualization/portscan-vis-section";
import { DosHulkVisSection } from "@/components/attack-detection/attack-specific-visualization/dos-hulk-vis-section";
import { DoSSlowlorisVisSection } from "@/components/attack-detection/attack-specific-visualization/dos-slowloris-vis-section";
import { SSHPatatorVisSection } from "@/components/attack-detection/attack-specific-visualization/ssh-patator-vis-section";
import { useSessionStore } from "@/store/session";
import { useRouter } from "next/navigation";
import { useLoadingStore } from "@/store/loadingStore";

type AttackVisualizationsSectionProps = {
  attackType: string;
  activeTab: "overall" | "timeseries";
  setActiveTab: (tab: "overall" | "timeseries") => void;
};

export function AttackVisualizationsSection({
  attackType,
  activeTab,
  setActiveTab,
}: AttackVisualizationsSectionProps) {
  const { setLoading } = useLoadingStore();
  const router = useRouter();
  const { setActiveSession } = useSessionStore();

  async function handleSessionExpired(error: any) {
    console.error("Session Expired or fetch error:", error);
    await Swal.fire({
      icon: "error",
      title: "Session Expired",
      confirmButtonText: "OK",
      timer: 1000,
      timerProgressBar: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
    setActiveSession(false);
    router.push("/");
  }

  // Fetch the attack visualization data using SWR
  const { data, error, isLoading } = useSWR<FetchSpecificAttackResponse>(
    `/api/${attackType}/attack_visuals`,
    () => fetchSpecificAttackDetection(attackType),
    {
      shouldRetryOnError: false,
      keepPreviousData: true,
      onError: async (err) => {
        console.error("Error fetching attack visualizations:", err);
        await Swal.fire({
          icon: "error",
          title: "Error fetching visualizations",
          confirmButtonText: "OK",
          timer: 1000,
          timerProgressBar: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then(async () => {
          await handleSessionExpired(err);
        });
      },
    }
  );

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  if (isLoading) {
    return (
      <div
        className="w-full rounded-lg shadow-sm bg-white p-6 mt-6"
        id="attack-visualizations"
      >
        <Skeleton
          height={28}
          width="30%"
          style={{ marginBottom: "1rem", borderRadius: "8px" }}
        />
        <div className="flex gap-4 mb-4">
          <Skeleton
            height={40}
            width={100}
            style={{ borderRadius: "8px" }}
          />
          <Skeleton
            height={40}
            width={100}
            style={{ borderRadius: "8px" }}
          />
        </div>
        <div className="flex flex-col gap-4">
          {/* Skeleton for content area */}
          <Skeleton
            height={200}
            style={{ borderRadius: "8px" }}
            containerClassName="mb-4"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton
              height={150}
              style={{ borderRadius: "8px" }}
            />
            <Skeleton
              height={150}
              style={{ borderRadius: "8px" }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <p className="text-red-500">Failed to load visualizations.</p>
      </div>
    );
  }

  const renderSpecificAttackVisualization = () => {
    if (attackType === "FTP-Patator") {
      return <FTPPatatorVisSection data={data} />;
    }
    if (attackType === "SSH-Patator") {
      return <SSHPatatorVisSection data={data} />;
    }
    if (attackType === "DDoS") {
      return <DDOSVisSection data={data} />;
    }
    if (attackType === "Portscan") {
      return <PortscanVisSection data={data} />;
    }
    if (attackType === "DoS Hulk") {
      return <DosHulkVisSection data={data} />;
    }
    if (attackType === "DoS Slowloris") {
      return <DoSSlowlorisVisSection data={data} />;
    }
    return null;
  };

  return (
    <div
      className="w-full rounded-lg shadow-sm bg-white p-6 mt-6"
      id="attack-visualizations"
    >
      <h2 className="text-xl font-bold mb-4">Attack Specific Visualizations</h2>
      <Tabs
        activeTab={activeTab}
        setActiveTab={setActiveTab as (tab: string) => void}
        id="attack-visualizations-tabs-buttons"
      >
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