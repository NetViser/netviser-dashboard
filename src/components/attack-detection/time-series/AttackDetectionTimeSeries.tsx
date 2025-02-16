"use client";

import React from "react";
import useSWR from "swr";
import {
  fetchAttackDetectionTimeSeries,
  FetchTimeSeriesAttackDataResponse,
} from "@/utils/client/fetchAttackDetectionTimeSeries";
import Skeleton from "react-loading-skeleton";
import AttackTimeSeriesChart from "@/components/chart/time-series/attack-time-series";

type AttackDetectionTimeSeriesProps = {
  attackType: string;
};

export default function AttackDetectionTimeSeries({
  attackType,
}: AttackDetectionTimeSeriesProps) {
  const { data, isLoading } = useSWR<FetchTimeSeriesAttackDataResponse>(
    `/api/attack-detection/visualization/attack-time-series?attack_type=${attackType}`,
    () => fetchAttackDetectionTimeSeries(attackType),
    {
      // Optional SWR config
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  if (isLoading) {
    // You can show a skeleton or loading spinner here
    return (
      <Skeleton
        style={{
          padding: "1rem",
          borderRadius: "8px",
          height: "4rem",
          marginTop: "1rem",
        }}
        count={4}
        width="100%"
      />
    );
  }

  if (!data) {
    return <div>No data available.</div>;
  }

  // At this point, data is AttackTimeSeriesResponse
  const { data: timeSeriesData, highlight } = data;
  const { timestamps, values, attackMarkPoint, otherAttackMarkPoint, feature } =
    timeSeriesData;

  // Example rendering
  return (
    <div>
      <AttackTimeSeriesChart attackType={attackType} data={timeSeriesData} highlight={highlight} />
    </div>
  );
}
