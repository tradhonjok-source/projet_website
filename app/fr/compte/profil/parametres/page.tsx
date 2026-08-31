'use client';

import { useUser, SignOutButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, LogOut, Save, Bell, Shield, Globe, Trash2 } from 'lucide-react';

export default function ParametresPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/fr/compte/connexion');
    }
  }, [isLoaded, isSignedIn, router]);

  const handleSave = async () => {
    setIsSubmitting(true);
    // TODO: Implémenter la sauvegarde des paramètres
    await new Promise(resolve => setTimeout(resolve, 500));
    setSuccessMessage('Paramètres enregistrés avec succès');
    setIsSubmitting(false);
    setTimeout(() => setSuccessMessage(''), 3000);
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
              {user?.firstName || 'Utilisateur'}
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
          href="/fr/compte/profil"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au profil
        </Link>

        {/* Titre */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Paramètres du compte</h1>
          <p className="text-muted-foreground">
            Gérez vos préférences et paramètres de sécurité
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
            <span className="text-emerald-400">{successMessage}</span>
          </div>
        )}

        <div className="max-w-2xl space-y-6">
          {/* Notifications */}
          <div className="rounded-xl border border-border bg-background/50 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-violet-400" />
              Notifications
            </h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-sm">Notifications par email</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-border text-violet-500 focus:ring-violet-500/20" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm">Alertes de nouvelles offres</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-border text-violet-500 focus:ring-violet-500/20" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm">Newsletter mensuelle</span>
                <input type="checkbox" className="h-4 w-4 rounded border-border text-violet-500 focus:ring-violet-500/20" />
              </label>
            </div>
          </div>

          {/* Sécurité */}
          <div className="rounded-xl border border-border bg-background/50 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-violet-400" />
              Sécurité
            </h2>
            <div className="space-y-4">
              <button className="w-full text-left px-4 py-3 rounded-xl border border-border hover:bg-border/10 transition-colors">
                <p className="font-medium">Changer le mot de passe</p>
                <p className="text-sm text-muted-foreground">Modifiez votre mot de passe Clerk</p>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl border border-border hover:bg-border/10 transition-colors">
                <p className="font-medium">Authentification à deux facteurs</p>
                <p className="text-sm text-muted-foreground">Ajoutez une couche de sécurité supplémentaire</p>
              </button>
            </div>
          </div>

          {/* Langue et région */}
          <div className="rounded-xl border border-border bg-background/50 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-violet-400" />
              Langue et région
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Langue de l'interface</label>
                <select className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500">
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Fuseau horaire</label>
                <select className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500">
                  <option value="America/Montreal">Montréal (EST/EDT)</option>
                  <option value="America/Toronto">Toronto (EST/EDT)</option>
                  <option value="Europe/Paris">Paris (CET/CEST)</option>
                  <option value="Europe/Brussels">Bruxelles (CET/CEST)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Zone de danger */}
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-400">
              <Trash2 className="h-5 w-5" />
              Zone de danger
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Une fois que vous supprimez votre compte, il n'y a pas de retour en arrière. Soyez certain de vouloir continuer.
            </p>
            <button className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium">
              Supprimer mon compte
            </button>
          </div>

          {/* Bouton sauvegarder */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer les paramètres'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
