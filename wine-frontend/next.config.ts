import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // ✅ Allow ALL remote images (not safe for production!)
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**", // matches any domain over HTTP
      },
      {
        protocol: "https",
        hostname: "**", // matches any domain over HTTPS
      },
    ],
  },
};

export default nextConfig;