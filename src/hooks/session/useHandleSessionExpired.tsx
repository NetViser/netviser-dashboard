"use client";

import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/store/sessionStore";

/**
 * A reusable hook for handling session expiration errors.
 */
export function useHandleSessionExpired() {
  const router = useRouter();
  const { reset } = useSessionStore();

  return async function handleSessionExpired(error: any) {
    console.error("Session Expired or fetch error:", error);
    await Swal.fire({
      icon: "error",
      title: "Session Expired",
      confirmButtonText: "OK",
      timer: 1000,
      timerProgressBar: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    reset();
    router.push("/");
  };
}
