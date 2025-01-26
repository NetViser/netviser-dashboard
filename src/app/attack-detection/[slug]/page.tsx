"use client";
import Spinner from "@/components/loader/spinner";
import { useSessionStore } from "@/store/session";
import { fetchDashboard } from "@/utils/client/fetchDashboard";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import useSWR from "swr";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useState } from "react";
import {
  API_URL,
  AttackRecord,
  fetchAttackDetectionRecord,
} from "@/utils/client/fetchAttackDetectionRecord";

export default function Page() {
  const router = useRouter();
  const params = useParams(); // Access dynamic route params
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const slugName = params?.slug || "";
  const attackType = decodeURIComponent(slugName as string);
  const { setActiveSession, isActiveSession } = useSessionStore();

  const { data: attackRecords, isLoading: isLoadingAttackRecords } = useSWR(
    `${API_URL}?attack_type=${attackType}&page=${page}&page_size=${pageSize}`,
    () =>
      fetchAttackDetectionRecord(attackType, page, pageSize),
    {
      shouldRetryOnError: false,
      keepPreviousData: true,
      onError: async (error) => {
        await Swal.fire({
          icon: "error",
          title: "Session Expired",
          confirmButtonText: "OK",
          timer: 3000,
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

  console.log("records", attackRecords);

  const { data, isLoading: isLoadingDashboard } = useSWR(
    "/api/dashboard",
    fetchDashboard,
    {
      shouldRetryOnError: false,
      onError: async (error) => {
        await Swal.fire({
          icon: "error",
          title: "Session Expired",
          confirmButtonText: "OK",
          timer: 3000,
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
  const extractFileName = (name: string) => {
    console.log(name);
    const [, , ...words] = name.split("/");
    return decodeURIComponent(words.join("/")); // Decodes URL-encoded strings
  };
  // Get the slug name from params


  if (isLoadingAttackRecords || isLoadingDashboard) {
    return (
      <div className="h-screen bg-transparent flex flex-col items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPage(1);
    setPageSize(newPageSize);
  }

  return (
    <div className="h-full pt-4 px-6 bg-stone-100 mb-8">
      {/* Header Section */}
      <div className="flex flex-col items-start w-full">
        <div className="text-2xl font-bold">{`Attack Detection / ${attackType}`}</div>
        <div className="text-xl font-medium mb-6 text-gray-500">
          {data ? extractFileName(data?.file_name) : "Unknown"}
        </div>
      </div>
      {/* Table Section */}
      <div className="w-full rounded-lg shadow-sm bg-white p-6">
        <h2 className="text-xl font-bold mb-4">Detected Attacks Records</h2>
        <DataTable
          columns={columns}
          data={(attackRecords?.attack_data as AttackRecord[]) || []}
          totalPages={attackRecords?.total_pages || 0}
          pageSize={pageSize}
          currentPage={page}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}
