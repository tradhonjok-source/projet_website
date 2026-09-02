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

  // Redirect if already connected with a role defined
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const existingRole = user.publicMetadata?.role as string;
      if (existingRole === 'candidat') {
        router.push('/es/compte/dashboard/candidat');
      } else if (existingRole === 'recruteur') {
        router.push('/es/compte/dashboard/recruteur');
      } else if (existingRole === 'admin') {
        router.push('/es/admin');
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  const handleSelectRole = async (role: 'candidat' | 'recruteur') => {
    setIsSettingRole(true);
    setError(null);

    try {
      // Actualizar rol a través de la API del servidor
      const response = await fetch('/api/user/set-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al establecer el rol');
      }

      if (role === 'candidat') {
        router.push('/es/compte/dashboard/candidat');
      } else {
        router.push('/es/compte/dashboard/recruteur');
      }
    } catch (err) {
      console.error('Error setting role:', err);
      setError((err as Error).message || 'Se produjo un error. Por favor, inténtelo de nuevo.');
      setIsSettingRole(false);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-950/50 via-background to-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950/30 via-background to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/es" className="text-xl font-bold gradient-text">Agencia DETIE</Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 gradient-text">
              ¡Bienvenido, {user?.firstName || user?.emailAddresses[0]?.emailAddress} !
            </h1>
            <p className="text-lg text-muted-foreground">
              Para comenzar, seleccione su perfil
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-8 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-center">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Role options */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Candidate card */}
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
                  <h3 className="text-2xl font-bold mb-2">Soy Candidato</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Busco empleo y quiero postular a ofertas
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>✓ Crear mi perfil</li>
                    <li>✓ Explorar ofertas</li>
                    <li>✓ Postular en línea</li>
                    <li>✓ Seguir candidaturas</li>
                  </ul>
                </div>
                <div className="mt-4 flex items-center gap-2 text-violet-400 font-medium">
                  <span>Comenzar</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>

            {/* Recruiter card */}
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
                  <h3 className="text-2xl font-bold mb-2">Soy Reclutador</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Quiero publicar ofertas y encontrar talento
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>✓ Publicar ofertas</li>
                    <li>✓ Buscar candidatos</li>
                    <li>✓ Gestionar candidaturas</li>
                    <li>✓ Acceder a estadísticas</li>
                  </ul>
                </div>
                <div className="mt-4 flex items-center gap-2 text-amber-400 font-medium">
                  <span>Comenzar</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          </div>

          {/* Loading state */}
          {isSettingRole && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Configurando su espacio...</span>
              </div>
            </div>
          )}

          {/* Back link */}
          <div className="mt-12 text-center">
            <Link
              href="/es"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Volver a la página de inicio
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
