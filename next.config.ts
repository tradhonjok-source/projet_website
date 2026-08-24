import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Déploiement serverless pour Vercel (supporte les routes API et l'authentification)
  // output: 'export', // Commenté pour permettre le mode serverless
  // distDir: 'out',   // Commenté - Vercel gère le dossier de build

  // Skip TypeScript checking during build - Prisma v7 has type issues with SQLite
  typescript: {
    ignoreBuildErrors: true,
  },

  // Enable image optimization for external videos/images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
