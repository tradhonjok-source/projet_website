'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, Briefcase, ArrowRight, Loader2 } from 'lucide-react';

export default function SelectionRolePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const clerk = useClerk();
  const router = useRouter();
  const [isSettingRole, setIsSettingRole] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Rediriger si déjà connecté et qu'un rôle est déjà défini
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const existingRole = user.publicMetadata?.role as string;
      if (existingRole === 'candidat') {
        router.push('/fr/compte/dashboard/candidat');
      } else if (existingRole === 'recruteur') {
        router.push('/fr/compte/dashboard/recruteur');
      } else if (existingRole === 'admin') {
        router.push('/fr/admin');
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  const handleSelectRole = async (role: 'candidat' | 'recruteur') => {
    setIsSettingRole(true);
    setError(null);

    try {
      // Mettre à jour les metadata publiques de l'utilisateur avec le rôle
      await clerk.user.update({
        publicMetadata: { role },
      });

      // Rediriger vers le dashboard approprié
      if (role === 'candidat') {
        router.push('/fr/compte/dashboard/candidat');
      } else {
        router.push('/fr/compte/dashboard/recruteur');
      }
    } catch (err) {
      console.error('Erreur lors de la définition du rôle:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
      setIsSettingRole(false);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-950/50 via-background to-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950/30 via-background to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/fr" className="text-xl font-bold gradient-text">Cabinet DETIE</Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* En-tête */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 gradient-text">
              Bienvenue, {user?.firstName || user?.emailAddresses[0]?.emailAddress} !
            </h1>
            <p className="text-lg text-muted-foreground">
              Pour commencer, veuillez sélectionner votre profil
            </p>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="mb-8 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-center">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Options de rôle */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Carte Candidat */}
            <button
              onClick={() => handleSelectRole('candidat')}
              disabled={isSettingRole}
              className="group relative rounded-2xl border-2 border-border bg-background/50 p-8 text-left hover:border-violet-500/50 hover:bg-violet-500/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 group-hover:scale-110 transition-transform">
                  <User className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Je suis Candidat</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Je cherche un emploi et je veux postuler à des offres
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>✓ Créer mon profil</li>
                    <li>✓ Consulter les offres</li>
                    <li>✓ Postuler en ligne</li>
                    <li>✓ Suivre mes candidatures</li>
                  </ul>
                </div>
                <div className="mt-4 flex items-center gap-2 text-violet-400 font-medium">
                  <span>Commencer</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>

            {/* Carte Recruteur */}
            <button
              onClick={() => handleSelectRole('recruteur')}
              disabled={isSettingRole}
              className="group relative rounded-2xl border-2 border-border bg-background/50 p-8 text-left hover:border-amber-500/50 hover:bg-amber-500/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 group-hover:scale-110 transition-transform">
                  <Briefcase className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Je suis Recruteur</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Je veux publier des offres et trouver des talents
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>✓ Publier des offres</li>
                    <li>✓ Rechercher des candidats</li>
                    <li>✓ Gérer les candidatures</li>
                    <li>✓ Accéder aux statistiques</li>
                  </ul>
                </div>
                <div className="mt-4 flex items-center gap-2 text-amber-400 font-medium">
                  <span>Commencer</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          </div>

          {/* État de chargement */}
          {isSettingRole && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Configuration de votre espace...</span>
              </div>
            </div>
          )}

          {/* Lien retour */}
          <div className="mt-12 text-center">
            <Link
              href="/fr"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
