import data from "@/mocks/attackDetectionScatter.json";
import { customFetch } from "@/utils/client/fetchClient";

export interface DataPoint {
  timestamp: string;
  value: number;
}

export interface AttackDetectionBriefScatterResponse {
  attack_type: string;
  benign_data: DataPoint[];
  attack_data: DataPoint[];
  feature_name: string;
}

export async function fetchAttackDetectionScatter(
  attack_type: string
): Promise<AttackDetectionBriefScatterResponse> {
  // Build the query parameters using URLSearchParams
  const params = new URLSearchParams({
    attack_type,
  });
  // Use a relative URL so the base URL is prepended by customFetch
  const url = `/api/attack-detection/brief/scatter?${params.toString()}`;

  // Call the custom fetch client; it automatically includes credentials
  const dataResponse = await customFetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return dataResponse as AttackDetectionBriefScatterResponse;
}

// export const fetchAttackDetectionScatter = async (attack_type: string): Promise<AttackDetectionBriefScatterResponse> => {
//     await new Promise((resolve) => setTimeout(resolve, 1000))
//
//     return Promise.resolve(data as AttackDetectionBriefScatterResponse);
// };
