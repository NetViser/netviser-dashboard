"use client";

import useSWR from "swr";
import { fetchDashboard } from "@/utils/client/fetchDashboard";
import { useHandleSessionExpired } from "../session/useHandleSessionExpired";
import { useSessionStore } from "@/store/session";

export function useDashboardData() {
  const { sessionID } = useSessionStore();
  const handleSessionExpired = useHandleSessionExpired();

  const { data, isLoading, error } = useSWR(
    `${sessionID}/api/dashboard`,
    fetchDashboard,
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
