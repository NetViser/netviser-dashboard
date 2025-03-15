import { customFetch } from "@/utils/client/fetchClient";

export type SpecificAttackRecord = {
  timestamp: string;
  flowBytesPerSecond: number;
  flowDuration: number;
  flowPacketsPerSecond: number;
  averagePacketSize: number;
  totalFwdPacket: number;
  totalBwdPacket: number;
  totalLengthOfFwdPacket: number;
  totalTCPFlowTime: number;
  bwdpacketlengthstd: number;
  bwdIATMean: number;
  bwdInitWinBytes: number;
  fwdPacketLengthMax: number;
  fwdPSHFlags: number;
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

export type FetchSpecificAttackResponse = {
  normalData: SpecificAttackRecord[];
  attackData: SpecificAttackRecord[];
};

export async function fetchSpecificAttackDetection(
  attackType: string,
): Promise<FetchSpecificAttackResponse> {
  try {
    const params = new URLSearchParams({
      attack_type: attackType,
    });
    const url = `/api/attack-detection/specific?${params.toString()}`;

    const data = await customFetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return data as FetchSpecificAttackResponse;
  } catch (error) {
    console.error("Error fetching specific attack detection data:", error);
    throw new Error("Failed to fetch specific attack detection data.");
  }
}
