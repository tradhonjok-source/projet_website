'use client';

import { useUser, SignOutButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, LogOut, Plus, Eye, Pencil, Trash2, Search,
  CheckCircle2, XCircle, Clock
} from 'lucide-react';

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export default function OffresRecruteurPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [offres, setOffres] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/fr/compte/connexion');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isSignedIn) {
      fetchOffres();
    }
  }, [isSignedIn]);

  const fetchOffres = async () => {
    try {
      const response = await fetch('/api/recruteur/offres');
      if (response.ok) {
        const result = await response.json();
        setOffres(result);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des offres:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) return;

    try {
      const response = await fetch(`/api/recruteur/offres?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setOffres(offres.filter(o => o.id !== id));
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur de connexion au serveur');
    }
  };

  const offresFiltrees = offres.filter(offre =>
    offre.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offre.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offre.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const offresActives = offresFiltrees.filter(o => o.isActive);
  const offresExpirees = offresFiltrees.filter(o => !o.isActive);

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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestion des offres</h1>
            <p className="text-muted-foreground">
              Créez et gérez vos offres d'emploi
            </p>
          </div>
          <Link
            href="/fr/compte/dashboard/recruteur/offres/nouvelle"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            Nouvelle offre
          </Link>
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher une offre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-border bg-background/50 p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{offresFiltrees.length}</p>
          </div>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <p className="text-sm text-emerald-400">Actives</p>
            <p className="text-2xl font-bold text-emerald-400">{offresActives.length}</p>
          </div>
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-sm text-red-400">Expirées</p>
            <p className="text-2xl font-bold text-red-400">{offresExpirees.length}</p>
          </div>
        </div>

        {/* Liste des offres */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full" />
          </div>
        ) : offresFiltrees.length === 0 ? (
          <div className="text-center py-12 rounded-xl border border-border bg-background/50">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Aucune offre trouvée</p>
            <Link
              href="/fr/compte/dashboard/recruteur/offres/nouvelle"
              className="text-violet-400 hover:text-violet-300 font-medium"
            >
              Créer votre première offre
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {offresFiltrees.map((offre) => (
              <div
                key={offre.id}
                className="rounded-xl border border-border bg-background/50 p-6 hover:border-violet-500/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{offre.title}</h3>
                      {offre.isActive ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                    <p className="text-muted-foreground mb-2">{offre.company} • {offre.location}</p>
                    <p className="text-sm text-muted-foreground">
                      Créée le {new Date(offre.createdAt).toLocaleDateString('fr-FR')}
                      {offre.expiresAt && (
                        <> • Expire le {new Date(offre.expiresAt).toLocaleDateString('fr-FR')}</>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/fr/compte/dashboard/recruteur/offres/${offre.id}`}
                      className="p-2 rounded-lg hover:bg-violet-500/10 text-violet-400"
                      title="Voir les détails"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/fr/compte/dashboard/recruteur/offres/${offre.id}/modifier`}
                      className="p-2 rounded-lg hover:bg-violet-500/10 text-violet-400"
                      title="Modifier"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(offre.id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-red-400"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
