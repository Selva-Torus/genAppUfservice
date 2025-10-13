/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/tt407/cgfa/tg4cgfa/v1',
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