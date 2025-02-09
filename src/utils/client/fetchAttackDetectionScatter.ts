import data from "@/mocks/attackDetectionScatter.json";
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

export async function fetchAttackDetectionScatter(attack_type: string): Promise<AttackDetectionBriefScatterResponse> {
    const url = new URL("http://localhost:8000/api/attack-detection/brief/scatter");
    url.searchParams.append("attack_type", attack_type);
    
    const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });
    
    if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage || "Failed to get attack detection scatter data");
    }
    
    return response.json();
}

// export const fetchAttackDetectionScatter = async (attack_type: string): Promise<AttackDetectionBriefScatterResponse> => {
//     await new Promise((resolve) => setTimeout(resolve, 1000))

//     return Promise.resolve(data as AttackDetectionBriefScatterResponse);
// }
