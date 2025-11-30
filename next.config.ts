import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ["images.unsplash.com", "plus.unsplash.com", "images.pexels.com"], // add your allowed domains here
  },
};

export default nextConfig;
