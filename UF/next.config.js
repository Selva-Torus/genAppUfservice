/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/ct242/tpptest001/tpptest002/v2',
  reactStrictMode: false,
  output: 'standalone',  // Add this line to enable standalone builds,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig