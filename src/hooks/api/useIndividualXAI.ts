"use client";

import useSWR from "swr";
import {
  fetchIndividualXAI,
  FetchIndividualXAIResponse,
} from "@/lib/api/fetchIndividualXAI";
import { useHandleSessionExpired } from "../session/useHandleSessionExpired";

export function useIndividualXAI(
  open: boolean,
  attackType: string,
  selectedRow: number,
  onClose: () => void
) {
  const handleSessionExpired = useHandleSessionExpired();
  const { data, isLoading, error } = useSWR<FetchIndividualXAIResponse>(
    open ? ["fetchIndividualXAI", attackType, selectedRow] : null,
    () =>
      fetchIndividualXAI({
        attack_type: attackType,
        data_point_id: selectedRow,
      }),
    {
      shouldRetryOnError: false,
      onError: async () => {
        await handleSessionExpired(error);
        onClose();
      },
    }
  );

  return {
    data,
    isLoading,
    error,
  };
}