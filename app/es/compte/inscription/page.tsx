'use client';

import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { ArrowLeft, Shield, User, Building2 } from 'lucide-react';

export default function InscriptionPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-950/50 via-background to-background">
      {/* Header simplifié */}
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

      {/* Section principale */}
      <main className="flex-1 flex items-start justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          {/* En-tête */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30 mb-4">
              <Shield className="h-5 w-5 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">
                Inscripción segura
              </span>
            </div>

            <h1 className="text-3xl font-bold mb-2 gradient-text">
              Crear una cuenta Gabinete DETIE
            </h1>
            <p className="text-muted-foreground">
              Únase a nuestra plataforma de reclutamiento internacional
            </p>
          </div>

          {/* Choix du type de compte */}
          <div className="grid gap-4 md:grid-cols-2 mb-8">
            <Link
              href="/es/compte/inscription/candidat"
              className="group rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30 p-6 hover:border-emerald-500/60 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                  <User className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-emerald-400">Candidato</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Busco empleo en Canadá. Puedo depositar mi CV y postular a las ofertas.
              </p>
            </Link>

            <Link
              href="/es/compte/inscription/recruteur"
              className="group rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-2 border-violet-500/30 p-6 hover:border-violet-500/60 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/20"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-violet-400">Reclutador</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Soy empleador. Puedo consultar los candidatos y publicar ofertas.
              </p>
            </Link>
          </div>

          {/* Formulaire Clerk générique */}
          <div className="rounded-2xl border border-border bg-background/50 p-6 backdrop-blur-sm">
            <SignUp
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
              routing="path"
              path="/es/compte/inscription"
              signInUrl="/es/compte/connexion"
            />
          </div>

          {/* Liens utiles */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              ¿Ya tiene una cuenta?{' '}
              <Link href="/es/compte/connexion" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer simplifié */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Gabinete DETIE. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
