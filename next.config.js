/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.sanity.io'], // allow Sanity’s CDN so Image can optimize assets
  },
};

module.exports = nextConfig;
