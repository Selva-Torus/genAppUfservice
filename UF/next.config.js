/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/ct003/ag001/oprmatrix/v1',
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