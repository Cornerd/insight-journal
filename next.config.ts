import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Disable output file tracing to avoid permission issues
  output: 'standalone',
  experimental: {
    // Optimize for development
    optimizePackageImports: ['@/components', '@/shared', '@/features'],
  },
};

export default nextConfig;
