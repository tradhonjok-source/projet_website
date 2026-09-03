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
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com https://js.stripe.com https://www.paypal.com https://www.sandbox.paypal.com https://clerk.cabinetdetie.com https://cdn.clerk.com; style-src 'self' 'unsafe-inline' https://clerk.cabinetdetie.com https://cdn.clerk.com; img-src 'self' data: https:; font-src 'self' data: https://clerk.cabinetdetie.com https://cdn.clerk.com; connect-src 'self' https://api.clerk.com https://clerk.cabinetdetie.com https://api.stripe.com https://api.paypal.com https://maps.googleapis.com;",
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), payment=(self)',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
