'use client';

import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { ArrowLeft, User } from 'lucide-react';

export default function InscriptionCandidatPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-950/30 via-background to-background">
      {/* Header simplifié */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
          <Link
            href="/fr/compte/inscription"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux types de compte
          </Link>
        </div>
      </header>

      {/* Section principale */}
      <main className="flex-1 flex items-start justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* En-tête */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-4">
              <User className="h-8 w-8 text-white" />
            </div>

            <h1 className="text-2xl font-bold mb-2 text-emerald-400">
              Espace Candidat
            </h1>
            <p className="text-muted-foreground text-sm">
              Créez votre compte pour postuler aux offres
            </p>
          </div>

          {/* Avantages */}
          <div className="mb-6 space-y-3">
            {[
              { title: 'Déposer votre CV', desc: 'Stockage sécurisé dans le cloud' },
              { title: 'Postuler aux offres', desc: 'Accès exclusif aux opportunités' },
              { title: 'Suivre vos candidatures', desc: 'Tableau de bord en temps réel' },
              { title: 'Alertes personnalisées', desc: 'Soyez notifié des nouvelles offres' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 flex-shrink-0 mt-0.5">
                  <span className="text-xs text-emerald-400 font-medium">{i + 1}</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-emerald-400">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-sm text-emerald-400">
              💡 <strong>Après l'inscription</strong>, vous serez redirigé vers votre espace candidat où vous pourrez compléter votre profil.
            </p>
          </div>

          {/* Formulaire Clerk */}
          <div className="rounded-2xl border border-border bg-background/50 p-6 backdrop-blur-sm">
            <SignUp
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'shadow-none bg-transparent',
                  header: 'hidden',
                  socialButtons: 'gap-2',
                  socialButtonsIcon: 'h-4 w-4',
                  divider: 'text-muted-foreground',
                  footer: 'mt-6 pt-6 border-t border-border',
                  formFieldLabel: 'text-sm font-medium',
                  formFieldInput: 'h-12 rounded-xl border-border',
                  formButtonPrimary: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-12 rounded-xl',
                  formFieldAction: 'text-emerald-400',
                },
              }}
              routing="path"
              path="/fr/compte/inscription/candidat"
              signInUrl="/fr/compte/connexion"
              forceRedirectUrl="/fr/compte/dashboard"
            />
          </div>

          {/* Lien connexion */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Déjà un compte ?{' '}
              <Link href="/fr/compte/connexion" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer simplifié */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Cabinet DETIE. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
