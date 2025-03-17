"use client";

import { useState } from "react";
import { TbUpload } from "react-icons/tb";
import { useDropzone } from "react-dropzone";
import useSWRMutation from "swr/mutation";
import useSWR from "swr";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/store/session";
import { uploadFile } from "@/utils/client/uploadFIle";
import { fetchAllSampleNetworkFiles } from "@/utils/client/fetchAllSampleNetworkFiles";
import Image from "next/image";
import { motion } from "framer-motion";
import SampleNetworkFileCard from "@/components/network-file/sample-network-file-card";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // Import skeleton CSS
import { clearSavedState } from "@/utils/utils";

const UPLOAD_URL = "/api/upload";

export default function Home() {
  const router = useRouter();
  const { setActiveSession, setSessionID } = useSessionStore();
  const [isMutating, setIsMutating] = useState(false);

  const { trigger } = useSWRMutation(UPLOAD_URL, uploadFile, {
    onSuccess: async (responseData) => {
      clearSavedState(); // Clear any saved state from previous sessions
      await Swal.fire({
        title: "File Uploaded Successfully",
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

      try {
        const sessionID = responseData.content.session_id;
        console.log("Session ID:", sessionID);
        setSessionID(sessionID);
        setActiveSession(true);
        router.push("/dashboard");
      } catch (error) {
        console.error("Error parsing JSON response:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to parse server response.",
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
      }
    },
    
    onError: (error: Error) => {
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setIsMutating(true);
        Swal.fire({
          title: '<span class="bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent font-bold text-2xl">Analyzing Your File</span>',
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
          didOpen: () => {
            // Optional: Add subtle pulsating glow effect with JS if desired
          },
        });

        trigger(file).finally(() => {
          setIsMutating(false);
          Swal.close(); // Close the loading popup
        });
      }
    },
    multiple: false,
  });

  // Fetch sample network files with SWR
  const { data: sampleFiles, isLoading: isLoadingSamples } = useSWR(
    "sample-network-files",
    fetchAllSampleNetworkFiles,
    {
      shouldRetryOnError: false,
      onError: async (error) => {
        await Swal.fire({
          icon: "error",
          title: "Failed to Load Samples",
          text: "Unable to fetch sample network files.",
          confirmButtonText: "OK",
          timer: 1500,
          timerProgressBar: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
          background: "#fff",
          customClass: {
            popup: "rounded-xl shadow-2xl border border-red-200/50",
            title: "text-stone-900 font-bold text-2xl",
            confirmButton: "rounded-lg px-6 py-2 bg-red-500 text-white",
          },
        });
        console.error("Failed to fetch sample network files:", error);
      },
    }
  );

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const headerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.2 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, rotate: 2, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 text-stone-900">
      {/* Header Section */}
      <motion.div
        className="px-6 py-16 relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Advanced Animated Background */}
        <div className="absolute inset-0 animate-gradient-bg">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-orange-500 to-orange-700 opacity-80" />
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(234,88,12,0.6)_0%,_rgba(234,88,12,0)_70%)]"
            animate={{
              scale: [1, 1.1, 1],
              x: [-20, 20, -20],
              y: [-10, 10, -10],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,_rgba(251,146,60,0.5)_0%,_rgba(251,146,60,0)_60%)]"
            animate={{
              scale: [1.1, 1, 1.1],
              x: [20, -20, 20],
              y: [10, -10, 10],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Noise Texture Overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPjxmaWx0ZXIgaWQ9Im4iPjxmZUZsb29kIGZsb29kLWNvbG9yPSJyZ2IoMCwwLDApIiBmbG9vZC1vcGFjaXR5PSIuMSI+PC9mZUZsb29kPjxmZUNvbXBvc2l0ZSBpbj0iU291cmNlR3JhcGhpYyIgb3BlcmF0b3I9ImluIiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSI1IiBoZWlnaHQ9IjUiIGZpbGw9IiNmZmYiIGZpbHRlcj0idXJsKCNuKSI+PC9yZWN0Pjwvc3ZnPg==')] opacity-10" />
        </div>

        <div className="max-w-4xl w-full mx-auto relative z-10">
          <motion.div
            className="bg-white/95 backdrop-blur-md rounded-xl border border-orange-200/50 shadow-2xl p-8 md:p-12"
            variants={headerVariants}
          >
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h1 className="text-5xl font-extrabold text-stone-900 bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                NetViser
              </h1>
              <h2 className="text-xl font-semibold text-stone-700 mt-3 tracking-wide">
                Network Traffic Visualization Platform
              </h2>
            </motion.div>

            {/* Drag & Drop Box */}
            <motion.div
              {...getRootProps() as any}
              className={`group border-[0.25rem] border-dashed rounded-xl bg-gradient-to-br from-gray-50 to-gray-200 p-8 shadow-inner transition-all duration-300 ease-in-out ${
                isDragActive
                  ? "border-orange-500 bg-orange-50/50"
                  : "border-gray-300 hover:border-orange-400"
              } cursor-pointer`}
              whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(234, 88, 12, 0.2)" }}
              whileTap={{ scale: 0.98 }}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center space-y-4">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <TbUpload className="w-14 h-14 text-orange-500 group-hover:text-orange-600 transition-colors" />
                </motion.div>
                <div className="text-center space-y-2">
                  <p className="text-stone-800 font-medium text-lg">
                    {isDragActive
                      ? "Drop network data file..."
                      : "Drag PCAP/CSV file here"}
                  </p>
                  <p className="text-gray-500 text-sm">or</p>
                </div>
                <motion.label
                  className={`inline-flex items-center px-8 py-3 rounded-lg font-medium cursor-pointer bg-gradient-to-r ${
                    isMutating
                      ? "from-orange-400 to-orange-300 cursor-not-allowed"
                      : "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  } text-white shadow-md transition-all`}
                  variants={buttonVariants}
                  whileHover={!isMutating ? "hover" : undefined}
                  whileTap={!isMutating ? "tap" : undefined}
                >
                  <TbUpload className="w-6 h-6 mr-2" />
                  {isMutating ? "Uploading..." : "Browse Files"}
                </motion.label>
              </div>
            </motion.div>

            {/* Supported Formats */}
            <p className="text-sm text-gray-600 text-center mt-6 font-medium tracking-tight">
              Supported formats: <span className="text-orange-600">PCAP, CSV, NETFLOW</span> | Max size: 2GB
            </p>

            {/* Sample Network Files */}
            <motion.div
              className="mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold text-stone-900 mb-6 bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                Try Sample Network Files
              </h3>
              {isLoadingSamples ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array(4)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-xl border border-gray-200 p-4"
                      >
                        <Skeleton height={24} width="80%" className="mb-3" />
  
                        <div className="flex flex-wrap gap-2">
                          <Skeleton height={20} width={60} borderRadius={9999} />
                          <Skeleton height={20} width={80} borderRadius={9999} />
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sampleFiles?.map((file, index) => (
                    <SampleNetworkFileCard
                      key={index}
                      name={file.name}
                      featuredAttacks={file.featuredAttacks}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Instructions Section */}
      <motion.div
        className="bg-gradient-to-t from-gray-100 to-gray-50 px-6 py-20 relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-12 items-start">
          <div>
            <h3 className="text-3xl font-bold text-stone-900 mb-6 bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
              Getting Started with NetViser
            </h3>
            <p className="text-stone-700 mb-8 text-lg leading-relaxed">
              Follow these steps to detect and visualize your network traffic
              with the power of explainable AI
            </p>
            {[
              "Upload network capture files or synthetic attack datasets",
              "Explore automatic attack classification results",
              "Interact with temporal traffic visualizations",
              "Investigate feature contributions using XAI tools",
            ].map((step, index) => (
              <motion.div
                key={index}
                className="mb-8 group"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-baseline space-x-4 mb-3">
                  <motion.span
                    className="text-xl font-bold text-orange-500 flex-shrink-0"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    {index + 1}
                  </motion.span>
                  <p className="text-stone-700 text-lg group-hover:text-orange-600 transition-colors">
                    {step}
                  </p>
                </div>
                <motion.hr
                  className="border-orange-300/50"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  viewport={{ once: true }}
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            className="flex items-center justify-center mt-6 md:mt-0"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Image
              src="network.svg"
              alt="NetViser dashboard preview"
              width={400}
              height={300}
              className="max-w-full h-auto rounded-xl border border-orange-200/50 shadow-lg hover:shadow-xl transition-shadow"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}