'use client';

import { SignIn, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Lock, Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function ConnexionPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  // Si l'utilisateur est déjà connecté, afficher un bouton vers le dashboard
  if (isLoaded && isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-950/50 via-background to-background">
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
          <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
            <Link
              href="/es"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md text-center">
            <div className="mb-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30 mb-4">
                <Shield className="h-5 w-5 text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">
                  Ya conectado
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2 gradient-text">
                ¡Bienvenido!
              </h1>
              <p className="text-muted-foreground">
                Ya ha iniciado sesión en su cuenta
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background/50 p-6 backdrop-blur-sm space-y-4">
              <Link
                href="/es/compte/dashboard"
                className="block w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium hover:from-violet-700 hover:to-purple-700 transition-all"
              >
                Ir a mi cuenta
              </Link>
              <Link
                href="/es"
                className="block w-full py-3 rounded-xl border border-border hover:bg-border/10 transition-colors"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Afficher le formulaire de connexion si non connecté
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-950/50 via-background to-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
          <Link
            href="/es"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30 mb-4">
              <Shield className="h-5 w-5 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">
                Conexión segura
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2 gradient-text">
              Mi Cuenta Gabinete DETIE
            </h1>
            <p className="text-muted-foreground">
              Acceda a su espacio personal
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
              signUpUrl="/es/compte/inscription"
              afterSignInUrl="/es/compte/dashboard"
              afterSignUpUrl="/es/compte/dashboard"
            />
          </div>

          <div className="mt-6 text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Conexión encriptada y segura</span>
            </div>
            <div className="flex items-center justify-center gap-4 text-sm">
              <Link href="/es/compte/inscription/candidat" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">
                Soy Candidato
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/es/compte/inscription/recruteur" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">
                Soy Reclutador
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Gabinete DETIE. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
