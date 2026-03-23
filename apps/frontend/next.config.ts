import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NOTE: Removed 'output: export' to support API routes on Vercel
  // Static export only works without server-side features (API routes, middleware)
  //output: 'export',  // Commented out for API routes support
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
