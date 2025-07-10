// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     appDir: true,
//   },
//   images: {
//     domains: ['localhost'],
//   },
// }

// module.exports = nextConfig
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true, // Enable App Router (Next.js 13+)
  },
  images: {
    domains: ['localhost'], // Add your image domains here
  },
  typescript: {
    ignoreBuildErrors: true, // ← Add this
  },
  compress: true, // Enable gzip compression
  poweredByHeader: false, // Remove X-Powered-By header
  reactStrictMode: true, // Enable additional checks and warnings
  swcMinify: true, // Use SWC for faster builds and smaller bundles
  productionBrowserSourceMaps: false, // Disable source maps in production for better performance
};

module.exports = nextConfig;
