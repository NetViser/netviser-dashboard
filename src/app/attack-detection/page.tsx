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

export default function AttackDetectionPage() {
  const extractFileName = (name: string) => {
    console.log(name);
    const [, , ...words] = name.split("/");
    return words.join("/");
  };

  const router = useRouter();
  const { setActiveSession, sessionID } = useSessionStore();

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
      numberOfAttacks: data.detected_attacks_distribution[key],
      description:
        "Overwhelms a website or server with a flood of traffic, making it inaccessible to real users.",
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
      <div className="flex items-center gap-3">
        <span className="text-lg font-medium text-gray-500">Analyzing:</span>
        <span className="px-4 py-2 text-gray-700 bg-white rounded-lg shadow-sm ring-1 ring-gray-200/50">
          {data ? extractFileName(data?.file_name) : "Unknown"}
        </span>
      </div>
      <div className="w-full mt-6 mb-8 border-b-2 border-gray-200" />

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
