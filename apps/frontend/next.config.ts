import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // required for Docker — bundles server + dependencies into .next/standalone
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
