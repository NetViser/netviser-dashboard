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
import { useSessionStore } from "@/store/session";

type AttackDetectionTimeSeriesProps = {
  attackType: string;
};

export default function AttackDetectionTimeSeries({
  attackType,
}: AttackDetectionTimeSeriesProps) {
  const [selectedPartitionIndex, setSelectedPartitionIndex] =
    useState<number>(0); // Default to the first partition
  const [selectedFeatureName, setSelectedFeatureName] = useState<string | null>(
    null
  ); // Default to no feature selected

  const { sessionID } = useSessionStore();
  const swrKey = `${sessionID}/api/attack-detection/visualization/attack-time-series?attack_type=${attackType}&partition_index=${selectedPartitionIndex}${
    selectedFeatureName ? `&feature_name=${selectedFeatureName}` : ""
  }`;

  const { data, isLoading, mutate } = useSWR<FetchTimeSeriesAttackDataResponse>(
    swrKey,
    () =>
      fetchAttackDetectionTimeSeries(
        attackType,
        selectedPartitionIndex,
        selectedFeatureName || undefined
      ),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  useEffect(() => {
    if (data) {
      setSelectedPartitionIndex(data.current_partition_index || 0);
      // If no feature is selected yet and features are available, default to the first one
      if (!selectedFeatureName && data.features?.length > 0) {
        setSelectedFeatureName(data.features[0]);
      }
    }
  }, [data, selectedFeatureName]);

  const handlePartitionChange = (value: string) => {
    const partitionIndex = parseInt(value, 10);
    setSelectedPartitionIndex(partitionIndex);
    mutate(); // Refetch data with new partition index
  };

  const handleFeatureChange = (value: string) => {
    setSelectedFeatureName(value);
    mutate(); // Refetch data with new feature name
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

  const { data: timeSeriesData, highlight, partitions, features } = data;
  const { timestamps, values, attackMarkPoint, otherAttackMarkPoint, feature, port21MarkPoint, port22MarkPoint } =
    timeSeriesData;

  // Create options for the Partition Select dropdown
  const partitionOptions = partitions?.map((partition, index) => {
    const { start, end } = partition;
    const startDate = moment(start).format("YYYY-MM-DD HH:mm:ss");
    const endDate = moment(end).format("YYYY-MM-DD HH:mm:ss");

    return (
      <SelectItem key={index} value={String(index)}>
        {`Partition ${index + 1} (${startDate} - ${endDate})`}
      </SelectItem>
    );
  });

  // Create options for the Feature Select dropdown with loading/undefined handling
  const featureOptions = features?.length ? (
    features.map((feat, index) => (
      <SelectItem key={index} value={feat}>
        {feat}
      </SelectItem>
    ))
  ) : (
    <SelectItem value="loading" disabled>
      Loading features...
    </SelectItem>
  );

  // Determine if port-specific filters should be enabled
  const enablePortFilters = attackType === "FTP-Patator" || attackType === "SSH-Patator";

  return (
    <div className="flex flex-col items-start gap-y-4 w-full">
      {/* Controls Container */}
      <div className="flex flex-row gap-6 w-full">
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

        {/* Feature Selection */}
        <div className="flex items-center">
          <label className="mr-2 text-md font-semibold whitespace-nowrap">
            Select Feature:
          </label>
          <Select
            onValueChange={handleFeatureChange}
            value={selectedFeatureName || ""}
            disabled={isLoading || !features?.length} // Disable if loading or no features
          >
            <SelectTrigger className="text-md bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-700">
              <SelectValue placeholder="Select a feature" />
            </SelectTrigger>
            <SelectContent className="bg-orange-500 text-white">
              {featureOptions}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full">
        <AttackTimeSeriesChart
          attackType={attackType}
          data={timeSeriesData}
          highlight={highlight}
          enablePortFilters={enablePortFilters} // Updated prop name for generality
        />
      </div>
    </div>
  );
}