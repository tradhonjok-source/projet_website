'use client';

import { useUser, SignOutButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LogOut, Clock, Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function RecruiterWaitingPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-amber-950/30 via-background to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/es" className="text-xl font-bold gradient-text">Agencia DETIE</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.firstName || 'Reclutador'}
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
        <div className="max-w-2xl mx-auto mt-12">
          {/* Main card */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-full bg-amber-500/20">
                <Clock className="h-12 w-12 text-amber-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-amber-400">
                  Cuenta pendiente de validación
                </h1>
                <p className="text-muted-foreground">
                  Su solicitud está siendo procesada
                </p>
              </div>
            </div>

            <div className="space-y-4 text-muted-foreground">
              <p>
                Hola <strong>{user?.firstName || 'reclutador'}</strong>,
              </p>
              <p>
                Su cuenta de reclutador ha sido creada con éxito. Sin embargo, antes de poder acceder
                a nuestros servicios, debe ser validada por nuestro equipo administrativo.
              </p>
              <div className="rounded-lg bg-background/50 p-4 border border-border">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  ¿Por qué esta validación?
                </h3>
                <p className="text-sm">
                  Este paso nos permite verificar la legitimidad de su empresa y garantizar
                  la calidad de nuestra plataforma para todos nuestros usuarios.
                </p>
              </div>
            </div>
          </div>

          {/* Next steps */}
          <div className="rounded-xl border border-border bg-background/50 p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Próximos pasos</h2>
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Nuestro equipo examina su solicitud</p>
                  <p className="text-sm text-muted-foreground">
                    Verificamos la información proporcionada en 24-48 horas
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Recibe un email de decisión</p>
                  <p className="text-sm text-muted-foreground">
                    Ya sea que su cuenta sea validada o rechazada, será informado por email
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Acceso a la plataforma</p>
                  <p className="text-sm text-muted-foreground">
                    Una vez validada, podrá acceder al dashboard y publicar ofertas
                  </p>
                </div>
              </li>
            </ol>
          </div>

          {/* Practical information */}
          <div className="rounded-xl border border-border bg-background/50 p-6">
            <h2 className="text-xl font-bold mb-4">¿Necesita ayuda?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-violet-400 mt-0.5" />
                <div>
                  <p className="font-medium">Contacte con nuestro equipo</p>
                  <p className="text-sm text-muted-foreground">
                    ¿Una pregunta? ¿Dudas sobre su solicitud?
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
                  <p className="font-medium">Criterios de validación</p>
                  <p className="text-sm text-muted-foreground">
                    Asegúrese de haber proporcionado información completa y exacta
                    sobre su empresa para acelerar el proceso.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Back button */}
          <div className="mt-8 text-center">
            <Link
              href="/es"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-500 text-white font-medium hover:bg-violet-600 transition-colors"
            >
              Volver a la página de inicio
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
