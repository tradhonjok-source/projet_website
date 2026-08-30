'use client';

import { useUser, SignOutButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import {
  User, FileText, Briefcase, Settings, LogOut, ArrowRight,
  CheckCircle2, Clock, Mail, Phone, MapPin, Upload
} from 'lucide-react';

export default function DashboardCandidatPage() {
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
        <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950/30 via-background to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/en" className="text-xl font-bold gradient-text">
            Cabinet DETIE
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.firstName || 'User'}
            </span>
            <SignOutButton>
              <button className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </SignOutButton>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-emerald-400">
            Hello, {user?.firstName || 'Candidate'}!
          </h1>
          <p className="text-muted-foreground">
            Welcome to your candidate dashboard
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <StatCard icon={Briefcase} label="Jobs Viewed" value="12" gradient="from-violet-500 to-purple-600" />
          <StatCard icon={FileText} label="Applications" value="3" gradient="from-emerald-500 to-teal-600" />
          <StatCard icon={Clock} label="Pending" value="1" gradient="from-amber-500 to-orange-600" />
          <StatCard icon={CheckCircle2} label="Completed" value="2" gradient="from-blue-500 to-cyan-600" />
        </div>

        {/* Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ActionCard
            title="My Complete Profile"
            description="Foreign worker information + document upload (5 sections)"
            icon={User}
            href="/en/compte/profil/candidat"
            gradient="from-violet-500 to-purple-600"
          />
          <ActionCard
            title="Browse Job Offers"
            description="Discover opportunities"
            icon={Briefcase}
            href="/en/recruitment"
            gradient="from-blue-500 to-cyan-600"
          />
          <ActionCard
            title="My Applications"
            description="Track your submissions"
            icon={FileText}
            href="/en/compte/dashboard/candidat/candidatures"
            gradient="from-amber-500 to-orange-600"
          />
          <ActionCard
            title="Settings"
            description="Manage your account"
            icon={Settings}
            href="/en/compte/profil"
            gradient="from-slate-500 to-gray-600"
          />
          <ActionCard
            title="Contact"
            description="Need help?"
            icon={Mail}
            href="/en#contact"
            gradient="from-pink-500 to-rose-600"
          />
        </div>

        {/* Contact Info */}
        <div className="mt-8 rounded-2xl border border-border bg-background/50 p-6">
          <h2 className="text-xl font-semibold mb-4">Need help?</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <Mail className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-xs text-muted-foreground">contact@cabinetdetie.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                <Phone className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-xs text-muted-foreground">+1 (514) 980-8001</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
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
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, gradient }: any) {
  return (
    <div className="rounded-2xl border border-border bg-background/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <span className="text-2xl font-bold gradient-text">{value}</span>
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function ActionCard({ title, description, icon: Icon, href, gradient }: any) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-border bg-background/50 p-6 hover:border-emerald-500/30 transition-all"
    >
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} group-hover:scale-110 transition-transform`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-400 group-hover:gap-4 transition-all">
            Learn more <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
