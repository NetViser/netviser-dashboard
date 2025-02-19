import axios from "axios";
import timeseriesattackdata from "@/mocks/attackTimeSeriesData.json";

export interface DataSchema {
  /**
   * Parallel array of ISO8601 date/time strings
   */
  timestamps: string[];

  /**
   * Parallel array of numeric values (e.g., Flow Bytes/s means)
   */
  values: number[];

  /**
   * Array of [timestamp, value] for user-specified attacks
   */
  attackMarkPoint: Array<[string, number]>;

  /**
   * Array of [timestamp, value] for other attacks
   */
  otherAttackMarkPoint: Array<[string, number]>;

  /**
   * E.g. "Flow Bytes/s"
   */
  feature: string;
}

export interface HighlightItem {
  /**
   * The name of the attack type (e.g. "DDoS" or "otherAttack")
   */
  name?: string;

  /**
   * The xAxis value, in ISO8601 format
   */
  xAxis: string;
}

export interface PartitionBoundary {
  /**
   * Start timestamp of the partition
   */
  start: string;

  /**
   * End timestamp of the partition
   */
  end: string;
}

export type FetchTimeSeriesAttackDataResponse = {
  /**
   * Main data for charting
   */
  data: DataSchema;

  /**
   * Array of highlight intervals (two items per interval)
   */
  highlight: HighlightItem[][];

  /**
   * Partition boundaries in the response
   */
  partitions: PartitionBoundary[];

  /**
   * The current partition index, if available
   */
  current_partition_index?: number;
};


export const FETCH_ATTACK_DETECTION_TIME_SERIES_API_URL =
  "http://localhost:8000/api/attack-detection/visualization/attack-time-series";

export async function fetchAttackDetectionTimeSeries(
  attackType: string,
  partitionIndex: number = 0
): Promise<FetchTimeSeriesAttackDataResponse> {
  try {
    const searchParams = new URLSearchParams({
      attack_type: attackType,
      partition_index: String(partitionIndex),
    });

    const url = `${FETCH_ATTACK_DETECTION_TIME_SERIES_API_URL}?${searchParams.toString()}`;

    await new Promise((resolve) => setTimeout(resolve, 10000));
    const response = await axios.get<FetchTimeSeriesAttackDataResponse>(url, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching attack detection time series data:", error);
    throw new Error("Failed to fetch attack detection time series data.");
  }
}

// export const fetchAttackDetectionTimeSeries = async (
//   attackType: string
// ): Promise<FetchTimeSeriesAttackDataResponse> => {
//   // Simulate a network delay of 1 second
//   await new Promise((resolve) => setTimeout(resolve, 1000));

//   // Returning the imported mock data instead of making an API call
//   return Promise.resolve(
//     timeseriesattackdata as FetchTimeSeriesAttackDataResponse
//   );
// };
