import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  // Routes publiques qui ne nécessitent pas d'authentification
  const publicRoutes = [
    '/',
    '/fr',
    '/en',
    '/es',
    '/fr/compte/connexion',
    '/fr/compte/inscription',
    '/fr/compte/inscription/recruteur',
    '/fr/compte/inscription/recruteur/sso-callback',
    '/fr/compte/inscription/candidat',
    '/fr/compte/inscription/candidat/sso-callback',
    '/fr/recrutement',
    '/en/recruitment',
    '/es/reclutamiento',
    '/documents',
    '/images',
    '/flags',
    '/api/webhooks/clerk',
  ];

  // Routes admin qui nécessitent un rôle admin
  const adminRoutes = [
    '/fr/admin',
    '/en/admin',
    '/es/admin',
    '/fr/compte/dashboard/admin',
    '/en/compte/dashboard/admin',
    '/es/compte/dashboard/admin',
  ];

  // Routes recruteur qui nécessitent un compte validé
  const recruiterRoutes = [
    '/fr/compte/dashboard/recruteur',
    '/en/compte/dashboard/recruteur',
    '/es/compte/dashboard/recruteur',
    '/api/recruteur',
  ];

  // Vérifier si c'est une route admin
  if (adminRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    if (!userId) {
      const signInUrl = new URL('/fr/compte/connexion', req.url);
      signInUrl.searchParams.set('redirect_url', pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Vérification du rôle admin côté serveur
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const userRole = user.publicMetadata?.role as string;

    if (userRole !== 'admin') {
      const forbiddenUrl = new URL('/fr', req.url);
      forbiddenUrl.searchParams.set('error', 'access_denied');
      return NextResponse.redirect(forbiddenUrl);
    }
  }

  // Vérifier si c'est une route recruteur - bloquer si non validé
  if (recruiterRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    if (!userId) {
      const signInUrl = new URL('/fr/compte/connexion', req.url);
      signInUrl.searchParams.set('redirect_url', pathname);
      return NextResponse.redirect(signInUrl);
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const userRole = user.publicMetadata?.role as string;

    if (userRole === 'recruteur') {
      // Vérifier la validation dans la base de données
      const prisma = await import('@/lib/prisma').then(m => m.createPrismaClient());
      try {
        const dbUser = await prisma.user.findUnique({
          where: { clerkId: userId },
          select: { isValidated: true, rejectedAt: true },
        });

        if (!dbUser?.isValidated) {
          // Rediriger vers page d'attente de validation
          const pendingUrl = new URL('/fr/compte/recruteur-en-attente', req.url);
          return NextResponse.redirect(pendingUrl);
        }
      } finally {
        await prisma.$disconnect();
      }
    }
  }

  // Si c'est une route publique, on ne fait rien
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return NextResponse.next();
  }

  // Si l'utilisateur n'est pas authentifié et essaie d'accéder à une route protégée
  if (!userId) {
    // Rediriger vers la page de connexion avec l'URL de redirection
    const signInUrl = new URL('/fr/compte/connexion', req.url);
    signInUrl.searchParams.set('redirect_url', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Utilisateur authentifié - continuer normalement
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|eot|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
