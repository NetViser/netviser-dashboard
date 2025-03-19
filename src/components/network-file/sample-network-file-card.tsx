"use client";

import { useSessionStore } from "@/store/session";
import { uploadFile } from "@/utils/client/uploadFile";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

type SampleNetworkFileCardProps = {
  name: string;
  featuredAttacks: string[];
};

function SampleNetworkFileCard({
  name,
  featuredAttacks,
}: SampleNetworkFileCardProps) {
  const router = useRouter();
  const { setActiveSession, setSessionID } = useSessionStore();

  const handleClick = async () => {
    console.log(`Fetching sample network file: ${name}`);
    try {
      // Call uploadFile with the sample file name
      const responseData = await uploadFile("/api/upload", { arg: name });

      // Process the response
      const sessionID = responseData.content.session_id;
      console.log("Session ID:", sessionID);
      setSessionID(sessionID);
      setActiveSession(true);
      router.push("/dashboard");
    } catch (error: any) {
      // Show error alert on failure
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
    }
  };

  // Animation variants for the card
  const cardVariants = {
    initial: { scale: 1, y: 0, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
    hover: {
      scale: 1.03,
      y: -5,
      boxShadow: "0 10px 15px -3px rgba(234, 88, 12, 0.3)",
      transition: { duration: 0.2, ease: "easeOut" },
    },
    tap: {
      scale: 0.98,
      y: 0,
      transition: { duration: 0.1 },
    },
  };

  // Animation variants for the "Try Sample" button
  const buttonVariants = {
    initial: { x: 0 },
    hover: { x: 5, color: "#f97316" }, // Orange-500
  };

  // Animation variants for the attack tags
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
      className="relative bg-gray-50 rounded-xl border border-gray-200 p-4 overflow-hidden cursor-pointer group"
    >
      {/* Gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-orange-200/0 via-orange-200/20 to-orange-200/0 opacity-0 group-hover:opacity-100"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative flex items-center justify-between z-10">
        <div>
          {/* File Name with subtle glow on hover */}
          <p className="text-sm font-semibold text-stone-900 group-hover:text-orange-600 transition-colors duration-200">
            {name}
          </p>
          {/* Attack Tags with bounce effect */}
          <div className="flex flex-wrap gap-1 mt-2">
            {featuredAttacks.map((attack, index) => (
              <motion.span
                key={index}
                variants={tagVariants}
                className="text-xs font-medium text-orange-700 bg-orange-100/80 px-2 py-0.5 rounded-full border border-orange-200/50 backdrop-blur-sm"
                whileHover="hover"
              >
                {attack}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Animated "Try Sample" button */}
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

      {/* Subtle bottom border animation */}
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
