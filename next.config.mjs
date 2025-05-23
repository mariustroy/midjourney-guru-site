// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // simplest: exact-domain allow-list
    // domains: ['images.unsplash.com'],

    // or, if you prefer the newer wildcard syntax:
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mariustroy.com',
        port: '',          // empty string means “any port”
        pathname: '/**',   // allow every path
      },
    ],
  },
};

export default nextConfig;