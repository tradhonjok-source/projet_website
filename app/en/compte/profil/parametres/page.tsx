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
      router.push('/en/compte/connexion');
    }
  }, [isLoaded, isSignedIn, router]);

  const handleSave = async () => {
    setIsSubmitting(true);
    // TODO: Implement settings saving
    await new Promise(resolve => setTimeout(resolve, 500));
    setSuccessMessage('Settings saved successfully');
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
          <Link href="/en" className="text-xl font-bold gradient-text">DETIE Agency</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.firstName || 'User'}
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
          href="/en/compte/profil"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to profile
        </Link>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your preferences and security settings
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
                <span className="text-sm">Email notifications</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-border text-violet-500 focus:ring-violet-500/20" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm">New job alerts</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-border text-violet-500 focus:ring-violet-500/20" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm">Monthly newsletter</span>
                <input type="checkbox" className="h-4 w-4 rounded border-border text-violet-500 focus:ring-violet-500/20" />
              </label>
            </div>
          </div>

          {/* Security */}
          <div className="rounded-xl border border-border bg-background/50 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-violet-400" />
              Security
            </h2>
            <div className="space-y-4">
              <button className="w-full text-left p-3 rounded-lg hover:bg-background/50 transition-colors">
                <p className="font-medium">Change password</p>
                <p className="text-sm text-muted-foreground">Update your password regularly for security</p>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-background/50 transition-colors">
                <p className="font-medium">Two-factor authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </button>
            </div>
          </div>

          {/* Language */}
          <div className="rounded-xl border border-border bg-background/50 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-violet-400" />
              Language & Region
            </h2>
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm">Language</span>
                <select className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-sm">
                  <option>English</option>
                  <option>French</option>
                  <option>Spanish</option>
                </select>
              </label>
            </div>
          </div>

          {/* Danger zone */}
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-400">
              <Trash2 className="h-5 w-5" />
              Danger Zone
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors">
              Delete account
            </button>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save settings
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
