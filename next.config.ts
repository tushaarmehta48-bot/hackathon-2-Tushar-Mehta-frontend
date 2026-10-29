import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const apiOrigin =
  process.env.API_URL?.replace(/\/$/, "") ??
  "https://hackathon-2-tushar-mehta-backend.onrender.com";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiOrigin}/api/v1/:path*`,
      },
    ];
  },
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
