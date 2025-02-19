"use client";

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import {
  fetchAttackDetectionTimeSeries,
  FetchTimeSeriesAttackDataResponse,
} from "@/utils/client/fetchAttackDetectionTimeSeries";
import Skeleton from "react-loading-skeleton";
import AttackTimeSeriesChart from "@/components/chart/time-series/attack-time-series";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import moment from "moment";

type AttackDetectionTimeSeriesProps = {
  attackType: string;
};

export default function AttackDetectionTimeSeries({
  attackType,
}: AttackDetectionTimeSeriesProps) {
  const [selectedPartitionIndex, setSelectedPartitionIndex] =
    useState<number>(0); // Default to the first partition

  const { data, isLoading, mutate } = useSWR<FetchTimeSeriesAttackDataResponse>(
    `/api/attack-detection/visualization/attack-time-series?attack_type=${attackType}&partition_index=${selectedPartitionIndex}`,
    () => fetchAttackDetectionTimeSeries(attackType, selectedPartitionIndex),
    {
      // Optional SWR config
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  useEffect(() => {
    if (data) {
      setSelectedPartitionIndex(data.current_partition_index || 0); // Ensure the default partition is selected if available
    }
  }, [data]);

  const handlePartitionChange = (value: string) => {
    const partitionIndex = parseInt(value, 10);
    setSelectedPartitionIndex(partitionIndex); // Update the partition index
    mutate(); // Refetch data with new partition index
  };

  if (isLoading) {
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
  const { data: timeSeriesData, highlight, partitions } = data;
  const { timestamps, values, attackMarkPoint, otherAttackMarkPoint, feature } =
    timeSeriesData;

  // Create options for the Select dropdown, showing start and end time
  const partitionOptions = partitions.map((partition, index) => {
    const { start, end } = partition; // Get start and end times
    const startDate = moment(start).format("YYYY-MM-DD HH:mm:ss"); // Format the start time with Moment.js
    const endDate = moment(end).format("YYYY-MM-DD HH:mm:ss"); // Format the end time with Moment.js

    return (
      <SelectItem key={index} value={String(index)}>
        {`Partition ${index + 1} (${startDate} - ${endDate})`}{" "}
        {/* Show partition index and formatted time */}
      </SelectItem>
    );
  });

  return (
    <div className="flex flex-col items-start gap-y-4 w-full">
      {/* Partition Selection */}
      <div className="flex items-center">
        <label className="mr-2 text-md font-semibold whitespace-nowrap">
          Select Partition:
        </label>
        <Select
          onValueChange={handlePartitionChange}
          value={String(selectedPartitionIndex)}
        >
          <SelectTrigger className="text-md bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-700">
            <SelectValue placeholder="Select a partition" />
          </SelectTrigger>
          <SelectContent className="bg-orange-500 text-white">
            {partitionOptions}
          </SelectContent>
        </Select>
      </div>

      {/* Chart */}
      <div className="w-full">
        <AttackTimeSeriesChart
          attackType={attackType}
          data={timeSeriesData}
          highlight={highlight}
        />
      </div>
    </div>
  );
}
