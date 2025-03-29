"use client";

import Spinner from "@/components/loader/spinner";
import { useSessionStore } from "@/store/sessionStore";
import { useDashboardData } from "@/hooks/api/useDashboardData";
import DataSummaryCardList from "@/features/dashboard/components/DataSummaryCardList";
import DashboardChartsSection from "@/features/dashboard/components/DashboardChartsSection";
import DashBoardTour from "@/features/guideTour/components/DashboardTour";
import PageTitleFooter from "@/components/layout/page-title-footer";

export default function DashboardPage() {
  const { networkFileName } = useSessionStore();
  const { data, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="h-full px-8 py-6 bg-gray-50">
      {/* Header Section */}
      <div className="flex flex-col items-start w-full">
        <div className="flex items-center justify-between w-full mb-4">
          <h1 className="text-3xl font-bold text-gray-900" id="dashboard-title">
            Network Analytics Dashboard
          </h1>
          <DashBoardTour />
        </div>
        <PageTitleFooter fileName={networkFileName} />
      </div>

      <div className="flex flex-col gap-y-6 mb-4">
        <DataSummaryCardList data={data} />
        <DashboardChartsSection data={data} />
      </div>
    </div>
  );
}
