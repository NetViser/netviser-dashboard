'use client';

import { create } from "zustand";

export type GCSUploadProgressState = {
  uploadedBytesProgress: number;
  setUploadedBytesProgress: (uploadedBytesProgress: number) => void;
  totalBytes: number;
  setTotalBytes: (totalBytes: number) => void;
};

export const useGCSUploadProgressStore = create<GCSUploadProgressState>((set) => ({
  uploadedBytesProgress: 0,
  setUploadedBytesProgress: (uploadedBytesProgress) => set({ uploadedBytesProgress }),
  totalBytes: 0,
  setTotalBytes: (totalBytes) => set({ totalBytes }),
}));