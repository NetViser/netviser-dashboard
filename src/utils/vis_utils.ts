export type SankeyNode = { name: string };
export type SankeyLink = { source: string; target: string; value: number };

// Update the SankeyData type to include the node mapping
export type SankeyData = {
  nodes: SankeyNode[];
  links: SankeyLink[];
  // Maps each node name to its type: "Source IP", "Source Port", or "Dst Port"
  nodeMapping: Record<string, "Source IP" | "Source Port" | "Dst Port">;
};
