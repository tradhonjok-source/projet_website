'use client';

import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock } from 'lucide-react';

export default function ConnexionPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-950/50 via-background to-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
          <Link
            href="/en"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30 mb-4">
              <Shield className="h-5 w-5 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">
                Secure Sign In
              </span>
            </div>

            <h1 className="text-3xl font-bold mb-2 gradient-text">
              My Account - Cabinet DETIE
            </h1>
            <p className="text-muted-foreground">
              Access your personal dashboard
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
              routing="path"
              path="/en/compte/connexion"
              signUpUrl="/en/compte/inscription"
            />
          </div>

          <div className="mt-6 text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Encrypted and secure connection</span>
            </div>

            <div className="flex items-center justify-center gap-4 text-sm">
              <Link href="/en/compte/inscription/candidat" className="text-violet-400 hover:text-violet-300 transition-colors">
                I am a Candidate
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/en/compte/inscription/recruteur" className="text-violet-400 hover:text-violet-300 transition-colors">
                I am a Recruiter
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Cabinet DETIE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
