'use client';

import { useUser, SignOutButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, LogOut, Search, Mail, MapPin,
  Briefcase, GraduationCap, Star, Eye,
  CheckCircle, AlertCircle
} from 'lucide-react';

interface Candidat {
  id: string;
  clerkUserId: string;
  nomFamille: string | null;
  prenom: string | null;
  adresseVille: string | null;
  adresseProvince: string | null;
  telephone: string | null;
  etudes: any[] | null;
  experiences: any[] | null;
  createdAt: string;
}

export default function CandidatsRecruteurPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [secteurFilter, setSecteurFilter] = useState('');
  const [langueFilter, setLangueFilter] = useState('');
  const [hasSubscription, setHasSubscription] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/en/compte/connexion');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isSignedIn) {
      checkSubscription();
    }
  }, [isSignedIn]);

  const checkSubscription = async () => {
    try {
      const response = await fetch('/api/recruteur/abonnement');
      const data = await response.json();
      if (data.hasSubscription && data.subscription.isActive) {
        setHasSubscription(true);
        fetchCandidats();
      } else {
        setHasSubscription(false);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCandidats = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      if (secteurFilter) params.set('secteur', secteurFilter);
      if (langueFilter) params.set('langue', langueFilter);

      const response = await fetch(`/api/candidats?${params}`);
      if (response.ok) {
        const result = await response.json();
        setCandidats(result);
        setError(null);
      } else {
        const result = await response.json();
        setError(result.error || 'Error fetching candidates');
      }
    } catch (error) {
      console.error('Error loading candidates:', error);
      setError('Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasSubscription) {
      const timer = setTimeout(() => fetchCandidats(), 500);
      return () => clearTimeout(timer);
    }
  }, [searchTerm, secteurFilter, langueFilter, hasSubscription]);

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
        {/* Back button */}
        <Link
          href="/en/compte/dashboard/recruteur"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Candidates</h1>
          <p className="text-muted-foreground">
            Find the ideal talent among our candidates
          </p>
        </div>

        {/* Subscription check */}
        {!hasSubscription && !isLoading && (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-6 mb-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-amber-400 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-amber-400 mb-2">
                  Subscription Required
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  To access the candidate database and post jobs, you need to subscribe to a plan.
                </p>
                <Link
                  href="/en/compte/dashboard/recruteur/abonnement"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium hover:from-amber-600 hover:to-orange-700 transition-all"
                >
                  <CheckCircle className="h-4 w-4" />
                  Choose a plan
                </Link>
              </div>
            </div>
          </div>
        )}

        {hasSubscription && (
          <>
            {/* Search bar and filters */}
            <div className="grid gap-4 md:grid-cols-4 mb-8">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name, city, company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <select
                  value={secteurFilter}
                  onChange={(e) => setSecteurFilter(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="">All sectors</option>
                  <option value="technologie">Technology</option>
                  <option value="sante">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="construction">Construction</option>
                  <option value="services">Services</option>
                  <option value="manufacturier">Manufacturing</option>
                  <option value="finance">Finance</option>
                  <option value="commerce">Commerce</option>
                </select>
              </div>
              <div>
                <select
                  value={langueFilter}
                  onChange={(e) => setLangueFilter(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="">All languages</option>
                  <option value="français">French</option>
                  <option value="anglais">English</option>
                  <option value="espagnol">Spanish</option>
                  <option value="allemand">German</option>
                  <option value="italien">Italian</option>
                  <option value="portugais">Portuguese</option>
                  <option value="arabe">Arabic</option>
                  <option value="chinois">Chinese</option>
                </select>
              </div>
            </div>

            {/* Results */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full" />
              </div>
            ) : error ? (
              <div className="text-center py-12 rounded-xl border border-red-500/30 bg-red-500/10">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-400">{error}</p>
              </div>
            ) : candidats.length === 0 ? (
              <div className="text-center py-12 rounded-xl border border-border bg-background/50">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No candidates found</p>
                <p className="text-sm text-muted-foreground">
                  Try modifying your search criteria
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {candidats.map((candidat) => (
                  <div
                    key={candidat.id}
                    className="rounded-xl border border-border bg-background/50 p-6 hover:border-violet-500/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">
                            {candidat.prenom} {candidat.nomFamille}
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                          {candidat.adresseVille && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {candidat.adresseVille}, {candidat.adresseProvince || ''}
                            </span>
                          )}
                        </div>

                        {/* Experience */}
                        {candidat.experiences && Array.isArray(candidat.experiences) && candidat.experiences.length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                              <Briefcase className="h-4 w-4" />
                              Experience
                            </h4>
                            <div className="space-y-2">
                              {candidat.experiences.slice(0, 2).map((exp: any, i: number) => (
                                <div key={i} className="text-sm text-muted-foreground">
                                  <span className="font-medium">{exp.poste}</span>
                                  {exp.entreprise && <> at <span className="text-foreground">{exp.entreprise}</span></>}
                                  {exp.secteur && <span className="text-xs"> • {exp.secteur}</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Education */}
                        {candidat.etudes && Array.isArray(candidat.etudes) && candidat.etudes.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                              <GraduationCap className="h-4 w-4" />
                              Education
                            </h4>
                            <div className="space-y-1">
                              {candidat.etudes.slice(0, 2).map((etude: any, i: number) => (
                                <div key={i} className="text-sm text-muted-foreground">
                                  {etude.diplome}
                                  {etude.ecole && <span className="text-xs"> • {etude.ecole}</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {/* TODO: open detail modal */}}
                          className="px-4 py-2 rounded-xl bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-colors flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View profile
                        </button>
                        <button
                          onClick={() => {/* TODO: add to favorites */}}
                          className="p-2 rounded-lg hover:bg-amber-500/10 text-amber-400"
                          title="Add to favorites"
                        >
                          <Star className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
