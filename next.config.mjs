// next.config.mjs
import path from "path";
import { fileURLToPath } from "url";

/** convert import.meta.url → directory name */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mariustroy.com",
        pathname: "guru-images/**",
      },
    ],
  },

  /* alias @ → ./src  */
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
};

export default nextConfig;