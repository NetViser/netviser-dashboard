"use client";

import { useState } from "react";
import { TbUpload } from "react-icons/tb";
import { useDropzone } from "react-dropzone";
import useSWRMutation from "swr/mutation";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/store/session";
import { uploadFile } from "@/utils/client/uploadFIle";
import Image from "next/image";

const UPLOAD_URL = "http://localhost:8000/api/upload";

export default function Home() {
  const router = useRouter();
  const { setActiveSession } = useSessionStore();
  const [isMutating, setIsMutating] = useState(false);

  const { trigger } = useSWRMutation(UPLOAD_URL, uploadFile, {
    onSuccess: async () => {
      await Swal.fire({
        title: "File Uploaded Successfully",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });

      setActiveSession(true);
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "Close",
        confirmButtonColor: "#f44336",
      });
      console.error("Upload failed:", error);
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setIsMutating(true);
        trigger(file).finally(() => setIsMutating(false));
      }
    },
    multiple: false,
  });

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* Header Section */}
      <div className="bg-orange-600 flex px-4 relative h-[58vh]">
        {/* Overlapping Card */}
        <div className={`absolute inset-x-0 top-[56%] mx-auto max-w-4xl z-10 transform -translate-y-1/2`}>
          <div className="bg-white rounded-lg border border-2 shadow-sm p-6 md:p-10">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-extrabold text-gray-900">
                NetViser
              </h1>
              <h2 className="text-xl font-semibold text-gray-700 mt-2">
                Network Traffic Visualization Platform
              </h2>
            </div>

            {/* Drag & Drop Box */}
            <div
              {...getRootProps()}
              className={`group border-[0.20rem] border-dashed rounded-xl bg-gray-100 transition-colors duration-200 ease-in-out p-8 ${
                isDragActive ? "border-orange-500" : "border-gray-300"
              } hover:border-orange-400 cursor-pointer`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center space-y-4">
                <TbUpload className="w-12 h-12 text-orange-500 group-hover:text-orange-600 transition-colors" />
                <div className="text-center space-y-1">
                  <p className="text-gray-700 font-medium">
                    {isDragActive
                      ? "Drop network data file..."
                      : "Drag PCAP/CSV file here"}
                  </p>
                  <p className="text-gray-500 text-sm">or</p>
                </div>
                <label
                  className={`inline-flex items-center px-6 py-2 rounded-lg font-medium cursor-pointer ${
                    isMutating
                      ? "bg-orange-400"
                      : "bg-orange-500 hover:bg-orange-600"
                  } text-white transition-colors`}
                >
                  <TbUpload className="w-5 h-5 mr-2" />
                  {isMutating ? "Analyzing..." : "Browse Files"}
                </label>
              </div>
            </div>

            {/* Supported Formats */}
            <p className="text-sm text-gray-600 text-center mt-6">
              Supported formats: PCAP, CSV, NETFLOW | Max size: 2GB
            </p>
          </div>
        </div>
      </div>

      {/* Instructions Section */}
      <div className="bg-gray-100 px-4 py-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-8 items-start">
          {/* Left Content */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Getting Started with NetViser
            </h3>
            <p className="text-gray-700 mb-6">
              Follow these steps to convert a file to PDF or export a PDF to
              another format using the Acrobat PDF converter:
            </p>
            {[
              "Upload network capture files or synthetic attack datasets",
              "Explore automatic attack classification results",
              "Interact with temporal traffic visualizations",
              "Investigate feature contributions using XAI tools",
            ].map((step, index) => (
              <div className="mb-6" key={index}>
                <div className="flex items-baseline space-x-3 mb-2">
                  <span className="text-lg font-bold text-orange-500">
                    {index + 1}
                  </span>
                  <p className="text-gray-700">{step}</p>
                </div>
                <hr className="border-gray-300" />
              </div>
            ))}
          </div>

          {/* Right Illustration */}
          <div className="flex items-center justify-center mt-4 md:mt-0">
            <Image
              src="network.svg"
              alt="NetViser dashboard preview"
              width={400}
              height={300}
              className="max-w-full h-auto rounded-lg border border-gray-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
