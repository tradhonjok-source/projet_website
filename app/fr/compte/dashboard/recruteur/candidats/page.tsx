'use client';

import { useUser, SignOutButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, LogOut, Search, MapPin, Mail,
  Briefcase, Eye,
  CheckCircle, AlertCircle, X
} from 'lucide-react';

interface Candidat {
  id: string;
  nomFamille: string | null;
  prenom: string | null;
  adresseVille: string | null;
  adressePays: string | null;
  statutImmigration: string | null;
  createdAt: string;
}

export default function CandidatsRecruteurPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSubscription, setHasSubscription] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidat, setSelectedCandidat] = useState<Candidat | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/fr/compte/connexion');
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
      if (data.hasSubscription && data.subscription?.isActive) {
        setHasSubscription(true);
        fetchCandidats();
      } else {
        setHasSubscription(false);
      }
    } catch (error) {
      console.error('Erreur vérification abonnement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCandidats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const session = (window as any).Clerk?.session;
      const token = session ? await session.getToken() : '';
      const response = await fetch('/api/recruteur/candidats', {
        headers: {
          'x-clerk-user-id': user?.id || '',
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setCandidats(result.candidates || result);
      } else {
        const result = await response.json();
        throw new Error(result.error || 'Erreur lors de la récupération');
      }
    } catch (error) {
      console.error('Erreur chargement candidats:', error);
      setError((error as Error).message || 'Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasSubscription) {
      fetchCandidats();
    }
  }, [hasSubscription]);

  // Filtrer les candidats par recherche
  const filteredCandidats = candidats.filter(candidat => {
    const searchLower = searchTerm.toLowerCase();
    return (
      candidat.nomFamille?.toLowerCase().includes(searchLower) ||
      candidat.prenom?.toLowerCase().includes(searchLower) ||
      candidat.adresseVille?.toLowerCase().includes(searchLower) ||
      candidat.adressePays?.toLowerCase().includes(searchLower)
    );
  });

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
          <Link href="/fr" className="text-xl font-bold gradient-text">Cabinet DETIE</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.firstName || 'Recruteur'}
            </span>
            <SignOutButton>
              <button className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </SignOutButton>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Link
          href="/fr/compte/dashboard/recruteur"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au dashboard
        </Link>

        {/* Header de page */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Rechercher des candidats</h1>
          <p className="text-muted-foreground">
            Trouvez le talent idéal parmi nos candidats validés
          </p>
        </div>

        {/* Vérification abonnement */}
        {!hasSubscription && !isLoading && (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-6 mb-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-amber-400 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-amber-400 mb-2">
                  Abonnement requis
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Pour accéder à la base de candidats et publier des offres, vous devez souscrire à un forfait.
                </p>
                <Link
                  href="/fr/compte/dashboard/recruteur/abonnement"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium hover:from-amber-600 hover:to-orange-700 transition-all"
                >
                  <CheckCircle className="h-4 w-4" />
                  Choisir un forfait
                </Link>
              </div>
            </div>
          </div>
        )}

        {hasSubscription && (
          <>
            {/* Barre de recherche */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email, ville, pays..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            {/* Résultats */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full" />
              </div>
            ) : error ? (
              <div className="text-center py-12 rounded-xl border border-red-500/30 bg-red-500/10">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-400">{error}</p>
              </div>
            ) : filteredCandidats.length === 0 ? (
              <div className="text-center py-12 rounded-xl border border-border bg-background/50">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Aucun candidat trouvé</p>
                <p className="text-sm text-muted-foreground">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCandidats.map((candidat) => (
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
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                            <CheckCircle className="h-3 w-3" />
                            Validé
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                          {candidat.adresseVille && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {candidat.adresseVille}, {candidat.adressePays}
                            </span>
                          )}
                          {candidat.statutImmigration && (
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {candidat.statutImmigration}
                            </span>
                          )}
                        </div>

                        {/* Note: contact via le système uniquement - RGPD/Loi 25 */}
                        <div className="text-sm text-muted-foreground">
                          <p>Profil validé par notre équipe</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedCandidat(candidat);
                          setShowDetailsModal(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-colors flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Voir profil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal détails candidat */}
      {showDetailsModal && selectedCandidat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-xl bg-background border border-border p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                Profil de {selectedCandidat.prenom} {selectedCandidat.nomFamille}
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Informations limitées pour RGPD/Loi 25 */}
              <div className="rounded-xl bg-secondary/50 p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Localisation
                </h4>
                <div className="space-y-2 text-sm">
                  {selectedCandidat.adresseVille && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ville:</span>
                      <span>{selectedCandidat.adresseVille}</span>
                    </div>
                  )}
                  {selectedCandidat.adressePays && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pays de résidence:</span>
                      <span>{selectedCandidat.adressePays}</span>
                    </div>
                  )}
                  {selectedCandidat.statutImmigration && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Statut immigration:</span>
                      <span>{selectedCandidat.statutImmigration}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Date de candidature */}
              <div className="rounded-xl bg-secondary/50 p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date de candidature:</span>
                  <span>{new Date(selectedCandidat.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              {/* Note */}
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
                <p className="text-sm text-amber-200">
                  Pour contacter ce candidat, veuillez passer par notre système de mise en relation.
                  Ce candidat a été validé par notre équipe administrative.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-border bg-secondary/50 hover:bg-secondary transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
