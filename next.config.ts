import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "hackathon-2-tushar-mehta-backend.onrender.com",
        pathname: "/api/v1/media/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/api/v1/media/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3001",
        pathname: "/api/v1/media/**",
      },
    ],
  },
  experimental: {
    agentFeedback: true,
  },
  // Heavy on RAM during `next dev`; keep on for production builds.
  cacheComponents: isProd,
  partialPrefetching: isProd,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
