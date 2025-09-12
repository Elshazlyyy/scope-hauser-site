import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images:
    process.env.NODE_ENV !== 'production'
      ? { unoptimized: true }
      : {},
};

export default nextConfig;
