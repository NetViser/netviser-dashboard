"use client";

import Spinner from "@/components/loader/spinner";
import { useSessionStore } from "@/store/sessionStore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useLocalStorage } from "react-use";
import { AttackRecordsSection } from "../../../components/table/attackRecordTable/AttackRecordsSection";
import AttackSpecificVisualizationsSection from "@/features/specificAttackVisualization/components/AttackSpecificVisualizationsSection";
import { ExplainabilitySelector } from "@/components/ui/select";
import ForcePlotModal from "@/features/specificAttackXAI/components/ForcePlotModal";
import AttackXAISection from "@/features/specificAttackXAI/components/AttackXAISection";
import AttackTour from "@/features/guideTour/components/SpecificAttackVisualizationTour";
import XAITour from "@/features/guideTour/components/SpecificAttackXAITour";
import { attackTypeDescription } from "@/utils/attackTypeDescriptions";

import AttackDescriptionBox from "@/features/specificAttackVisualization/components/AttackDescriptionBox";
import PageTitleFooter from "@/components/layout/page-title-footer";
import { useLoadingStore } from "@/store/loadingStore";
import { useAttackDetectionRecords } from "@/hooks/api/useAttackDetectionRecords";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const slugName = params?.slug || "";
  const attackType = decodeURIComponent(slugName as string);
  const { networkFileName } = useSessionStore();
  // Use a dynamic local storage key for explainability mode based on the attack type.
  const explainabilityKey = `explainability-mode-${attackType}`;
  const [explainabilityMode, setExplainabilityMode] = useLocalStorage(
    explainabilityKey,
    "Visualization"
  );
  const localStorageKey = `attack-visualizations-active-tab-${attackType}`;
  const [activeTab, setActiveTab] = useLocalStorage(localStorageKey, "overall");

  const [showXaiModal, setShowXaiModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  // Fetch attack records
  const { attackRecords, isLoading: isLoadingAttackRecords } =
    useAttackDetectionRecords({
      attackType,
      page,
      pageSize,
    });

  const { isLoading, setLoading } = useLoadingStore();

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

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

  if (isLoadingAttackRecords) {
    return (
      <div className="h-screen bg-transparent flex flex-col items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Find the current attack description from the list
  const currentAttackDescription = attackTypeDescription.find(
    (desc) => desc.attackType === attackType
  );

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
          <h1
            id="specific-attack-detection-title"
            className="text-2xl font-bold"
          >
            Attack Detection /{" "}
            <span className="text-orange-500">{attackType}</span>
          </h1>
          {explainabilityMode === "Visualization" && (
            <AttackTour tourType={activeTab as any} />
          )}
          {explainabilityMode === "XAI" && <XAITour />}
        </div>

        {/* Explainability Mode Selector */}
        <ExplainabilitySelector
          onSelect={handleExplainabilityModeChange}
          value={explainabilityMode!}
        />
      </div>

      {/* Analyzing Section */}
      <PageTitleFooter fileName={networkFileName} />

      {/* Attack Description Message Box */}
      {currentAttackDescription && (
        <div className="my-6">
          <AttackDescriptionBox
            attackType={currentAttackDescription.attackType}
            description={currentAttackDescription.description}
          />
        </div>
      )}

      {/* Attack Records Table */}
      <AttackRecordsSection
        attackRecords={attackRecords}
        attackType={attackType}
        explainabilityMode={explainabilityMode as any}
        page={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onShowXAI={handleShowXAI}
      />

      {/* XAI Modal (if needed) */}
      {showXaiModal && selectedRow !== null && (
        <ForcePlotModal
          open={showXaiModal}
          attackType={attackType}
          onOpenChange={setShowXaiModal}
          selectedRow={selectedRow}
        />
      )}

      {/* Conditional Attack Visualizations */}
      {explainabilityMode === "Visualization" && (
        <AttackSpecificVisualizationsSection
          attackType={attackType}
          activeTab={activeTab as "overall" | "timeseries"}
          setActiveTab={setActiveTab}
        />
      )}

      {/* Conditional render XAI section */}
      {explainabilityMode === "XAI" && (
        <AttackXAISection attackType={attackType} />
      )}
    </div>
  );
}
