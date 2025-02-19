import axios from "axios";

export type SpecificAttackRecord = {
  timestamp: string;
  flowBytesPerSecond: number;
  flowDuration: number;
  flowPacketsPerSecond: number;
  averagePacketSize: number;
  totalFwdPacket: number;
  totalBwdPacket: number;
  totalLengthOfFwdPacket: number;
  bwdpacketlengthstd: number;
  protocol: number;
  srcIp: string;
  dstIp: string;
  srcPort: number;
  dstPort: number;
  portPairCount: number;
  srcIpPortPairCount: number;
  packetlengthmean: number;
  synflagcount: number;
  ackflagcount: number;
  subflowfwdbytes: number;
  protocol_distribution: Record<string, number>;
};

type FetchSpecificAttackResponse = {
  normalData: SpecificAttackRecord[];
  attackData: SpecificAttackRecord[];
};

export const SPECIFIC_ATTACK_API_URL = "http://localhost:8000/api/attack-detection/specific";

export async function fetchSpecificAttackDetection(
  attackType: string,
): Promise<FetchSpecificAttackResponse> {
  try {
    const response = await axios.get<FetchSpecificAttackResponse>(SPECIFIC_ATTACK_API_URL, {
      params: {
        attack_type: attackType,
      },
      withCredentials: true, // Automatically sends cookies
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching specific attack detection data:", error);
    throw new Error("Failed to fetch specific attack detection data.");
  }
}