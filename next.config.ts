import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["placehold.co", "s3.ap-southeast-7.amazonaws.com", "amazonaws.com", "s3.ap-southeast-1.amazonaws.com"],
  },
};

export default nextConfig;
