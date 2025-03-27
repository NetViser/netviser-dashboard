"use client";

import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useUpload, UploadFileResult, UploadFileParams } from "@/hooks/useUpload";

export function useSampleUploadMutation() {
  const router = useRouter();
  const { upload } = useUpload();

  const { trigger, isMutating } = useSWRMutation<
    UploadFileResult,
    Error,
    string,
    UploadFileParams
  >(
    "/api/upload",
    (key: string, { arg }: { arg: UploadFileParams }) => upload(key, arg),
    {
      onSuccess: async () => {
        router.push("/dashboard");
      },
      onError: () => {
        Swal.close();
        Swal.fire({
          title: "Something went wrong",
          text: "Can't upload sample network file",
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
      },
    }
  );

  return { trigger, isMutating };
}