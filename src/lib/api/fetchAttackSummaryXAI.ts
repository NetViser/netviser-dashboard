import { customFetch } from "@/lib/api/fetchClient";

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
};

export async function fetchAttackSummaryXAI(
  payload: FetchAttackSummaryXAIPayload
): Promise<FetchAttackSummaryXAIResponse> {
  try {
    const params = new URLSearchParams({
      attack_type: payload.attack_type,
    });
    const url = `/api/attack-detection/xai/summary?${params.toString()}`;

    const data = await customFetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data as FetchAttackSummaryXAIResponse;
  } catch (error) {
    console.error("Error fetching individual XAI data:", error);
    throw new Error("Failed to fetch individual XAI data.");
  }
}

export async function fetchAttackBarSummaryXAIExplanation(
  payload: FetchAttackBarSummaryXAIExplanationPayload
): Promise<FetchAttackBarSummaryXAIExplanationResponse> {
  try {
    const params = new URLSearchParams({
      attack_type: payload.attack_type,
    });
    const url = `/api/attack-detection/xai/summary/bar/explanation?${params.toString()}`;

    const data = await customFetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data as FetchAttackBarSummaryXAIExplanationResponse;
  } catch (error) {
    console.error("Error fetching individual XAI data:", error);
    throw new Error("Failed to fetch individual XAI data.");
  }
}

export async function fetchAttackBeeswarmSummaryXAIExplanation(
  payload: FetchAttackBeeswarmSummaryXAIExplanationPayload
): Promise<FetchAttackBeeswarmSummaryXAIExplanationResponse> {
  try {
    const params = new URLSearchParams({
      attack_type: payload.attack_type,
    });
    const url = `/api/attack-detection/xai/summary/beeswarm/explanation?${params.toString()}`;

    const data = await customFetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data as FetchAttackBeeswarmSummaryXAIExplanationResponse;
  } catch (error) {
    console.error("Error fetching individual XAI data:", error);
    throw new Error("Failed to fetch individual XAI data.");
  }
}
