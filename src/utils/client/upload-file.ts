import { customFetch } from "@/utils/client/fetchClient";
import Swal from "sweetalert2";

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

export async function uploadFile(
  url: string,
  { arg: uploadItem }: UploadFileParams
): Promise<UploadFileResult> {
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
      return {
        content: {
          message: initiateData.message,
          session_id: initiateData.session_id,
          bucket_key: initiateData.bucket_key,
        },
      };
    }

    const { presigned_url, bucket_key } =
      initiateData as UploadPresignedResponse;
    if (!presigned_url || !bucket_key) {
      throw new Error(
        "Missing presigned_url or raw_file_path for regular upload"
      );
    }

    await customFetch(presigned_url, {
      method: "PUT",
      body: uploadItem instanceof File ? uploadItem : new Blob([]),
      headers: {
        "Content-Type":
          uploadItem instanceof File
            ? uploadItem.type || "application/octet-stream"
            : "application/octet-stream",
      },
      credentials: "omit",
      parseJson: false,
    });

    const completeFormData = new FormData();
    completeFormData.append("raw_file_path", bucket_key);

    const completeData = (await customFetch("/api/upload-complete", {
      method: "POST",
      body: completeFormData,
    })) as UploadCompleteResponse;

    return {
      content: {
        message: completeData.message,
        session_id: completeData.session_id,
        bucket_key: completeData.bucket_key,
      },
    };
  } catch (error) {
    console.error("Upload failed:", error);
    await Swal.fire({
      title: "Error",
      text: "Unfortunatly, the file could not be uploaded",
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
    return Promise.reject(error);
  }
}