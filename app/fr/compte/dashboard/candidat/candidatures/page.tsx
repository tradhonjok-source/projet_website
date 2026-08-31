'use client';

import { useUser, SignOutButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, LogOut, Briefcase, CheckCircle, Clock, XCircle, Eye } from 'lucide-react';

interface Candidature {
  id: string;
  offreTitre: string;
  entreprise: string;
  dateCandidature: string;
  statut: 'en_attente' | 'acceptee' | 'refusee';
}

export default function CandidaturesPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/fr/compte/connexion');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isSignedIn) {
      // TODO: Implémenter le chargement des candidatures depuis l'API
      // Pour l'instant, données fictives pour démonstration
      setCandidatures([
        {
          id: '1',
          offreTitre: 'Développeur Full Stack',
          entreprise: 'TechCorp Inc.',
          dateCandidature: '2024-08-15',
          statut: 'en_attente',
        },
        {
          id: '2',
          offreTitre: 'Chef de projet TI',
          entreprise: 'Innovatech',
          dateCandidature: '2024-08-10',
          statut: 'acceptee',
        },
        {
          id: '3',
          offreTitre: 'Analyste programmeur',
          entreprise: 'Solutions Numériques',
          dateCandidature: '2024-08-05',
          statut: 'refusee',
        },
      ]);
      setIsLoading(false);
    }
  }, [isSignedIn]);

  const getStatutInfo = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'En attente' };
      case 'acceptee':
        return { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Acceptée' };
      case 'refusee':
        return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Refusée' };
      default:
        return { icon: Clock, color: 'text-muted-foreground', bg: 'bg-background/50', border: 'border-border', label: statut };
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950/30 via-background to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/fr" className="text-xl font-bold gradient-text">Cabinet DETIE</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.firstName || 'Candidat'}
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
        {/* Back button */}
        <Link
          href="/fr/compte/dashboard/candidat"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au dashboard
        </Link>

        {/* Titre */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mes candidatures</h1>
          <p className="text-muted-foreground">
            Suivez l'état de vos candidatures
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-border bg-background/50 p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{candidatures.length}</p>
          </div>
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <p className="text-sm text-amber-400">En attente</p>
            <p className="text-2xl font-bold text-amber-400">
              {candidatures.filter(c => c.statut === 'en_attente').length}
            </p>
          </div>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <p className="text-sm text-emerald-400">Acceptées</p>
            <p className="text-2xl font-bold text-emerald-400">
              {candidatures.filter(c => c.statut === 'acceptee').length}
            </p>
          </div>
        </div>

        {/* Liste des candidatures */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full" />
          </div>
        ) : candidatures.length === 0 ? (
          <div className="text-center py-12 rounded-xl border border-border bg-background/50">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Aucune candidature</p>
            <Link
              href="/fr/recrutement#candidat"
              className="text-violet-400 hover:text-violet-300 font-medium"
            >
              Consulter les offres d'emploi
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {candidatures.map((candidature) => {
              const statutInfo = getStatutInfo(candidature.statut);
              const StatusIcon = statutInfo.icon;

              return (
                <div
                  key={candidature.id}
                  className="rounded-xl border border-border bg-background/50 p-6 hover:border-violet-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{candidature.offreTitre}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statutInfo.bg} ${statutInfo.color} border ${statutInfo.border}`}>
                          <StatusIcon className="h-3 w-3 inline mr-1" />
                          {statutInfo.label}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-2">{candidature.entreprise}</p>
                      <p className="text-sm text-muted-foreground">
                        Candidaté le {new Date(candidature.dateCandidature).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <Link
                      href={`/fr/compte/dashboard/candidat/candidatures/${candidature.id}`}
                      className="px-4 py-2 rounded-xl bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-colors flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Voir
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
