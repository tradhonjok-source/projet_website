'use client';

import { useUser, SignOutButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, LogOut, Search, Mail, CheckCircle, XCircle,
  AlertCircle, Eye, Shield, UserCheck, UserX
} from 'lucide-react';

interface Recruteur {
  id: string;
  clerkId: string;
  email: string;
  role: string;
  isValidated: boolean;
  validatedAt: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  hasSubscription: boolean;
  subscriptionPlan?: string;
  subscriptionEnd?: string;
}

export default function AdminRecruteursPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [recruteurs, setRecruteurs] = useState<Recruteur[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'validated' | 'rejected'>('all');
  const [error, setError] = useState<string | null>(null);
  const [selectedRecruteur, setSelectedRecruteur] = useState<Recruteur | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<'validate' | 'reject' | 'details'>('details');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/fr/compte/connexion');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isSignedIn) {
      checkAdminRole();
    }
  }, [isSignedIn]);

  const checkAdminRole = async () => {
    const role = user?.publicMetadata?.role as string;
    if (role !== 'admin') {
      router.push('/fr/compte/dashboard');
      return;
    }
    fetchRecruteurs();
  };

  const fetchRecruteurs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const session = (window as any).Clerk?.session;
      const token = session ? await session.getToken() : '';
      const response = await fetch('/api/admin/recruteurs', {
        headers: {
          'x-clerk-user-id': user?.id || '',
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setRecruteurs(result.recruiters || []);
      } else {
        const result = await response.json();
        throw new Error(result.error || 'Erreur lors de la récupération');
      }
    } catch (error) {
      console.error('Erreur chargement recruteurs:', error);
      setError((error as Error).message || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedRecruteur) return;
    setIsProcessing(true);

    try {
      const session = (window as any).Clerk?.session;
      const token = session ? await session.getToken() : '';
      const response = await fetch('/api/admin/recruteurs/valider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-clerk-user-id': user?.id || '',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          recruiterId: selectedRecruteur.id,
          action: modalAction,
          reason: rejectionReason,
        }),
      });

      if (response.ok) {
        fetchRecruteurs();
        setShowModal(false);
        setRejectionReason('');
      } else {
        const result = await response.json();
        throw new Error(result.error || 'Erreur lors de la validation');
      }
    } catch (error) {
      console.error('Erreur action:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  const openModal = (recruteur: Recruteur, action: 'validate' | 'reject' | 'details') => {
    setSelectedRecruteur(recruteur);
    setModalAction(action);
    setRejectionReason('');
    setShowModal(true);
  };

  const filteredRecruteurs = recruteurs.filter(recruteur => {
    const matchesSearch = recruteur.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'pending') {
      return matchesSearch && !recruteur.isValidated && !recruteur.rejectedAt;
    }
    if (filter === 'validated') {
      return matchesSearch && recruteur.isValidated;
    }
    if (filter === 'rejected') {
      return matchesSearch && !!recruteur.rejectedAt;
    }
    return matchesSearch;
  });

  const stats = {
    total: recruteurs.length,
    pending: recruteurs.filter(r => !r.isValidated && !r.rejectedAt).length,
    validated: recruteurs.filter(r => r.isValidated).length,
    rejected: recruteurs.filter(r => r.rejectedAt).length,
  };

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
              {user?.firstName || 'Admin'}
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
          href="/fr/compte/dashboard/admin"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au dashboard admin
        </Link>

        {/* Header de page */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gestion des recruteurs</h1>
          <p className="text-muted-foreground">
            Validez ou rejetez les demandes de comptes recruteurs
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border border-border bg-background/50 p-6">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-violet-400" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total recruteurs</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-amber-400" />
              <div>
                <p className="text-2xl font-bold text-amber-400">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">En attente</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-6">
            <div className="flex items-center gap-3">
              <UserCheck className="h-8 w-8 text-emerald-400" />
              <div>
                <p className="text-2xl font-bold text-emerald-400">{stats.validated}</p>
                <p className="text-sm text-muted-foreground">Validés</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6">
            <div className="flex items-center gap-3">
              <UserX className="h-8 w-8 text-red-400" />
              <div>
                <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
                <p className="text-sm text-muted-foreground">Rejetés</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher par email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-violet-500 text-white'
                  : 'bg-secondary/50 hover:bg-secondary'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-amber-500 text-white'
                  : 'bg-secondary/50 hover:bg-secondary'
              }`}
            >
              En attente
            </button>
            <button
              onClick={() => setFilter('validated')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                filter === 'validated'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-secondary/50 hover:bg-secondary'
              }`}
            >
              Validés
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                filter === 'rejected'
                  ? 'bg-red-500 text-white'
                  : 'bg-secondary/50 hover:bg-secondary'
              }`}
            >
              Rejetés
            </button>
          </div>
        </div>

        {/* Liste des recruteurs */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full" />
          </div>
        ) : error ? (
          <div className="text-center py-12 rounded-xl border border-red-500/30 bg-red-500/10">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-400">{error}</p>
          </div>
        ) : filteredRecruteurs.length === 0 ? (
          <div className="text-center py-12 rounded-xl border border-border bg-background/50">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Aucun recruteur trouvé</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecruteurs.map((recruteur) => (
              <div
                key={recruteur.id}
                className="rounded-xl border border-border bg-background/50 p-6 hover:border-violet-500/30 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <h3 className="text-lg font-semibold">{recruteur.email}</h3>
                      {recruteur.isValidated ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                          <CheckCircle className="h-3 w-3" />
                          Validé
                        </span>
                      ) : recruteur.rejectedAt ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400">
                          <XCircle className="h-3 w-3" />
                          Rejeté
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400">
                          <AlertCircle className="h-3 w-3" />
                          En attente
                        </span>
                      )}
                      {recruteur.hasSubscription && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400">
                          <Shield className="h-3 w-3" />
                          Abonné
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Inscrit le {new Date(recruteur.createdAt).toLocaleDateString('fr-FR')}
                      {recruteur.validatedAt && (
                        <span className="ml-4">
                          • Validé le {new Date(recruteur.validatedAt).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                      {recruteur.rejectedAt && recruteur.rejectionReason && (
                        <span className="block mt-1 text-red-400">
                          Motif: {recruteur.rejectionReason}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!recruteur.isValidated && !recruteur.rejectedAt && (
                      <>
                        <button
                          onClick={() => openModal(recruteur, 'validate')}
                          className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Valider
                        </button>
                        <button
                          onClick={() => openModal(recruteur, 'reject')}
                          className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2"
                        >
                          <XCircle className="h-4 w-4" />
                          Rejeter
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => openModal(recruteur, 'details')}
                      className="px-4 py-2 rounded-xl bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-colors flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Détails
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && selectedRecruteur && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl bg-background border border-border p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-4">
              {modalAction === 'validate' && 'Valider ce recruteur ?'}
              {modalAction === 'reject' && 'Rejeter ce recruteur ?'}
              {modalAction === 'details' && 'Détails du recruteur'}
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{selectedRecruteur.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Statut:</span>
                <span className={
                  selectedRecruteur.isValidated ? 'text-emerald-400' :
                  selectedRecruteur.rejectedAt ? 'text-red-400' : 'text-amber-400'
                }>
                  {selectedRecruteur.isValidated ? 'Validé' :
                   selectedRecruteur.rejectedAt ? 'Rejeté' : 'En attente'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Inscription:</span>
                <span>{new Date(selectedRecruteur.createdAt).toLocaleDateString('fr-FR')}</span>
              </div>
              {selectedRecruteur.hasSubscription && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Abonnement:</span>
                  <span className="text-violet-400">{selectedRecruteur.subscriptionPlan}</span>
                </div>
              )}
              {selectedRecruteur.rejectionReason && (
                <div>
                  <span className="text-muted-foreground">Motif du rejet:</span>
                  <p className="mt-1 p-3 bg-red-500/10 rounded-lg text-red-400 text-sm">
                    {selectedRecruteur.rejectionReason}
                  </p>
                </div>
              )}
            </div>

            {modalAction === 'reject' && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Motif du rejet (optionnel)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Expliquez la raison du rejet..."
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-border bg-secondary/50 hover:bg-secondary transition-colors"
                disabled={isProcessing}
              >
                Annuler
              </button>
              {modalAction === 'validate' && (
                <button
                  onClick={handleAction}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Validation...' : 'Valider'}
                </button>
              )}
              {modalAction === 'reject' && (
                <button
                  onClick={handleAction}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Rejet...' : 'Rejeter'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
