// File: src/lib/vis_utils.ts

import { SpecificAttackRecord } from "@/utils/client/fetchAttackDetectionVis";

export type SankeyNode = { name: string };
export type SankeyLink = { source: string; target: string; value: number };

// Update the SankeyData type to include the node mapping
export type SankeyData = {
  nodes: SankeyNode[];
  links: SankeyLink[];
  // Maps each node name to its type: "Source IP", "Source Port", or "Dst Port"
  nodeMapping: Record<string, "Source IP" | "Source Port" | "Dst Port">;
};

/**
 * Generates Sankey diagram data from attack detection records.
 *
 * The function:
 * - Slices the attack data to a given count for clarity.
 * - Creates unique nodes from the attack records’ srcIp, srcPort, and dstIp fields.
 * - Generates links:
 *    • From srcIp to srcPort (using srcIpPortPairCount).
 *    • From srcPort to dstIp (using portPairCount).
 * - Also builds a mapping of each node to its type.
 *
 * @param data - Attack detection data (with normalData and attackData).
 * @param sliceCount - Maximum number of attack records to use (default is 10).
 * @returns SankeyData object with nodes, links, and a nodeMapping.
 */
export function generateAttackSankeyData(
  data: { normalData: SpecificAttackRecord[]; attackData: SpecificAttackRecord[] } | undefined,
  sliceCount: number = 10
): SankeyData {
  if (!data) return { nodes: [], links: [], nodeMapping: {} };

  // Limit the attack data to the desired slice count
  let { attackData } = data;
  attackData = attackData.slice(0, sliceCount);

  // Create a mapping for each node based on the record's fields.
  // If a node appears, assign it a type from the field it comes from.
  const nodeMapping: Record<string, "Source IP" | "Source Port" | "Dst Port"> = {};
  attackData.forEach((record) => {
    const srcIp = String(record.srcIp);
    const srcPort = String(record.srcPort);
    const dstPort = String(record.dstPort);

    if (!nodeMapping[srcIp]) nodeMapping[srcIp] = "Source IP";
    if (!nodeMapping[srcPort]) nodeMapping[srcPort] = "Source Port";
    if (!nodeMapping[dstPort]) nodeMapping[dstPort] = "Dst Port";
  });

  // Generate a unique set of nodes from srcIp, srcPort, and dstIp
  const nodesSet = new Set<string>();
  attackData.forEach((record) => {
    nodesSet.add(String(record.srcIp));
    nodesSet.add(String(record.srcPort));
    nodesSet.add(String(record.dstPort));
  });
  const nodes = Array.from(nodesSet).map((name) => ({ name }));

  // Create links:
  // 1. From srcIp to srcPort using srcIpPortPairCount.
  // 2. From srcPort to dstIp using portPairCount.
  const srcIpLinks = attackData.map((record) => ({
    source: String(record.srcIp),
    target: String(record.srcPort),
    value: record.srcIpPortPairCount,
  }));
  const portLinks = attackData.map((record) => ({
    source: String(record.srcPort),
    target: String(record.dstPort),
    value: record.portPairCount,
  }));

  return {
    nodes,
    links: [...srcIpLinks, ...portLinks],
    nodeMapping,
  };
}
