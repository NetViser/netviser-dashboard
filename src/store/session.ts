'use client';

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type SessionState = {
  sessionID: string;
  setSessionID: (sessionID: string) => void;
  isActiveSession: boolean;
  setActiveSession: (isActiveSession: boolean) => void;
};


export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      sessionID: "",
      setSessionID: (sessionID: string) => set({ sessionID }),
      isActiveSession: false,
      setActiveSession: (isActiveSession: boolean) => set({ isActiveSession }),
    }),
    {
      name: "session-storage", // The name of the storage key
      storage: createJSONStorage(() => sessionStorage), // The storage to use
      merge: (persistedState, currentState) => {
        return { ...currentState, ...(persistedState as SessionState) };
      },
    }
  ),
);
