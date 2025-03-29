import { customFetch } from "@/lib/api/fetchClient";
import { FetchSpecificAttackResponse } from "./types";

// Fetch function
export async function fetchSpecificAttackDetection(
  attackType: string
): Promise<FetchSpecificAttackResponse> {
  try {
    const params = new URLSearchParams({
      attack_type: attackType,
    });
    const url = `/api/attack-detection/overview?${params.toString()}`;

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
