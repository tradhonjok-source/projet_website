'use client';

import { useUser, SignOutButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import {
  User, Building2, FileText, Briefcase, Settings, LogOut, ArrowRight,
  CheckCircle
} from 'lucide-react';

export default function ProfilPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/es/compte/connexion');
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
    <div className="min-h-screen bg-gradient-to-br from-violet-950/30 via-background to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/es" className="text-xl font-bold gradient-text">
            Gabinete DETIE
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.firstName || 'Usuario'}
            </span>
            <SignOutButton>
              <button className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Cerrar sesión</span>
              </button>
            </SignOutButton>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-violet-400">
            Mi Perfil
          </h1>
          <p className="text-muted-foreground">
            Gestione sus informaciones personales y profesionales
          </p>
        </div>

        {/* Profile Cards */}
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
          {/* Candidat Card */}
          <Link
            href="/es/compte/profil/candidat"
            className="group rounded-2xl border border-border bg-background/50 p-6 hover:border-violet-500/30 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 group-hover:scale-110 transition-transform">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Perfil Candidato</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Informaciones personales, estudios, experiencias y documentos
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-violet-400 group-hover:gap-4 transition-all">
                  Acceder <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>

          {/* Recruteur Card */}
          <Link
            href="/es/compte/dashboard/recruteur/questionnaire"
            className="group rounded-2xl border border-border bg-background/50 p-6 hover:border-emerald-500/30 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 group-hover:scale-110 transition-transform">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Cuestionario Reclutador</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Empresa, lobbying, reclutamiento y trabajador extranjero
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-400 group-hover:gap-4 transition-all">
                  Completar <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>

          {/* Dashboard Card */}
          <Link
            href="/es/compte/dashboard"
            className="group rounded-2xl border border-border bg-background/50 p-6 hover:border-blue-500/30 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 group-hover:scale-110 transition-transform">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Tablero de Mando</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Vista de conjunto de su actividad
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-blue-400 group-hover:gap-4 transition-all">
                  Ver <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>

          {/* Settings Card */}
          <Link
            href="/es/compte/profil/parametres"
            className="group rounded-2xl border border-border bg-background/50 p-6 hover:border-amber-500/30 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 group-hover:scale-110 transition-transform">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Configuración</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Gestione su cuenta y sus preferencias
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-amber-400 group-hover:gap-4 transition-all">
                  Modificar <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Info Box */}
        <div className="mt-8 rounded-2xl border border-border bg-background/50 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            Informaciones importantes
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Los candidatos deben completar su perfil completo antes de postular a las ofertas</li>
            <li>• Los reclutadores deben completar el cuestionario para importar trabajadores extranjeros</li>
            <li>• Sus datos están almacenados de manera segura y conformes al RGPD</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
