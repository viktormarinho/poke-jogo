/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["raw.githubusercontent.com"]
  },
  reactStrictMode: false,
  swcMinify: true,
}

module.exports = nextConfig
