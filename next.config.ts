import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { createMDX } from 'fumadocs-mdx/next'

const nextConfig: NextConfig = {
  ...(process.env.DOCKER_BUILD === 'true' && { output: 'standalone' }),
  // cacheComponents: true,

  /* config options here */
  devIndicators: false,

  // https://nextjs.org/docs/architecture/nextjs-compiler#remove-console
  // Remove all console.* calls in production only
  compiler: {
    // removeConsole: process.env.NODE_ENV === 'production',
  },
  /* config options here */
  reactCompiler: true,
  experimental: {
    mcpServer: true
  },

};

const withNextIntl = createNextIntlPlugin();

const withMDX = createMDX()

export default withMDX(withNextIntl(nextConfig));

