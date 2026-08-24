'use client';

import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { ArrowLeft, User } from 'lucide-react';

export default function InscriptionCandidatPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-950/30 via-background to-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
          <Link
            href="/en/compte/inscription"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to account types
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-4">
              <User className="h-8 w-8 text-white" />
            </div>

            <h1 className="text-2xl font-bold mb-2 text-emerald-400">
              Candidate Area
            </h1>
            <p className="text-muted-foreground text-sm">
              Create your account to apply for jobs
            </p>
          </div>

          <div className="mb-6 space-y-3">
            {[
              { title: 'Upload your CV', desc: 'Secure cloud storage' },
              { title: 'Apply for jobs', desc: 'Exclusive access to opportunities' },
              { title: 'Track applications', desc: 'Real-time dashboard' },
              { title: 'Custom alerts', desc: 'Get notified of new jobs' },
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
              path="/en/compte/inscription/candidat"
              signInUrl="/en/compte/connexion"
              forceRedirectUrl="/en/compte/dashboard"
            />
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/en/compte/connexion" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                Sign in
              </Link>
            </p>
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
