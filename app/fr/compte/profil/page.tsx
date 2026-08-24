'use client';

import { useUser, SignOutButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import {
  Building2, User, Users, Briefcase, Settings, LogOut, ArrowRight,
  FileText, CheckCircle
} from 'lucide-react';

export default function ProfilPage() {
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

  // Déterminer le rôle de l'utilisateur (à adapter selon votre logique métier)
  const isRecruteur = user?.emailAddresses?.some(e =>
    e.emailAddress.includes('@cabinetdetie.com')
  ) || false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950/30 via-background to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/fr" className="text-xl font-bold gradient-text">
            Cabinet DETIE
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.firstName || 'Utilisateur'}
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
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-violet-400">
            Mon Profil
          </h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et professionnelles
          </p>
        </div>

        {/* Profile Cards */}
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
          {/* Candidat Card */}
          <Link
            href="/fr/compte/profil/candidat"
            className="group rounded-2xl border border-border bg-background/50 p-6 hover:border-violet-500/30 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 group-hover:scale-110 transition-transform">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Profil Candidat</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Renseignements personnel, études, expériences et documents
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-violet-400 group-hover:gap-4 transition-all">
                  Accéder <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>

          {/* Recruteur Card */}
          <Link
            href="/fr/compte/dashboard/recruteur/questionnaire"
            className="group rounded-2xl border border-border bg-background/50 p-6 hover:border-emerald-500/30 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 group-hover:scale-110 transition-transform">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Questionnaire Recruteur</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Entreprise, lobbying, recrutement et travailleur étranger
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-400 group-hover:gap-4 transition-all">
                  Remplir <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>

          {/* Dashboard Card */}
          <Link
            href="/fr/compte/dashboard"
            className="group rounded-2xl border border-border bg-background/50 p-6 hover:border-blue-500/30 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 group-hover:scale-110 transition-transform">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Tableau de bord</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Vue d'ensemble de votre activité
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-blue-400 group-hover:gap-4 transition-all">
                  Voir <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>

          {/* Settings Card */}
          <Link
            href="/fr/compte/profil/parametres"
            className="group rounded-2xl border border-border bg-background/50 p-6 hover:border-amber-500/30 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 group-hover:scale-110 transition-transform">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Paramètres</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Gérez votre compte et vos préférences
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-amber-400 group-hover:gap-4 transition-all">
                  Modifier <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Info Box */}
        <div className="mt-8 rounded-2xl border border-border bg-background/50 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            Informations importantes
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Les candidats doivent remplir leur profil complet avant de postuler aux offres</li>
            <li>• Les recruteurs doivent compléter le questionnaire pour importer des travailleurs étrangers</li>
            <li>• Vos données sont stockées de manière sécurisée et conformes au RGPD</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
