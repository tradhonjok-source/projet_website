'use client';

import { useUser, SignOutButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import {
  User, Building2, FileText, Briefcase, Settings, LogOut,
  CheckCircle2, Clock, ArrowRight, Mail, Phone, MapPin,
  Upload, Search, Star
} from 'lucide-react';

export default function DashboardPage() {
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
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Selection page if no type is defined
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950/50 via-background to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/en" className="text-xl font-bold gradient-text">
            Cabinet DETIE
          </Link>
          <SignOutButton>
            <button className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300">
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Welcome */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4 gradient-text">
              Hello, {user?.firstName || 'User'}!
            </h1>
            <p className="text-muted-foreground text-lg">
              Select your account type to continue
            </p>
          </div>

          {/* Choix du type de compte */}
          <div className="grid gap-6 md:grid-cols-2">
            <Link
              href="/en/compte/dashboard/candidat"
              className="group rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30 p-8 hover:border-emerald-500/60 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600">
                  <User className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-emerald-400">Candidate</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                I am looking for a job in Canada. I can:
              </p>
              <ul className="space-y-2">
                {['Upload my CV', 'Apply for job offers', 'Track my applications'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </Link>

            <Link
              href="/en/compte/dashboard/recruteur"
              className="group rounded-3xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-2 border-violet-500/30 p-8 hover:border-violet-500/60 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/20"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-violet-400">Recruiter</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                I am an employer. I can:
              </p>
              <ul className="space-y-2">
                {['Browse candidates', 'Post job offers', 'Contact talents'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-violet-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-12 rounded-2xl border border-border bg-background/50 p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Need help?</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center justify-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                  <Mail className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-xs text-muted-foreground">contact@cabinetdetie.com</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Phone className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-xs text-muted-foreground">+1 (514) 980-8001</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                  <MapPin className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-xs text-muted-foreground">Montreal, QC</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
