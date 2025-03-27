'use client';

import useSWR from "swr";
import { fetchAttackSummaryXAI } from "@/utils/client/fetchAttackSummaryXAI";
import { useHandleSessionExpired } from "../session/useHandleSessionExpired";
import { useSessionStore } from "@/store/session";

export function useAttackXAISummary(attackType: string) {
  const { sessionID } = useSessionStore();
  const handleSessionExpired = useHandleSessionExpired();

  const { data, error, isLoading } = useSWR(
    `${sessionID}/attack_summary_xai?attack_type=${attackType}`,
    () => fetchAttackSummaryXAI({ attack_type: attackType }),
    {
      shouldRetryOnError: false,
      keepPreviousData: true,
      onError: handleSessionExpired,
    }
  );

  return {
    data,
    isLoading,
    error,
  };
}
