/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude Prisma from edge runtime bundles
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "prisma"],
  },
};

export default nextConfig;
