import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Disable experimental features that might cause permission issues
  experimental: {
    // Disable webpack build tracing
    webpackBuildWorker: false,
  },

  // Disable webpack build tracing to avoid Windows permission issues
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable webpack tracing in development
      config.infrastructureLogging = {
        level: 'error',
      };
      // Disable webpack cache to avoid permission issues
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
