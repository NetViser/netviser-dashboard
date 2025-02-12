import axios from "axios";

export interface BarSummaryItem {
  feature: string;
  mean_abs_shap: number;
}

export interface BeeswarmSummaryItem {
  feature: string;
  shap_value: number;
  original_feature_value: number;
  normalized_feature_value: number;
  y_jitter: number;
}

export type FetchAttackSummaryXAIResponse = {
  bar_summary: BarSummaryItem[];
  beeswarm_summary: BeeswarmSummaryItem[];
};

export type FetchAttackSummaryXAIPayload = {
  attack_type: string;
};

export type FetchAttackBarSummaryXAIExplanationPayload = {
  attack_type: string;
};

export type FetchAttackBarSummaryXAIExplanationResponse = {
  explanation: string;
};

export type FetchAttackBeeswarmSummaryXAIExplanationPayload = {
  attack_type: string;
};

export type FetchAttackBeeswarmSummaryXAIExplanationResponse = {
  explanation: string;
}

export const FETCH_ATTACK_SUMMARY_XAI_API_URL =
  "http://localhost:8000/api/attack-detection/xai/summary";

export const FETCH_ATTACK_BAR_SUMMARY_XAI_EXPLANATION_API_URL =
  "http://localhost:8000/api/attack-detection/xai/summary/bar/explanation";

export const FETCH_ATTACK_BEESWARM_SUMMARY_XAI_EXPLANATION_API_URL =
    "http://localhost:8000/api/attack-detection/xai/summary/beeswarm/explanation";

export async function fetchAttackSummaryXAI(
  payload: FetchAttackSummaryXAIPayload
): Promise<FetchAttackSummaryXAIResponse> {
  try {
    // Construct the search parameters explicitly.
    const searchParams = new URLSearchParams({
      attack_type: payload.attack_type,
    });

    const url = `${FETCH_ATTACK_SUMMARY_XAI_API_URL}?${searchParams.toString()}`;

    const response = await axios.get<FetchAttackSummaryXAIResponse>(url, {
      withCredentials: true, // Ensure session cookies are sent
    });

    return response.data; // Return the API response data
  } catch (error) {
    console.error("Error fetching individual XAI data:", error);
    throw new Error("Failed to fetch individual XAI data.");
  }
}

export async function fetchAttackBarSummaryXAIExplanation(
  payload: FetchAttackBarSummaryXAIExplanationPayload
): Promise<FetchAttackBarSummaryXAIExplanationResponse> {
  try {
    // Construct the search parameters explicitly.
    const searchParams = new URLSearchParams({
      attack_type: payload.attack_type,
    });

    const url = `${FETCH_ATTACK_BAR_SUMMARY_XAI_EXPLANATION_API_URL}?${searchParams.toString()}`;

    const response =
      await axios.get<FetchAttackBarSummaryXAIExplanationResponse>(url, {
        withCredentials: true, // Ensure session cookies are sent
      });

    return response.data; // Return the API response data
  } catch (error) {
    console.error("Error fetching individual XAI data:", error);
    throw new Error("Failed to fetch individual XAI data.");
  }
}

export async function fetchAttackBeeswarmSummaryXAIExplanation(
  payload: FetchAttackBeeswarmSummaryXAIExplanationPayload
): Promise<FetchAttackBeeswarmSummaryXAIExplanationResponse> {
  try {
    // Construct the search parameters explicitly.
    const searchParams = new URLSearchParams({
      attack_type: payload.attack_type,
    });

    const url = `${FETCH_ATTACK_BEESWARM_SUMMARY_XAI_EXPLANATION_API_URL}?${searchParams.toString()}`;

    const response =
      await axios.get<FetchAttackBeeswarmSummaryXAIExplanationResponse>(url, {
        withCredentials: true, // Ensure session cookies are sent
      });

    return response.data; // Return the API response data
  } catch (error) {
    console.error("Error fetching individual XAI data:", error);
    throw new Error("Failed to fetch individual XAI data.");
  }
}