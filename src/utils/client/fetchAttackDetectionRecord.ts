import axios from "axios";

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

type FetchAttackRecordsResponse = {
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

export const API_URL = "http://localhost:8000/api/attack-detection/records";

export async function fetchAttackDetectionRecord(
    attackType: string,
    page: number,
    pageSize: number
): Promise<FetchAttackRecordsResponse> {
    try {
      // TODO: REMOVE FORCING ATTACK TYPE to BENIGN
      const response = await axios.get<FetchAttackRecordsResponse>(API_URL, {
        params: {
          attack_type: attackType,
          page,
          page_size: pageSize,
        },
        withCredentials: true, // Ensure session cookies are sent
      });
  
      return response.data; // Return the API response data
    } catch (error) {
      console.error("Error fetching attack detection records:", error);
      throw new Error("Failed to fetch attack detection records.");
    }
  }