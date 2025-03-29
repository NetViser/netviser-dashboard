import { customFetch } from "@/lib/api/fetchClient";

export interface DashboardResponse {
  file_name: string;
  total_rows: number;
  total_detected_attacks: number;
  detected_attacks_distribution: Record<string, number>;
  src_ip_address_distribution: Record<string, number>;
  src_port_distribution: Record<string, number>;
  dst_port_distribution: Record<string, number>;
  protocol_distribution: Record<string, number>;
  flow_bytes_per_second: Array<{
    timestamp: string; // e.g. "2017-07-07T12:04:42"
    value: number; // mean value of flow bytes per second in that 1s interval
  }>;
  fwd_packets_per_second: Array<{
    timestamp: string; // e.g. "2017-07-07T12:04:42"
    value: number; // mean value of forward packets per second in that 1s interval
  }>;
  bwd_packets_per_second: Array<{
    timestamp: string; // e.g. "2017-07-07T12:04:42"
    value: number; // mean value of backward packets per second in that 1s interval
  }>;
}

export const fetchDashboard = async (): Promise<DashboardResponse> => {
  // Simulate a network delay of 1 second
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Use the custom fetch client. It automatically prepends the base URL and includes credentials.
  return customFetch("/api/dashboard", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Uncomment below to simulate a delayed response using mock data
// export const fetchDashboard = async (): Promise<DashboardResponse> => {
//   await new Promise((resolve) => setTimeout(resolve, 1000));
//   return Promise.resolve(dashboardMockData as DashboardResponse);
// };
