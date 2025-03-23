'use client';

import { create } from "zustand";

export type GCSUploadProgressState = {
  uploadProgress: number;
  setUploadProgress: (uploadProgress: number) => void;
};

export const useGCSUploadProgressStore = create<GCSUploadProgressState>((set) => ({
  uploadProgress: 0,
  setUploadProgress: (uploadProgress: number) => set({ uploadProgress }),
}));