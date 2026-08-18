import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
      allowedOrigins: ["briefpad.onrender.com", "*.onrender.com"],
    },
  },
};

export default nextConfig;
