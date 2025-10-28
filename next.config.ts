import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    useCache: true,
  },
  /* config options here */
};

export default nextConfig;
