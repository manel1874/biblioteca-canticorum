/** 
 * @type {import('next').NextConfig} 
 * */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/biblioteca-canticorum' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/biblioteca-canticorum/' : '',
}

module.exports = nextConfig
