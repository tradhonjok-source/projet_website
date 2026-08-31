'use client';

import { SignIn, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Shield, Lock } from 'lucide-react';

export default function ConnexionPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Redirection automatique après connexion selon le rôle
  useEffect(() => {
    if (isLoaded && isSignedIn && user && !isRedirecting) {
      setIsRedirecting(true);

      // Vérifier le rôle de l'utilisateur via les metadata publiques
      const userRole = user.publicMetadata?.role as string || '';

      if (userRole === 'candidat') {
        router.push('/fr/compte/dashboard/candidat');
      } else if (userRole === 'recruteur') {
        router.push('/fr/compte/dashboard/recruteur');
      } else if (userRole === 'admin') {
        router.push('/fr/admin');
      } else {
        // Si aucun rôle, rediriger vers la page de sélection
        router.push('/fr/compte/selection-role');
      }
    }
  }, [isLoaded, isSignedIn, user, router, isRedirecting]);

  // Si l'utilisateur est déjà connecté, afficher un écran de chargement
  if (isLoaded && isSignedIn && isRedirecting) {
    const userRole = user?.publicMetadata?.role as string || '';

    // Si aucun rôle, on va vers la page de sélection
    if (!userRole) {
      router.push('/fr/compte/selection-role');
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-950/50 via-background to-background">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full" />
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      );
    }

    const dashboardType = userRole === 'candidat' ? 'candidat' : userRole === 'recruteur' ? 'recruteur' : 'compte';

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-950/50 via-background to-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full" />
          <p className="text-muted-foreground">
            Redirection vers votre espace {dashboardType}...
          </p>
        </div>
      </div>
    );
  }

  // Afficher le formulaire de connexion si non connecté
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-950/50 via-background to-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
          <Link
            href="/fr"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30 mb-4">
              <Shield className="h-5 w-5 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">
                Connexion sécurisée
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2 gradient-text">
              Mon Compte Cabinet DETIE
            </h1>
            <p className="text-muted-foreground">
              Accédez à votre espace personnel
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-background/50 p-6 backdrop-blur-sm">
            <SignIn
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'shadow-none bg-transparent',
                  header: 'mb-6',
                  headerTitle: 'text-xl font-semibold',
                  socialButtons: 'gap-2',
                  socialButtonsIcon: 'h-4 w-4',
                  divider: 'text-muted-foreground',
                  footer: 'mt-6 pt-6 border-t border-border',
                  formFieldLabel: 'text-sm font-medium',
                  formFieldInput: 'h-12 rounded-xl border-border',
                  formButtonPrimary: 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 h-12 rounded-xl',
                  formFieldAction: 'text-violet-400',
                },
              }}
              routing="hash"
              signUpUrl="/fr/compte/inscription"
              forceRedirectUrl="/fr/compte/connexion"
            />
          </div>

          <div className="mt-6 text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Connexion cryptée et sécurisée</span>
            </div>
            <div className="flex items-center justify-center gap-4 text-sm">
              <Link href="/fr/compte/inscription/candidat" className="text-violet-400 hover:text-violet-300 transition-colors">
                Je suis Candidat
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/fr/compte/inscription/recruteur" className="text-violet-400 hover:text-violet-300 transition-colors">
                Je suis Recruteur
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Cabinet DETIE. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
