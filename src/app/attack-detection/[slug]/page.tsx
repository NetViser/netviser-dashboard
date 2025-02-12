"use client";

import Spinner from "@/components/loader/spinner";
import { useSessionStore } from "@/store/session";
import { fetchDashboard } from "@/utils/client/fetchDashboard";
import { fetchAttackDetectionRecord } from "@/utils/client/fetchAttackDetectionRecord";
import { fetchSpecificAttackDetection } from "@/utils/client/fetchAttackDetectionVis";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import useSWR from "swr";
import { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";

import { AttackRecordsSection } from "./attack-records-section";
import { AttackVisualizationsSection } from "./attack-visualizations-section";
import { ExplainabilitySelector } from "@/components/ui/select";
import { XAIModal } from "@/components/attack-detection/xai/xai-modal";
import { AttackXAISection } from "./attack-xai-section";

export default function Page() {
  const router = useRouter();
  const params = useParams(); // Access dynamic route params
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const slugName = params?.slug || "";
  const attackType = decodeURIComponent(slugName as string);
  const { setActiveSession } = useSessionStore();

  const [explainabilityMode, setExplainabilityMode] = useState<
    "Visualization" | "XAI"
  >("Visualization");

  const [showXaiModal, setShowXaiModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  // -- Data Fetching

  // Attack Records
  const {
    data: attackRecords,
    isLoading: isLoadingAttackRecords,
    error: attackRecordsError,
  } = useSWR(
    `/attack_record?type=${attackType}&page=${page}&page_size=${pageSize}`,
    () => fetchAttackDetectionRecord(attackType, page, pageSize),
    {
      shouldRetryOnError: false,
      keepPreviousData: true,
      onError: handleSessionExpired,
    }
  );

  // Attack Visualizations
  const {
    data: attackVisualizations,
    isLoading: isLoadingVisualizations,
    error: attackVisualsError,
  } = useSWR(
    `/attack_visuals?type=${attackType}`,
    () => fetchSpecificAttackDetection(attackType),
    {
      shouldRetryOnError: false,
      keepPreviousData: true,
      onError: handleSessionExpired,
    }
  );

  // Common error handler for session expiry
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

  // -- Handling UI state / events
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPage(1);
    setPageSize(newPageSize);
  };

  const handleExplainabilityModeChange = (value: string) => {
    setExplainabilityMode(value as "Visualization" | "XAI");
  };

  const handleShowXAI = (rowId: number) => {
    setSelectedRow(rowId);
    setShowXaiModal(true);
  };

  if (isLoadingAttackRecords || isLoadingVisualizations) {
    return (
      <div className="h-screen bg-transparent flex flex-col items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // -- Render
  return (
    <div className="h-full pt-4 px-6 bg-stone-100 mb-8">
      {/* Header */}
      <div className="flex justify-between items-center w-full mb-2">
        <div className="flex items-center transition-all duration-200 ease-in-out">
          <IoMdArrowRoundBack
            className="text-stone-400 hover:text-stone-500 mr-2 cursor-pointer transition-transform duration-200 ease-in-out hover:-translate-x-0.5"
            onClick={() => router.back()}
            size={30}
          />
          <h1 className="text-2xl font-bold">
            Attack Detection /{" "}
            <span className="text-orange-500">{attackType}</span>
          </h1>
        </div>

        {/* Explainability Mode Selector */}
        <ExplainabilitySelector onSelect={handleExplainabilityModeChange} />
      </div>

      {/* Attack Records Table */}
      <AttackRecordsSection
        attackRecords={attackRecords}
        attackType={attackType}
        explainabilityMode={explainabilityMode}
        page={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onShowXAI={handleShowXAI}
      />

      {/* XAI Modal (if needed) */}
      {showXaiModal && selectedRow !== null && (
        <XAIModal
          open={showXaiModal}
          attackType={attackType}
          onOpenChange={setShowXaiModal}
          selectedRow={selectedRow}
        />
      )}

      {/* Conditional Attack Visualizations */}
      {explainabilityMode === "Visualization" && (
        <AttackVisualizationsSection
          attackVisualizations={attackVisualizations}
        />
      )}
      {/* Conditional render XAI section */}
      {explainabilityMode === "XAI" && (
        <AttackXAISection attackType={attackType} />
      )}
    </div>
  );
}
