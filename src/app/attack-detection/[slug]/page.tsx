"use client";
import Spinner from "@/components/loader/spinner";
import { useSessionStore } from "@/store/session";
import { fetchDashboard } from "@/utils/client/fetchDashboard";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import useSWR from "swr";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useMemo, useState } from "react";
import {
  API_URL,
  AttackRecord,
  fetchAttackDetectionRecord,
} from "@/utils/client/fetchAttackDetectionRecord";
import {
  SPECIFIC_ATTACK_API_URL,
  SpecificAttackRecord,
  fetchSpecificAttackDetection,
} from "@/utils/client/fetchAttackDetectionVis";
import FTPBoxPlot from "@/components/chart/ftp/boxplot";
import FTPSankey from "@/components/chart/ftp/sankey";
import FTPScatterChart from "@/components/chart/ftp/scatter";

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
    () => fetchAttackDetectionRecord(attackType, page, pageSize),
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

  const { data: attackVisualizations, isLoading: isLoadingVisualizations } =
    useSWR(
      `${SPECIFIC_ATTACK_API_URL}?attack_type=${attackType}`,
      () => fetchSpecificAttackDetection(attackType),
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

  const ftpBoxPlotFlowBytesPerSecondData = useMemo(() => {
    const normalData = attackVisualizations?.normalData || [];
    const attackData = attackVisualizations?.attackData || [];

    const normalFlowBytesPerSecond = normalData.map(
      (record) => record.flowBytesPerSecond
    );
    const attackFlowBytesPerSecond = attackData.map(
      (record) => record.flowBytesPerSecond
    );

    console.log("FUCCKK", [
      {
        name: "Normal",
        data: normalFlowBytesPerSecond,
      },
      {
        name: "Attack",
        data: attackFlowBytesPerSecond,
      },
    ]);

    return [
      {
        name: "Normal",
        data: normalFlowBytesPerSecond,
        color: "#4CAF50", // Green
      },
      {
        name: "Attack",
        data: attackFlowBytesPerSecond,
        color: "#F44336", // Red
      },
    ];
  }, [attackVisualizations]);

  console.log(attackVisualizations);

  const ftpSankeyData = useMemo(() => {
    const attackData = attackVisualizations?.attackData || [];
  
    const nodes = Array.from(
      new Set(
        attackData.flatMap((record) => [String(record.srcPort), String(record.dstPort)])
      )
    ).map((name) => ({ name }));
    
    // Ensure srcPort and dstPort are strings
    const links = attackData.map((record) => ({
      source: String(record.srcPort),
      target: String(record.dstPort),
      value: record.portPairCount,
    }));

    console.log("Sankey Data", links);
  
    return {
      nodes,
      links, // Use the properly mapped links
    };
  }, [attackVisualizations]);

  console.log("Sankey Data", ftpSankeyData);

  const ftpScatterData = useMemo(() => {
    const normalData = attackVisualizations?.normalData || [];
    const attackData = attackVisualizations?.attackData || [];

    const normalFlowBytesPerSecond = normalData.map(
      (record) => record.averagePacketSize
    );
    const attackFlowBytesPerSecond = attackData.map(
      (record) => record.averagePacketSize
    );

    return {
      normalData: normalFlowBytesPerSecond,
      attackData: attackFlowBytesPerSecond,
    };
  }, [attackVisualizations]);

  const ftpBoxplotFlowDuration = useMemo(() => {
    const normalData = attackVisualizations?.normalData || [];
    const attackData = attackVisualizations?.attackData || [];

    const normalFlowDuration = normalData.map(
      (record) => record.flowDuration
    );
    const attackFlowDuration = attackData.map(
      (record) => record.flowDuration
    );

    return [
      {
        name: "Normal",
        data: normalFlowDuration,
        color: "#4CAF50", // Green
      },
      {
        name: "Attack",
        data: attackFlowDuration,
        color: "#F44336", // Red
      },
    ];
  }, [attackVisualizations]);
  

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

  if (isLoadingAttackRecords || isLoadingDashboard || isLoadingVisualizations) {
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
  };

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

      {/* Attack Specific Visualization Section */}
      <div className="w-full rounded-lg shadow-sm bg-white p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">
          Attack Specific Visualizations
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Visualization Row 1 */}
          <div className="p-6 rounded-lg border-2 flex flex-col">
            <FTPBoxPlot
              chartTitle="Distribution of Flow Bytes Per Second (Normal vs Attack)"
              yAxisName="Flow Bytes Per Second"
              groups={ftpBoxPlotFlowBytesPerSecondData}
            />
          </div>

          <div className="bg-white p-6 rounded-lg border-2 shadow-sm flex flex-col">
            <FTPSankey 
              apidata={ftpSankeyData}
            />
          </div>

          {/* Visualization Row 2 */}
          <div className="bg-white p-6 rounded-lg border-2 shadow-sm flex flex-col">
            <h3 className="font-semibold mb-2">Average Packet Size</h3>
            <FTPScatterChart 
              normalData={ftpScatterData.normalData}
              attackData={ftpScatterData.attackData}
            />
          </div>

          <div className="bg-white p-6 rounded-lg border-2 shadow-sm flex flex-col">
            <h3 className="font-semibold mb-2">Flow Duration</h3>
            <FTPBoxPlot
              chartTitle="Distribution of Flow Duration (Normal vs Attack)"
              yAxisName="Flow Duration"
              groups={ftpBoxplotFlowDuration}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
