/** @type {import('next').NextConfig} */
const nextConfig = {
    turbopack: {
      root: __dirname,  // Explicitly set the root directory
    },
    reactStrictMode: true,
  }
  
  module.exports = nextConfig