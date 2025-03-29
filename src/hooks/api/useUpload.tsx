import { useCallback, useState } from "react";
import { customFetch } from "@/lib/api/fetchClient";
import Swal from "sweetalert2";
import axios from "axios";
import { useGCSUploadProgressStore } from "@/store/uploadProgressStore";
import { clearSavedState } from "@/utils/utils";
import { useSessionStore } from "@/store/sessionStore";

export interface UploadSampleResponse {
  completed: boolean;
  message: string;
  session_id: string;
  bucket_key: string;
}

export interface UploadPresignedResponse {
  completed: boolean;
  message: string;
  session_id: string;
  presigned_url: string;
  bucket_key: string;
}

export interface UploadCompleteResponse {
  message: string;
  session_id: string;
  bucket_key: string;
}

export interface UploadFileResult {
  content: {
    message: string;
    session_id: string;
    bucket_key: string;
  };
}

export interface UploadFileParams {
  arg: File | string;
}

export function useUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<UploadFileResult | null>(null);
  const { setUploadedBytesProgress, setTotalBytes } =
    useGCSUploadProgressStore();
  const { setActiveSession, setSessionID, setNetworkFileName } =
    useSessionStore();

  const upload = useCallback(
    async (url: string, { arg: uploadItem }: UploadFileParams) => {
      setIsLoading(true);
      setError(null);
      setResult(null);

      try {
        const formData = new FormData();
        if (uploadItem instanceof File) {
          formData.append("filename", uploadItem.name);
        } else {
          formData.append("sample_filename", uploadItem);
        }

        const initiateData = (await customFetch("/api/upload", {
          method: "POST",
          body: formData,
        })) as UploadSampleResponse | UploadPresignedResponse;

        if (initiateData.completed && "bucket_key" in initiateData) {
          if (!initiateData.bucket_key) {
            throw new Error("Missing bucket_key for sample upload");
          }
          clearSavedState();
          await Swal.fire({
            title: "Success",
            text: "Sample Selected Successfully",
            icon: "success",
            timer: 1000,
            showConfirmButton: false,
            timerProgressBar: true,
            background: "#fff",
            customClass: {
              popup: "rounded-xl shadow-2xl border border-orange-200/50",
              title: "text-stone-900 font-bold text-2xl",
            },
          });
          const sampleResult = {
            content: {
              message: initiateData.message,
              session_id: initiateData.session_id,
              bucket_key: initiateData.bucket_key,
            },
          };
          setResult(sampleResult);
          setSessionID(initiateData.session_id);
          setActiveSession(true);
          setNetworkFileName(
            uploadItem instanceof File ? uploadItem.name : uploadItem
          );
          return sampleResult;
        }

        const { presigned_url, bucket_key } =
          initiateData as UploadPresignedResponse;
        if (!presigned_url || !bucket_key) {
          throw new Error(
            "Missing presigned_url or raw_file_path for regular upload"
          );
        }

        await axios.put(
          presigned_url,
          uploadItem instanceof File ? uploadItem : new Blob([]),
          {
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                console.log(
                  `Upload to GCS Progress: ${Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                  )}%`
                );
                setUploadedBytesProgress(progressEvent.loaded);
                setTotalBytes(progressEvent.total);
              }
            },
            headers: {
              "Content-Type":
                uploadItem instanceof File
                  ? uploadItem.type || "application/octet-stream"
                  : "application/octet-stream",
            },
          }
        );

        const completeFormData = new FormData();
        completeFormData.append("raw_file_path", bucket_key);

        const completeData = (await customFetch("/api/upload-complete", {
          method: "POST",
          body: completeFormData,
        })) as UploadCompleteResponse;

        const uploadResult = {
          content: {
            message: completeData.message,
            session_id: completeData.session_id,
            bucket_key: completeData.bucket_key,
          },
        };
        clearSavedState();
        setResult(uploadResult);
        setSessionID(completeData.session_id);
        setActiveSession(true);
        setNetworkFileName(
          uploadItem instanceof File ? uploadItem.name : uploadItem
        );

        return uploadResult;
      } catch (error) {
        console.error("Upload failed:", error);
        await Swal.fire({
          title: "Error",
          text: "Unfortunately, the file could not be uploaded",
          icon: "error",
          confirmButtonText: "Close",
          confirmButtonColor: "#f44336",
          background: "#fff",
          customClass: {
            popup: "rounded-xl shadow-2xl border border-red-200/50",
            title: "text-stone-900 font-bold text-2xl",
            confirmButton: "rounded-lg px-6 py-2",
          },
        });
        setError(error instanceof Error ? error : new Error("Unknown error"));
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [
      setUploadedBytesProgress,
      setTotalBytes,
      setActiveSession,
      setSessionID,
      setNetworkFileName,
    ]
  );

  return { upload, isLoading, error, result };
}