import { customFetch } from "@/utils/client/fetchClient";

export interface UploadResponse {
  completed: boolean; // Indicates if the process is complete (true for sample files)
  message: string;
  session_id: string;
  presigned_url?: string; // Optional, only for regular uploads
  raw_file_path?: string; // Optional, only for regular uploads
  s3_key?: string; // Optional, only for sample files
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

export async function uploadFile(
  url: string, // Not used directly since customFetch handles URL construction
  { arg: file }: { arg: File }
): Promise<UploadFileResult> {
  try {
    // Step 1: Request presigned URL or sample file info from /api/upload
    const formData = new FormData();
    formData.append("filename", file.name);

    const initiateData = (await customFetch("/api/upload", {
      method: "POST",
      body: formData,
    })) as UploadResponse;

    // If completed is true (sample file), return immediately
    if (initiateData.completed) {
      if (!initiateData.s3_key) {
        throw new Error("Sample file response missing s3_key");
      }
      return {
        content: {
          message: initiateData.message,
          session_id: initiateData.session_id,
          s3_key: initiateData.s3_key,
        },
      };
    }

    // For regular uploads, proceed with S3 upload and completion
    const { presigned_url, raw_file_path } = initiateData;
    if (!presigned_url || !raw_file_path) {
      throw new Error("Missing presigned_url or raw_file_path for regular upload");
    }

    // Step 2: Upload file to S3 using the presigned URL with customFetch
    try {
      const s3Response = (await customFetch(presigned_url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        credentials: "omit", // Avoid sending credentials to S3
        parseJson: false, // S3 PUT returns 204 No Content, no JSON to parse
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
          throw new Error("S3 upload failed: Access denied (403). Check presigned URL or bucket permissions.");
        } else if (s3Error.message.includes("400")) {
          throw new Error("S3 upload failed: Bad request (400). Check file or headers.");
        }
      }
      throw new Error(`S3 upload failed: ${s3Error instanceof Error ? s3Error.message : "Unknown error"}`);
    }

    // Step 3: Notify backend via /api/upload-complete
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
    throw error; // Let SWR handle the error
  }
}