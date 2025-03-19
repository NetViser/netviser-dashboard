import { customFetch } from "@/utils/client/fetchClient";
import Swal from "sweetalert2";

export interface UploadResponse {
  completed: boolean; // true for sample file, false for regular upload
  message: string;
  session_id: string;
  presigned_url?: string; // Only for regular uploads
  raw_file_path?: string; // Only for regular uploads
  s3_key?: string; // Only for sample files
}

export interface UploadCompleteResponse {
  message: string;
  session_id: string;
  s3_key: string;
}

export interface UploadFileResult {
  content: {
    message: string;
    session_id: string;
    s3_key: string;
  };
}

export interface UploadFileParams {
  arg: File | string;
}

export async function uploadFile(
  url: string, // not used directly since customFetch handles URL construction
  { arg: uploadItem }: UploadFileParams
): Promise<UploadFileResult> {
  try {
    const formData = new FormData();
    if (uploadItem instanceof File) {
      formData.append("filename", uploadItem.name);
    } else {
      formData.append("sample_filename", uploadItem);
    }

    // Request the presigned URL or sample file info from the backend.
    const initiateData = (await customFetch("/api/upload", {
      method: "POST",
      body: formData,
    })) as UploadResponse;

    // For sample files, the backend completes the process immediately.
    if (initiateData.completed) {
      if (!initiateData.s3_key) {
        throw new Error("Sample file response missing s3_key");
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
          s3_key: initiateData.s3_key,
        },
      };
    }

    // For regular uploads, extract S3 info and verify required fields.
    const { presigned_url, raw_file_path } = initiateData;
    if (!presigned_url || !raw_file_path) {
      throw new Error(
        "Missing presigned_url or raw_file_path for regular upload"
      );
    }

    // Upload the file to S3 using the provided presigned URL.
    try {
      const s3Response = (await customFetch(presigned_url, {
        method: "PUT",
        body: uploadItem instanceof File ? uploadItem : new Blob([]),
        headers: {
          "Content-Type":
            uploadItem instanceof File
              ? uploadItem.type || "application/octet-stream"
              : "application/octet-stream",
        },
        credentials: "omit", // do not send credentials to S3
        parseJson: false, // S3 returns 204 No Content, so no JSON to parse
      })) as Response;

      // Check S3 response status
      if (s3Response.status === 204) {
        console.log("S3 upload successful: 204 No Content");
      } else {
        console.warn(`Unexpected S3 response status: ${s3Response.status}`);
      }
    } catch (s3Error) {
      console.error("S3 upload failed:", s3Error);
      if (s3Error instanceof Error) {
        if (s3Error.message.includes("403")) {
          throw new Error(
            "S3 upload failed: Access denied (403). Check presigned URL or bucket permissions."
          );
        } else if (s3Error.message.includes("400")) {
          throw new Error(
            "S3 upload failed: Bad request (400). Check file or headers."
          );
        }
      }
      throw new Error(
        `S3 upload failed: ${
          s3Error instanceof Error ? s3Error.message : "Unknown error"
        }`
      );
    }

    // Notify backend to trigger Lambda processing via /api/upload-complete.
    const completeFormData = new FormData();
    completeFormData.append("raw_file_path", raw_file_path);

    const completeData = (await customFetch("/api/upload-complete", {
      method: "POST",
      body: completeFormData,
    })) as UploadCompleteResponse;

    return {
      content: {
        message: completeData.message,
        session_id: completeData.session_id,
        s3_key: completeData.s3_key,
      },
    };
  } catch (error) {
    console.error("Upload failed:", error);
    await Swal.fire({
      // await here to ensure it gets rendered
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
