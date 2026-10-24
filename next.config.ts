import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "importtimporta.s3.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
