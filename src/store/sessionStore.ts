'use client';

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type SessionState = {
  sessionID: string;
  setSessionID: (sessionID: string) => void;
  isActiveSession: boolean;
  setActiveSession: (isActiveSession: boolean) => void;
  networkFileName: string;
  setNetworkFileName: (networkFileName: string) => void;
  reset: () => void; // <-- Add reset method type
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      sessionID: "",
      setSessionID: (sessionID: string) => set({ sessionID }),
      isActiveSession: false,
      setActiveSession: (isActiveSession: boolean) => set({ isActiveSession }),
      networkFileName: "",
      setNetworkFileName: (networkFileName: string) => set({ networkFileName }),
      reset: () =>
        set({
          sessionID: "",
          isActiveSession: false,
          networkFileName: "",
        }),
    }),
    {
      name: "session-storage",
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) => {
        return { ...currentState, ...(persistedState as SessionState) };
      },
    }
  )
);
