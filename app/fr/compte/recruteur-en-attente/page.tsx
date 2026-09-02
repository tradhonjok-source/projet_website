'use client';

import { useUser, SignOutButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LogOut, Clock, Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function RecruteurEnAttentePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/fr/compte/connexion');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950/30 via-background to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/fr" className="text-xl font-bold gradient-text">Cabinet DETIE</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.firstName || 'Recruteur'}
            </span>
            <SignOutButton>
              <button className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </SignOutButton>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto mt-12">
          {/* Carte principale */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-full bg-amber-500/20">
                <Clock className="h-12 w-12 text-amber-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-amber-400">
                  Compte en attente de validation
                </h1>
                <p className="text-muted-foreground">
                  Votre demande est en cours de traitement
                </p>
              </div>
            </div>

            <div className="space-y-4 text-muted-foreground">
              <p>
                Bonjour <strong>{user?.firstName || 'recruteur'}</strong>,
              </p>
              <p>
                Votre compte recruteur a été créé avec succès. Cependant, avant de pouvoir accéder
                à nos services, il doit être validé par notre équipe administrative.
              </p>
              <div className="rounded-lg bg-background/50 p-4 border border-border">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Pourquoi cette validation ?
                </h3>
                <p className="text-sm">
                  Cette étape nous permet de vérifier la légitimité de votre entreprise et de
                  garantir la qualité de notre plateforme pour tous nos utilisateurs.
                </p>
              </div>
            </div>
          </div>

          {/* Prochaines étapes */}
          <div className="rounded-xl border border-border bg-background/50 p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Prochaines étapes</h2>
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Notre équipe examine votre demande</p>
                  <p className="text-sm text-muted-foreground">
                    Nous vérifions les informations fournies dans les 24-48 heures
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Vous recevez un email de décision</p>
                  <p className="text-sm text-muted-foreground">
                    Que votre compte soit validé ou rejeté, vous serez informé par email
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Accès à la plateforme</p>
                  <p className="text-sm text-muted-foreground">
                    Une fois validé, vous pourrez accéder au dashboard et publier des offres
                  </p>
                </div>
              </li>
            </ol>
          </div>

          {/* Informations pratiques */}
          <div className="rounded-xl border border-border bg-background/50 p-6">
            <h2 className="text-xl font-bold mb-4">Besoin d'aide ?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-violet-400 mt-0.5" />
                <div>
                  <p className="font-medium">Contactez notre équipe</p>
                  <p className="text-sm text-muted-foreground">
                    Une question ? Un doute sur votre demande ?
                    <br />
                    <a href="mailto:contact@cabinetdetie.com" className="text-violet-400 hover:underline">
                      contact@cabinetdetie.com
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5" />
                <div>
                  <p className="font-medium">Critères de validation</p>
                  <p className="text-sm text-muted-foreground">
                    Assurez-vous d'avoir fourni des informations complètes et exactes
                    sur votre entreprise pour accélérer le processus.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bouton retour */}
          <div className="mt-8 text-center">
            <Link
              href="/fr"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-500 text-white font-medium hover:bg-violet-600 transition-colors"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
