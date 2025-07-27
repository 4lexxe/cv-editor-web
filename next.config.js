/** @type {import('next').NextConfig} */
const nextConfig = {
  // This is a placeholder config to help Vercel detect Next.js
  // The actual app is built from apps/web
  experimental: {
    outputFileTracingRoot: __dirname,
  },
}

module.exports = nextConfig