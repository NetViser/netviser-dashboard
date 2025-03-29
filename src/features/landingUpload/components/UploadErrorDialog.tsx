"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UploadErrorDialogProps } from "../types";

export function UploadErrorDialog({
  isOpen,
  onClose,
  errorMessage,
}: UploadErrorDialogProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-lg rounded-2xl border border-orange-200 p-8 shadow-2xl transform transition-all duration-300">
        <DialogHeader className="mb-4">
          <DialogTitle className="bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent text-3xl font-extrabold">
            Error Uploading Your File
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-6 relative">
          <p className="text-red-500 text-lg font-semibold">{errorMessage}</p>
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
