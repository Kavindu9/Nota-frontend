import type { NextConfig } from "next";

const strapiUrl = new URL(process.env.STRAPI_URL ?? "http://localhost:1337");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      {
        protocol: strapiUrl.protocol.replace(":", "") as "http" | "https",
        hostname: strapiUrl.hostname,
        port: strapiUrl.port,
        pathname: "/uploads/**",
      },
    ],
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
