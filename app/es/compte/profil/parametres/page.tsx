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
      router.push('/es/compte/connexion');
    }
  }, [isLoaded, isSignedIn, router]);

  const handleSave = async () => {
    setIsSubmitting(true);
    // TODO: Implementar guardado de configuración
    await new Promise(resolve => setTimeout(resolve, 500));
    setSuccessMessage('Configuración guardada con éxito');
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
          <Link href="/es" className="text-xl font-bold gradient-text">Agencia DETIE</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.firstName || 'Usuario'}
            </span>
            <SignOutButton>
              <button className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Cerrar sesión</span>
              </button>
            </SignOutButton>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Botón volver */}
        <Link
          href="/es/compte/profil"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al perfil
        </Link>

        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Configuración de la Cuenta</h1>
          <p className="text-muted-foreground">
            Gestione sus preferencias y configuración de seguridad
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
            <span className="text-emerald-400">{successMessage}</span>
          </div>
        )}

        <div className="max-w-2xl space-y-6">
          {/* Notificaciones */}
          <div className="rounded-xl border border-border bg-background/50 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-violet-400" />
              Notificaciones
            </h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-sm">Notificaciones por correo</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-border text-violet-500 focus:ring-violet-500/20" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm">Alertas de nuevas ofertas</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-border text-violet-500 focus:ring-violet-500/20" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm">Boletín mensual</span>
                <input type="checkbox" className="h-4 w-4 rounded border-border text-violet-500 focus:ring-violet-500/20" />
              </label>
            </div>
          </div>

          {/* Seguridad */}
          <div className="rounded-xl border border-border bg-background/50 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-violet-400" />
              Seguridad
            </h2>
            <div className="space-y-4">
              <button className="w-full text-left p-3 rounded-lg hover:bg-background/50 transition-colors">
                <p className="font-medium">Cambiar contraseña</p>
                <p className="text-sm text-muted-foreground">Actualice su contraseña regularmente por seguridad</p>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-background/50 transition-colors">
                <p className="font-medium">Autenticación de dos factores</p>
                <p className="text-sm text-muted-foreground">Añada una capa extra de seguridad</p>
              </button>
            </div>
          </div>

          {/* Idioma */}
          <div className="rounded-xl border border-border bg-background/50 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-violet-400" />
              Idioma y Región
            </h2>
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm">Idioma</span>
                <select className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-sm">
                  <option>Español</option>
                  <option>Inglés</option>
                  <option>Francés</option>
                </select>
              </label>
            </div>
          </div>

          {/* Zona de peligro */}
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-400">
              <Trash2 className="h-5 w-5" />
              Zona de Peligro
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Una vez que elimine su cuenta, no hay vuelta atrás. Por favor, esté seguro.
            </p>
            <button className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors">
              Eliminar cuenta
            </button>
          </div>

          {/* Botón guardar */}
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Guardar configuración
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
