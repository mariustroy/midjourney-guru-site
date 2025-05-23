// next.config.mjs
import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* ---------- image remotePatterns (unchanged) ---------- */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mariustroy.com",
        port: "",
        pathname: "guru-images/**",
      },
    ],
  },

  /* ---------- alias @ → ./src ---------- */
  webpack: (config) => {
    // make "@/..." resolve to "<project-root>/src/…"
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
};

export default nextConfig;