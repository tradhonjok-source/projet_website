'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, Pencil, Trash2, CheckCircle2, XCircle,
  MapPin, Building2, DollarSign, Clock, Calendar
} from 'lucide-react';

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string | null;
  salary: string | null;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export default function OffreDetailPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const params = useParams();
  const [offre, setOffre] = useState<JobPosting | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/fr/compte/connexion');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isSignedIn && params.id) {
      fetchOffre();
    }
  }, [isSignedIn, params.id]);

  const fetchOffre = async () => {
    try {
      const response = await fetch(`/api/recruteur/offres?id=${params.id}`);
      if (response.ok) {
        const result = await response.json();
        setOffre(result);
      } else {
        router.push('/fr/compte/dashboard/recruteur/offres');
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) return;

    try {
      const response = await fetch(`/api/recruteur/offres?id=${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/fr/compte/dashboard/recruteur/offres?deleted=success');
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur de connexion au serveur');
    }
  };

  if (!isLoaded || !isSignedIn || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!offre) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Offre non trouvée</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950/30 via-background to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/fr" className="text-xl font-bold gradient-text">Cabinet DETIE</Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Header de page */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/fr/compte/dashboard/recruteur/offres"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la liste
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href={`/fr/compte/dashboard/recruteur/offres/${offre.id}/modifier`}
              className="px-4 py-2 rounded-xl bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-colors flex items-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              Modifier
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="max-w-3xl mx-auto space-y-6">
          {/* En-tête de l'offre */}
          <div className="rounded-xl border border-border bg-background/50 p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold">{offre.title}</h1>
                  {offre.isActive ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-400" />
                  )}
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    {offre.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {offre.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Métadonnées */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Créée le {new Date(offre.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              {offre.expiresAt && (
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Expire le {new Date(offre.expiresAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="rounded-xl border border-border bg-background/50 p-6">
            <h2 className="text-xl font-semibold mb-4">Description du poste</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{offre.description}</p>
          </div>

          {/* Exigences */}
          {offre.requirements && (
            <div className="rounded-xl border border-border bg-background/50 p-6">
              <h2 className="text-xl font-semibold mb-4">Exigences et qualifications</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{offre.requirements}</p>
            </div>
          )}

          {/* Rémunération */}
          {offre.salary && (
            <div className="rounded-xl border border-border bg-background/50 p-6">
              <h2 className="text-xl font-semibold mb-4">Rémunération</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="h-5 w-5" />
                {offre.salary}
              </div>
            </div>
          )}

          {/* Statut */}
          <div className={`rounded-xl border p-6 ${
            offre.isActive
              ? 'border-emerald-500/30 bg-emerald-500/10'
              : 'border-red-500/30 bg-red-500/10'
          }`}>
            <div className="flex items-center gap-2">
              {offre.isActive ? (
                <>
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  <span className="font-semibold text-emerald-400">Offre active</span>
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-red-400" />
                  <span className="font-semibold text-red-400">Offre expirée ou inactive</span>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
