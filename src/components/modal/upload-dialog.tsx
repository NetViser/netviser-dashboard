"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  NoCloseIconDialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type UploadDialogProps = {
  isOpen: boolean;
  uploadedBytesProgress: number;
  totalBytes: number;
};

export const UploadDialog: React.FC<UploadDialogProps> = ({
  isOpen,
  uploadedBytesProgress,
  totalBytes,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Ensure totalBytes is greater than 0 to avoid division by zero
    const safePercent = totalBytes > 0 
      ? Math.min((uploadedBytesProgress * 100) / totalBytes, 100)
      : 0;
    setProgress(safePercent);
  }, [uploadedBytesProgress, totalBytes]);

  // Convert bytes to MB with 2 decimal places
  const uploadedMB = (uploadedBytesProgress / (1024 * 1024)).toFixed(2);
  const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);

  return (
    <Dialog open={isOpen}>
      <NoCloseIconDialogContent
        className="sm:max-w-xl w-[90vw] bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 
          shadow-2xl transition-transform duration-300 ease-in-out transform hover:scale-105"
      >
        <DialogHeader className="mb-8">
          <DialogTitle
            className="text-2xl sm:text-3xl font-extrabold tracking-tight 
              bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400 
              bg-clip-text text-transparent"
          >
            Uploading Your File
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-8">
          {progress === 100 ? (
            <div className="flex flex-col items-center gap-6 animate-fade-in duration-500">
              <p className="text-base sm:text-lg font-medium text-orange-700 
                text-center max-w-[85%] leading-relaxed tracking-tight">
                Performing Network Attack Detection on the uploaded file
              </p>
              <div className="relative w-16 h-16">
                <img
                  src="/loader-circle.svg"
                  alt="Loading"
                  className="w-full h-full animate-spin"
                  style={{ animationDuration: "1s" }}
                />
                <div className="absolute inset-0 bg-orange-500/25 rounded-full 
                  animate-pulse blur-md scale-105" />
              </div>
            </div>
          ) : (
            <div className="w-full space-y-6 animate-slide-in duration-400">
              <p className="text-base sm:text-lg font-medium text-orange-700 
                text-center tracking-tight">
                Progress to upload file to bucket storage
              </p>
              <div className="relative w-full h-10 bg-gray-200 rounded-xl overflow-hidden shadow-inner">
                <div
                  className="absolute inset-0 h-full bg-gradient-to-r from-orange-400 
                    via-orange-500 to-amber-400 rounded-xl transition-all duration-700 ease-out 
                    shadow-md flex items-center justify-end px-3 text-white text-sm sm:text-base font-semibold"
                  style={{ width: `${progress}%` }}
                >
                  <span className="drop-shadow-md whitespace-nowrap">
                    {uploadedMB} MB / {totalMB} MB ({Math.round(progress)}%)
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 
                  to-transparent rounded-xl" />
              </div>
            </div>
          )}
        </div>
      </NoCloseIconDialogContent>
    </Dialog>
  );
};
