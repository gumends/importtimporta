import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
