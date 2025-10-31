import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "avatar.iran.liara.run", // ✅ Added this
      },
      {
        protocol: "https",
        hostname: "img.clerk.com", // ✅ Added this
      },
    ],
  },
};

export default nextConfig;
