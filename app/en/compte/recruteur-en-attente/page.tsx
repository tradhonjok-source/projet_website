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
      router.push('/en/compte/connexion');
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
          <Link href="/en" className="text-xl font-bold gradient-text">DETIE Agency</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.firstName || 'Recruiter'}
            </span>
            <SignOutButton>
              <button className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
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
                  Account pending validation
                </h1>
                <p className="text-muted-foreground">
                  Your request is being processed
                </p>
              </div>
            </div>

            <div className="space-y-4 text-muted-foreground">
              <p>
                Hello <strong>{user?.firstName || 'recruiter'}</strong>,
              </p>
              <p>
                Your recruiter account has been created successfully. However, before you can access
                our services, it must be validated by our administrative team.
              </p>
              <div className="rounded-lg bg-background/50 p-4 border border-border">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Why is this validation required?
                </h3>
                <p className="text-sm">
                  This step allows us to verify the legitimacy of your company and ensure
                  the quality of our platform for all our users.
                </p>
              </div>
            </div>
          </div>

          {/* Next steps */}
          <div className="rounded-xl border border-border bg-background/50 p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Next steps</h2>
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Our team reviews your application</p>
                  <p className="text-sm text-muted-foreground">
                    We verify the information provided within 24-48 hours
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">You receive a decision email</p>
                  <p className="text-sm text-muted-foreground">
                    Whether your account is validated or rejected, you will be informed by email
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Access to the platform</p>
                  <p className="text-sm text-muted-foreground">
                    Once validated, you will be able to access the dashboard and publish job offers
                  </p>
                </div>
              </li>
            </ol>
          </div>

          {/* Practical information */}
          <div className="rounded-xl border border-border bg-background/50 p-6">
            <h2 className="text-xl font-bold mb-4">Need help?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-violet-400 mt-0.5" />
                <div>
                  <p className="font-medium">Contact our team</p>
                  <p className="text-sm text-muted-foreground">
                    A question? Any doubts about your application?
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
                  <p className="font-medium">Validation criteria</p>
                  <p className="text-sm text-muted-foreground">
                    Make sure you have provided complete and accurate information
                    about your company to speed up the process.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Back button */}
          <div className="mt-8 text-center">
            <Link
              href="/en"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-500 text-white font-medium hover:bg-violet-600 transition-colors"
            >
              Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
