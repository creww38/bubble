/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'media.bubble.edu', 'images.unsplash.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  },
};

module.exports = nextConfig;