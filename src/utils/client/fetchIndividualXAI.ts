import { customFetch } from "@/utils/client/fetchClient";

export type FetchIndividualXAIResponse = {
  attack_type: string;
  data_point_id: number;
  force_plot_url: string;
};

export type FetchIndividualXAIPayload = {
  attack_type: string;
  data_point_id: number;
};

export type FetchIndividualXAIExplanationPayload = {
  attack_type: string;
  data_point_id: number;
};

export type FetchIndividualXAIExplanationResponse = {
  explanation: string;
};

export async function fetchIndividualXAI(
  payload: FetchIndividualXAIPayload
): Promise<FetchIndividualXAIResponse> {
  try {
    const params = new URLSearchParams({
      attack_type: payload.attack_type,
      data_point_id: payload.data_point_id.toString(),
    });
    const url = `/api/attack-detection/xai/individual?${params.toString()}`;

    const data = await customFetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return data as FetchIndividualXAIResponse;
  } catch (error) {
    console.error("Error fetching individual XAI data:", error);
    throw new Error("Failed to fetch individual XAI data.");
  }
}

export async function fetchIndividualXAIExplanation(
  payload: FetchIndividualXAIExplanationPayload
): Promise<FetchIndividualXAIExplanationResponse> {
  try {
    const params = new URLSearchParams({
      attack_type: payload.attack_type,
      data_point_id: payload.data_point_id.toString(),
    });
    const url = `/api/attack-detection/xai/individual/explanation?${params.toString()}`;

    const data = await customFetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return data as FetchIndividualXAIExplanationResponse;
  } catch (error) {
    console.error("Error fetching individual XAI explanation:", error);
    throw new Error("Failed to fetch individual XAI explanation.");
  }
}
