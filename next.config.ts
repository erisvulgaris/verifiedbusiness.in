import type { NextConfig } from "next";

/**
 * Next.js configuration for Bharat Directory.
 *
 * Quality settings:
 *  - reactStrictMode: catches unsafe lifecycles, accidental side effects, deprecated APIs
 *  - We do NOT ignore build errors — type safety is enforced at build time
 *  - standalone output for production deployment
 */
const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  // Production power-ups
  poweredByHeader: false,
  compress: true,
  // Security headers (augmented by Caddy in prod, but good to set here too)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
};

export default nextConfig;
