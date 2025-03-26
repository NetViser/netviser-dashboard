"use client";

import { useState } from "react";
import { TbUpload } from "react-icons/tb";
import { useDropzone } from "react-dropzone";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useUpload, UploadFileResult } from "@/hooks/useUpload";
import { fetchAllSampleNetworkFiles } from "@/utils/client/fetchAllSampleNetworkFiles";
import { motion } from "framer-motion";
import SampleNetworkFileCard from "@/components/network-file/sample-network-file-card";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import dynamic from "next/dynamic";
import { useGCSUploadProgressStore } from "@/store/gcs_upload_progress";
import { UploadDialog } from "@/components/modal/upload-dialog";
import { UploadErrorDialog } from "@/components/modal/upload-error-dialog";
import InstructionsSection from "@/components/home/instructions-section";
import { containerVariants, headerVariants, buttonVariants } from "@/utils/framer-motion";
import DisclaimerSection from "@/components/home/DisclaimerSection";

const DragDropBoxTour = dynamic(() => import("./tour/upload_tour"), {
  ssr: false,
});

const UPLOAD_URL = "/api/upload";

export default function Home() {
  const router = useRouter();
  const [isMutating, setIsMutating] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { upload, isLoading } = useUpload();
  const {
    uploadedBytesProgress,
    totalBytes,
    setTotalBytes,
    setUploadedBytesProgress,
  } = useGCSUploadProgressStore();

  const handleUploadSuccess = async (_responseData: UploadFileResult) => {
    setIsUploadDialogOpen(false);
    router.push("/dashboard");
  };

  const handleUploadError = (error: Error) => {
    setIsMutating(false);
    setIsUploadDialogOpen(false);
    setErrorMessage(error.message);
    setIsErrorDialogOpen(true);
    console.error("Upload failed:", error);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      setUploadedBytesProgress(0);
      setTotalBytes(0);
      const file = acceptedFiles[0];
      if (file) {
        setIsMutating(true);
        setIsUploadDialogOpen(true);

        upload(UPLOAD_URL, { arg: file })
          .then(handleUploadSuccess)
          .catch(handleUploadError)
          .finally(() => {
            setIsMutating(false);
          });
      }
    },
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0];
      if (rejection.errors.some((error) => error.code === "file-too-large")) {
        setErrorMessage("The file exceeds the maximum size limit of 1GB.");
        setIsErrorDialogOpen(true);
      }
    },
    multiple: false,
    accept: {
      "text/csv": [".csv"],
    },
    maxSize: 1073741824, // 1GB in bytes
  });

  // Fetch sample network files with SWR
  const { data, isLoading: isLoadingSamples } = useSWR(
    "sample-network-files",
    fetchAllSampleNetworkFiles,
    {
      shouldRetryOnError: false,
      onError: (error: Error) => {
        setErrorMessage("Unable to fetch sample network files.");
        setIsErrorDialogOpen(true);
        console.error("Failed to fetch sample network files:", error);
      },
    }
  );

  const sampleFiles = data?.sample_files;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 text-stone-900">
      <UploadDialog
        isOpen={isUploadDialogOpen}
        uploadedBytesProgress={uploadedBytesProgress}
        totalBytes={totalBytes}
      />
      <UploadErrorDialog
        isOpen={isErrorDialogOpen}
        errorMessage={errorMessage}
        onClose={() => setIsErrorDialogOpen(false)}
      />

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
              <DragDropBoxTour />
            </motion.div>

            {/* Drag & Drop Box */}
            <motion.div
              {...(getRootProps() as any)}
              className={`group border-[0.25rem] border-dashed rounded-xl bg-gradient-to-br from-gray-50 to-gray-200 p-8 shadow-inner transition-all duration-300 ease-in-out ${
                isDragActive
                  ? "border-orange-500 bg-orange-50/50"
                  : "border-gray-300 hover:border-orange-400"
              } cursor-pointer`}
              id="drag-drop-box"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 8px 24px rgba(234, 88, 12, 0.2)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center space-y-4">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <TbUpload className="w-14 h-14 text-orange-500 group-hover:text-orange-600 transition-colors" />
                </motion.div>
                <div className="text-center space-y-2">
                  <p className="text-stone-800 font-medium text-lg">
                    {isDragActive
                      ? "Drop network data file..."
                      : "Drag CSV file here"}
                  </p>
                  <p className="text-gray-500 text-sm">or</p>
                </div>
                <motion.label
                  className={`inline-flex items-center px-8 py-3 rounded-lg font-medium cursor-pointer bg-gradient-to-r ${
                    isMutating || isLoading
                      ? "from-orange-400 to-orange-300 cursor-not-allowed"
                      : "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  } text-white shadow-md transition-all`}
                  variants={buttonVariants}
                  whileHover={!(isMutating || isLoading) ? "hover" : undefined}
                  whileTap={!(isMutating || isLoading) ? "tap" : undefined}
                >
                  <TbUpload className="w-6 h-6 mr-2" />
                  {isMutating || isLoading ? "Uploading..." : "Browse Files"}
                </motion.label>
              </div>
            </motion.div>

            {/* Supported Formats */}
            <p className="text-sm text-gray-600 text-center mt-6 font-medium tracking-tight">
              Supported formats: <span className="text-orange-600">CSV</span> |
              Max size: <span className="text-orange-600">1GB</span>
            </p>

            {/* Disclaimer Section */}
            <DisclaimerSection />

            {/* Sample Network Files */}
            <motion.div
              className="mt-10"
              id="sample-file"
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
                          <Skeleton
                            height={20}
                            width={60}
                            borderRadius={9999}
                          />
                          <Skeleton
                            height={20}
                            width={80}
                            borderRadius={9999}
                          />
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

      <InstructionsSection />
    </div>
  );
}
