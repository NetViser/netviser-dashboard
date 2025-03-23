"use client";

import {
  Dialog,
  NoCloseIconDialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type UploadDialogProps = {
  isOpen: boolean;
  uploadProgress: number;
};

export const UploadDialog: React.FC<UploadDialogProps> = ({
  isOpen,
  uploadProgress,
}) => {
  return (
    <Dialog open={isOpen}>
      <NoCloseIconDialogContent 
        className="sm:max-w-md bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-xl 
        border border-orange-200/50 rounded-3xl p-8 shadow-xl shadow-orange-200/20 
        ring-1 ring-orange-100/50 transition-all duration-300 ease-in-out"
      >
        <DialogHeader className="mb-6">
          <DialogTitle 
            className="text-2xl font-bold tracking-tight bg-gradient-to-r from-orange-600 
            via-orange-500 to-amber-500 bg-clip-text text-transparent"
          >
            Uploading Your File
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6">
          {uploadProgress === 100 ? (
            <div className="flex flex-col items-center gap-4 animate-in fade-in-0 duration-500">
              <p className="text-base font-medium text-orange-700 text-center 
                max-w-[80%] leading-relaxed">
                Performing Network Attack Detection on the uploaded file
              </p>
              <div className="relative w-14 h-14">
                <img
                  src="/loader-circle.svg"
                  alt="Loading"
                  className="w-full h-full animate-spin [animation-duration:1.2s]"
                />
                <div className="absolute inset-0 bg-orange-500/20 rounded-full 
                  animate-pulse blur-sm" />
              </div>
            </div>
          ) : (
            <div className="w-full space-y-4 animate-in slide-in-from-bottom-4 duration-300">
              <p className="text-base font-medium text-orange-700 text-center 
                tracking-tight">
                Progress to upload file to bucket storage
              </p>
              <div className="relative w-full h-6 bg-gray-100 rounded-full 
                overflow-hidden shadow-inner shadow-orange-100/50">
                <div
                  className="absolute inset-0 h-full bg-gradient-to-r from-orange-400 
                    via-orange-500 to-amber-500 rounded-full transition-all 
                    duration-500 ease-out shadow-md flex items-center justify-end 
                    pr-2 text-white text-sm font-semibold"
                  style={{ width: `${uploadProgress}%` }}
                >
                  <span className="drop-shadow-sm">{uploadProgress}%</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 
                  to-transparent rounded-full animate-pulse" />
              </div>
            </div>
          )}
        </div>
      </NoCloseIconDialogContent>
    </Dialog>
  );
};