/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  experimental: {
    serverComponentsExternalPackages: ['@google/earthengine'],
  },
};

module.exports = nextConfig;
