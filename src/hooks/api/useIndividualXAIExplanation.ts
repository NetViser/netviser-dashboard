"use client";

import useSWR from "swr";
import {
  fetchIndividualXAIExplanation,
  FetchIndividualXAIExplanationResponse,
} from "@/utils/client/fetchIndividualXAI";
import { useHandleSessionExpired } from "../session/useHandleSessionExpired";

export function useIndividualXAIExplanation(
  explanationRequested: boolean,
  attackType: string,
  selectedRow: number
) {
  const handleSessionExpired = useHandleSessionExpired();
  const { data, isLoading, error } =
    useSWR<FetchIndividualXAIExplanationResponse>(
      explanationRequested
        ? ["fetchIndividualXAIExplanation", attackType, selectedRow]
        : null,
      () =>
        fetchIndividualXAIExplanation({
          attack_type: attackType,
          data_point_id: selectedRow,
        }),
      {
        shouldRetryOnError: false,
        onError: handleSessionExpired,
      }
    );

  return {
    data,
    isLoading,
    error,
  };
}
