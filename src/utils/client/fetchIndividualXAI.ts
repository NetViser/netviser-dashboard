import axios from "axios";

export type FetchIndividualXAIResponse = {
  attack_type: string;
  data_point_id: number;
  force_plot_url: string;
};

export type FetchIndividualXAIPayload = {
  attack_type: string;
  data_point_id: number;
};

export type FetchIndividualXAIExplainationPayload = {
  attack_type: string;
  data_point_id: number;
};

export type FetchIndividualXAIExplainationResponse = {
  explanation: string;
};

export const FETCH_INDIVIDUAL_XAI_API_URL =
  "http://localhost:8000/api/attack-detection/xai/individual";

export const FETCH_INDIVIDUAL_XAI_EXPLAINATION_API_URL =
  "http://localhost:8000/api/attack-detection/xai/individual/explaination";

export async function fetchIndividualXAI(
  payload: FetchIndividualXAIPayload
): Promise<FetchIndividualXAIResponse> {
  try {
    // Construct the search parameters explicitly.
    const searchParams = new URLSearchParams({
      attack_type: payload.attack_type,
      data_point_id: payload.data_point_id.toString(),
    });

    const url = `${FETCH_INDIVIDUAL_XAI_API_URL}?${searchParams.toString()}`;

    const response = await axios.get<FetchIndividualXAIResponse>(url, {
      withCredentials: true, // Ensure session cookies are sent
    });

    return response.data; // Return the API response data
  } catch (error) {
    console.error("Error fetching individual XAI data:", error);
    throw new Error("Failed to fetch individual XAI data.");
  }
}

export async function fetchIndividualXAIExplaination(
  payload: FetchIndividualXAIExplainationPayload
): Promise<FetchIndividualXAIExplainationResponse> {
  try {
    // Construct the search parameters explicitly.
    const searchParams = new URLSearchParams({
      attack_type: payload.attack_type,
      data_point_id: payload.data_point_id.toString(),
    });
    await new Promise((resolve) => setTimeout(resolve, 10000));
    const url = `${FETCH_INDIVIDUAL_XAI_EXPLAINATION_API_URL}?${searchParams.toString()}`;

    const response = await axios.get<FetchIndividualXAIExplainationResponse>(
      url,
      {
        withCredentials: true, // Ensure session cookies are sent
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching individual XAI explanation:", error);
    throw new Error("Failed to fetch individual XAI explanation.");
  }
}
