/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/ct010/i001/itax/v1',
  reactStrictMode: false,
  output: 'standalone',  // Add this line to enable standalone builds,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        pathname: "**",
      },
    ],
  },
}

module.exports = nextConfig