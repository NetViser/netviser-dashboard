"use client";

import Spinner from "@/components/loader/spinner";
import { fetchDashboard } from "@/utils/client/fetchDashboard";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useSessionStore } from "@/store/session";
import AttacksTable from "@/components/attack-detection/attacks-table/attacks-table";
import { useMemo } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import PageTitleFooter from "@/components/header/page-title-footer";

export default function AttackDetectionPage() {
  const router = useRouter();
  const { setActiveSession, sessionID, networkFileName } = useSessionStore();

  const { data, isLoading } = useSWR(
    `${sessionID}/api/dashboard`,
    fetchDashboard,
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
        console.error("Failed to get file name:", error);
        setActiveSession(false);
        router.push("/");
      },
    }
  );

  const tableData = useMemo(() => {
    if (!data) return [];
    return Object.keys(data.detected_attacks_distribution).map((key) => ({
      attackType: key,
      numberOfAttacks: data.detected_attacks_distribution[key]
    }));
  }, [data]);

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
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center">
          <IoMdArrowRoundBack
            className="text-gray-600 hover:text-gray-800 mr-2 cursor-pointer transition-transform duration-200 ease-in-out hover:-translate-x-0.5"
            onClick={() => router.back()}
            size={30}
          />
          <h1 className="text-3xl font-bold text-gray-900">Attack Detection</h1>
        </div>
      </div>
      <PageTitleFooter fileName={networkFileName} />

      <div className="flex flex-col gap-y-6">
        {/* Attacks Table */}
        <AttacksTable
          data={tableData}
          onAnalyze={(attackType: string) => {
            router.push(`/attack-detection/${attackType}`);
          }}
        />
      </div>
    </div>
  );
}
