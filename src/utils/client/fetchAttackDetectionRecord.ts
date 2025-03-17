import { customFetch } from "@/utils/client/fetchClient";

export type AttackRecord = {
  id: number;
  timestamp: string;
  flowBytesPerSecond: number;
  flowDuration: number;
  flowPacketsPerSecond: number;
  avgPacketSize: number;
  totalFwdPacket: number;
  totalLengthFwdPacket: number;
  protocol: number;
  srcIP: string;
  dstIP: string;
  srcPort: number;
  dstPort: number;
};

export type FetchAttackRecordsResponse = {
  attack_data: AttackRecord[];
  attack_type: string;
  has_next_page: boolean;
  has_previous_page: boolean;
  next_page: number;
  page: number;
  page_size: number;
  previous_page: number;
  total_pages: number;
  total_records: number;
};

export async function fetchAttackDetectionRecord(
  attackType: string,
  page: number,
  pageSize: number
): Promise<FetchAttackRecordsResponse> {
  try {
    const params = new URLSearchParams({
      attack_type: attackType,
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    const url = `/api/attack-detection/records?${params.toString()}`;

    const response = await customFetch(url);
    return response as FetchAttackRecordsResponse;
  } catch (error) {
    console.error("Error fetching attack detection records:", error);
    throw new Error("Failed to fetch attack detection records.");
  }
}
