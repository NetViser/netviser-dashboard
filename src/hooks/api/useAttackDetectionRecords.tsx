"use client";

import { fetchAttackDetectionRecord } from "@/utils/client/fetchAttackDetectionRecord";
import useSWR from "swr";
import { useHandleSessionExpired } from "@/hooks/session/useHandleSessionExpired";
import { useSessionStore } from "@/store/session";

interface UseAttackDetectionRecordsProps {
  attackType: string;
  page: number;
  pageSize: number;
}

export function useAttackDetectionRecords({
  attackType,
  page,
  pageSize,
}: UseAttackDetectionRecordsProps) {
  const { sessionID } = useSessionStore();
  const handleSessionExpired = useHandleSessionExpired();

  const swrKey = `${sessionID}/attack_record?type=${attackType}&page=${page}&page_size=${pageSize}`;

  const {
    data: attackRecords,
    isLoading,
    error,
  } = useSWR(
    swrKey,
    () => fetchAttackDetectionRecord(attackType, page, pageSize),
    {
      shouldRetryOnError: false,
      keepPreviousData: true,
      onError: handleSessionExpired,
    }
  );

  return {
    attackRecords,
    isLoading,
    error,
  };
}
