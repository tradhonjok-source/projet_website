import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

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
    '/fr/admin',
    '/en/admin',
    '/es/admin',
    '/fr/admin/gestion-actifs',
    '/documents',
    '/images',
    '/flags',
    '/api/webhooks/clerk',
  ];

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
