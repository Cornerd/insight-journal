import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Disable webpack build tracing to avoid Windows permission issues
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable webpack tracing in development
      config.infrastructureLogging = {
        level: 'error',
      };
    }
    return config;
  },
};

export default nextConfig;
