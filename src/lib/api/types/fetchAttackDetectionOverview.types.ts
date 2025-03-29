// Type for a Sankey node
export type SankeyNode = {
  name: string;
};

// Type for a Sankey link
export type SankeyLink = {
  source: string;
  target: string;
  value: number;
};

// Type for Sankey data
export type SankeyData = {
  nodes: SankeyNode[];
  links: SankeyLink[];
  nodeMapping: Record<string, "Source IP" | "Source Port" | "Dst Port">;
};

// Type for the means data (normal or attack)
export type MeansData = {
  flowBytesPerSecond?: number;
  flowDuration?: number;
  flowPacketsPerSecond?: number;
  averagePacketSize?: number;
  totalFwdPacket?: number;
  totalBwdPacket?: number;
  totalLengthOfFwdPacket?: number;
  totalTCPFlowTime?: number;
  bwdpacketlengthstd?: number;
  bwdIATMean?: number;
  bwdInitWinBytes?: number;
  fwdPacketLengthMax?: number;
  fwdPSHFlags?: number;
  protocol?: number;
  packetlengthmean?: number;
  synflagcount?: number;
  ackflagcount?: number;
  subflowfwdbytes?: number;
  [key: string]: number | undefined; // Allow for additional numeric fields
};

// Type for the full response
export type FetchSpecificAttackResponse = {
  means: {
    normal: MeansData;
    attack: MeansData;
  };
  sankeyData: SankeyData;
  uniqueSrcIps: {
    normal: number;
    attack: number;
  };
  uniqueDstPorts: {
    normal: number;
    attack: number;
  };
  uniqueSrcPorts: {
    normal: number;
    attack: number;
  };
};
