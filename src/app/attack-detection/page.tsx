"use client";

import Spinner from "@/components/loader/spinner";
import { fetchDashboard } from "@/utils/client/fetchDashboard";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useSessionStore } from "@/store/session";
import AttacksTable from "@/components/attack-detection/attacks-table/attacks-table";
import { useMemo, useState } from "react";
import AttacksScatter from "@/components/attack-detection/attacks-scatter/attacks-scatter";
import { fetchAttackDetectionScatter } from "@/utils/client/fetchAttackDetectionScatter";

export default function AttackDetectionPage() {
  const [selectedAttackType, setSelectedAttackType] = useState<string | null>(
    null
  );
  const extractFileName = (name: string) => {
    console.log(name);
    const [, , ...words] = name.split("/");
    return words.join("/");
  };

  const router = useRouter();
  const { setActiveSession, isActiveSession } = useSessionStore();

  const { data, isLoading } = useSWR("/api/dashboard", fetchDashboard, {
    shouldRetryOnError: false,
    onError: async (error) => {
      await Swal.fire({
        icon: "error",
        title: "Session Expired",
        confirmButtonText: "OK",
        timer: 1000,
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      console.error("Failed to get file name:", error);
      setActiveSession(false);
      router.push("/");
    },
  });

  const { data: scatterData, isLoading: scatterIsLoading } = useSWR(
    selectedAttackType
      ? `/api/attack-detection/brief/scatter?attack_type=${selectedAttackType}`
      : null,
    () => fetchAttackDetectionScatter(selectedAttackType || ""),
    {
      shouldRetryOnError: false,
      onError: async (error) => {
        await Swal.fire({
          icon: "error",
          title: "Session Expired",
          confirmButtonText: "OK",
          timer: 1000,
          timerProgressBar: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        console.error("Failed to get attack detection scatter data:", error);
        setActiveSession(false);
        router.push("/");
      },
    }
  );

  const tableData = useMemo(() => {
    if (!data) return [];
    return Object.keys(data.detected_attacks_distribution).map((key) => ({
      attackType: key,
      numberOfAttacks: data.detected_attacks_distribution[key],
      description:
        "Overwhelms a website or server with a flood of traffic, making it inaccessible to real users.",
      onAttackTypeClick: (attackType: string) => {
        if (selectedAttackType === attackType) {
          setSelectedAttackType(null);
          return;
        }
        setSelectedAttackType(attackType);
      },
      isSelected: selectedAttackType === key,
    }));
  }, [data, isLoading, selectedAttackType]);

  if (isLoading) {
    return (
      <div className="h-screen bg-transparent flex flex-col items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="h-full pt-4 px-6 bg-stone-100 mb-8">
      {/* Header Section */}
      <div className="flex flex-col items-start w-full">
        <div className="text-2xl font-bold">Attack Detection</div>
        <div className="text-xl font-medium mb-6 text-gray-500">
          {data ? extractFileName(data?.file_name) : "Unknown"}
        </div>
      </div>

      <div className="flex flex-col gap-y-6">
        {/* Attacks Table */}
        <AttacksTable
          data={tableData}
          onAnalyze={(attackType: string) => {
            router.push(`/attack-detection/${attackType}`);
          }}
        />

        {/* Attack Scatter Plot */}
        {selectedAttackType ? (
          <AttacksScatter
            title="Network Traffic Scatter Plot"
            attackName={selectedAttackType || ""}
            feature={scatterData?.feature_name || ""}
            attackData={scatterData?.attack_data || []}
            benignData={scatterData?.benign_data || []}
            isLoading={scatterIsLoading}
          />
        ) : null}
      </div>
    </div>
  );
}
