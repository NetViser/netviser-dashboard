import { customFetch } from "@/lib/api/fetchClient";

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

  /**
   * E.g. "seconds"
   */
  feature_unit: string;

  /**
   * Array of [timestamp, value] for FTP-Patator port 20 events
   */
  port20MarkPoint?: Array<[string, number]>;

  /**
   * Array of [timestamp, value] for FTP-Patator port 21 events
   */
  port21MarkPoint?: Array<[string, number]>;

  /**
   * Array of [timestamp, value] for SSH-Patator port 22 events
   */
  port22MarkPoint?: Array<[string, number]>;
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

export interface FetchTimeSeriesAttackDataResponse {
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
   * List of available features for the attack type
   */
  features: string[];

  /**
   * The current partition index, if available
   */
  current_partition_index?: number;
}

export const FETCH_ATTACK_DETECTION_TIME_SERIES_API_URL =
  "/api/attack-detection/visualization/attack-time-series";

export async function fetchAttackDetectionTimeSeries(
  attackType: string,
  partitionIndex: number = 0,
  featureName?: string // Optional featureName parameter
): Promise<FetchTimeSeriesAttackDataResponse> {
  try {
    const params = new URLSearchParams({
      attack_type: attackType,
      partition_index: String(partitionIndex),
    });

    if (featureName) {
      params.append("feature_name", featureName);
    }

    const url = `${FETCH_ATTACK_DETECTION_TIME_SERIES_API_URL}?${params.toString()}`;

    const data = await customFetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return data as FetchTimeSeriesAttackDataResponse;
  } catch (error) {
    console.error("Error fetching attack detection time series data:", error);
    throw new Error("Failed to fetch attack detection time series data.");
  }
}
