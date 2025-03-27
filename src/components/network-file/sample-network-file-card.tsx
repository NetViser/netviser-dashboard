"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import useSWRMutation from "swr/mutation";
import { useUpload, UploadFileResult } from "@/hooks/useUpload";

type SampleNetworkFileCardProps = {
  name: string;
  featuredAttacks: string[];
};

function SampleNetworkFileCard({
  name,
  featuredAttacks,
}: SampleNetworkFileCardProps) {
  const router = useRouter();
  const { upload } = useUpload();

  const { trigger, isMutating } = useSWRMutation("/api/upload", upload, {
    onSuccess: async (_responseData: UploadFileResult) => {
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      Swal.close();
      Swal.fire({
        title: "Error",
        text: error.message,
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
      console.error("Upload failed:", error);
    },
  });

  const handleClick = async () => {
    if (isMutating) return;
    console.log(`Fetching sample network file: ${name}`);
    Swal.fire({
      title:
        '<span class="bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent font-bold text-2xl">Analyzing Your File</span>',
      html: `
        <div class="flex flex-col items-center space-y-4">
          <div class="relative w-16 h-16">
            <img src="/loader-circle.svg" alt="NetViser Logo" class="w-16 h-16 animate-spin" />
            <div class="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/30 to-orange-700/30 blur-md animate-pulse"></div>
          </div>
          <p class="text-stone-700 font-semibold text-lg animate-pulse">Processing...</p>
          <div class="w-3/4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-orange-400 to-orange-600 animate-progress"></div>
          </div>
        </div>
      `,
      showConfirmButton: false,
      allowOutsideClick: false,
      background: "rgba(255, 255, 255, 0.95)",
      backdrop: "rgba(0, 0, 0, 0.6)",
      customClass: {
        popup: "rounded-xl shadow-2xl border border-orange-200/50",
      },
    });
    trigger(name).finally(() => {
      Swal.close();
    });
  };

  const cardVariants = {
    initial: { scale: 1, y: 0, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" },
    hover: {
      scale: 1.03,
      y: -5,
      boxShadow: "0 10px 15px -3px rgba(234, 88, 12, 0.2)",
      transition: { duration: 0.2, ease: "easeOut" },
    },
    tap: {
      scale: 0.98,
      y: 0,
      transition: { duration: 0.1 },
    },
  };

  const buttonVariants = {
    initial: { x: 0 },
    hover: { x: 5, color: "#f97316" }, // Orange-500
  };

  const tagVariants = {
    initial: { opacity: 0.9, scale: 1 },
    hover: { opacity: 1, scale: 1.05, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      onClick={handleClick}
      className="relative bg-gray-50/85 backdrop-blur-md rounded-xl border border-orange-200/40 p-4 overflow-hidden cursor-pointer group"
    >
      {/* Loading overlay during the mutation */}
      {isMutating && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-20">
          <img src="/loader-circle.svg" alt="Loading" className="w-10 h-10 animate-spin" />
        </div>
      )}

      {/* Gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-orange-100/0 via-orange-100/30 to-orange-100/0 opacity-0 group-hover:opacity-100"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative flex items-center justify-between z-10">
        <div>
          <p className="text-sm font-semibold text-stone-900 group-hover:text-orange-600 transition-colors duration-200">
            {name}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {featuredAttacks.map((attack, index) => (
              <motion.span
                key={index}
                variants={tagVariants}
                className="text-xs font-medium text-orange-600 bg-orange-50/80 px-2 py-0.5 rounded-full border border-orange-200/60 backdrop-blur-sm"
                whileHover="hover"
              >
                {attack}
              </motion.span>
            ))}
          </div>
        </div>

        <motion.span
          variants={buttonVariants}
          className="text-orange-500 text-sm font-medium flex items-center gap-1"
        >
          <span>Try Sample</span>
          <motion.svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            initial={{ x: 0 }}
            whileHover={{ x: 3 }}
            transition={{ duration: 0.2 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </motion.svg>
        </motion.span>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-orange-400"
        initial={{ width: "0%" }}
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

export default SampleNetworkFileCard;