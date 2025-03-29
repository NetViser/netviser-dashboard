"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  NoCloseIconDialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { UploadDialogProps } from "../types";

export const UploadDialog: React.FC<UploadDialogProps> = ({
  isOpen,
  uploadedBytesProgress,
  totalBytes,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const safePercent = totalBytes > 0
      ? Math.min((uploadedBytesProgress * 100) / totalBytes, 100)
      : 0;
    setProgress(safePercent);
  }, [uploadedBytesProgress, totalBytes]);

  const uploadedMB = (uploadedBytesProgress / (1024 * 1024)).toFixed(2);
  const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);

  return (
    <Dialog open={isOpen}>
      <NoCloseIconDialogContent
        className="sm:max-w-xl w-[90vw] bg-white/90 backdrop-blur-2xl rounded-2xl p-8
          border border-orange-300/20 shadow-2xl shadow-orange-500/10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <DialogHeader className="mb-8">
            <DialogTitle
              className="text-3xl font-extrabold tracking-tight 
                bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400 
                bg-clip-text text-transparent"
            >
              Uploading Your File
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center gap-8">
            {progress === 100 ? (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center gap-6"
              >
                <p className="text-lg font-medium text-stone-700 text-center max-w-[85%] leading-relaxed">
                  Performing Network Attack Detection on the uploaded file
                </p>
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-400/20 rounded-full blur-lg animate-pulse" />
                  <img
                    src="/loader-circle.svg"
                    alt="Loading"
                    className="w-full h-full animate-spin"
                    style={{ animationDuration: "1s" }}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full space-y-6"
              >
                <p className="text-lg font-medium text-stone-700 text-center">
                  Progress to upload file to bucket storage
                </p>
                
                <div className="relative w-full h-3 bg-stone-100/80 rounded-xl overflow-hidden 
                  shadow-inner border border-orange-200/20">
                  <motion.div
                    className="absolute inset-0 h-full bg-gradient-to-r from-orange-500 
                      via-orange-400 to-amber-400 rounded-xl"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                </div>

                <div className="flex justify-between items-center px-2">
                  <span className="text-sm font-semibold text-orange-600">
                    {uploadedMB} MB
                  </span>
                  <span className="text-sm font-semibold text-stone-600">
                    {Math.round(progress)}%
                  </span>
                  <span className="text-sm font-semibold text-stone-600">
                    {totalMB} MB
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </NoCloseIconDialogContent>
    </Dialog>
  );
};