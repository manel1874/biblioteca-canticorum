/** @type {import('next').NextConfig} */
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
  basePath: process.env.NODE_ENV === 'production' ? '/biblioteca-musica-liturgica' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/biblioteca-musica-liturgica/' : '',
}

export default nextConfig
