import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "placehold.co",
      "storage.googleapis.com" // Google Cloud Storage domain
    ],
  },
};

export default nextConfig;