'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, X } from 'lucide-react';

export default function NouvelleOffrePage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    salary: '',
  });

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/es/compte/connexion');
    }
  }, [isLoaded, isSignedIn, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/recruteur/offres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/es/compte/dashboard/recruteur/offres?created=success');
      } else {
        const result = await response.json();
        alert(result.error || 'Error al crear');
      }
    } catch (error) {
      console.error('Error al crear la oferta:', error);
      alert('Error de conexión');
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/es" className="text-xl font-bold gradient-text">Agencia DETIE</Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/es/compte/dashboard/recruteur/offres"
              className="p-2 rounded-lg hover:bg-violet-500/10 text-violet-400"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold mb-2">Nueva Oferta de Empleo</h1>
              <p className="text-muted-foreground">Complete el formulario a continuación</p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
          {/* Información básica */}
          <div className="rounded-xl border border-border bg-background/50 p-6">
            <h2 className="text-xl font-semibold mb-4">Información Básica</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Título del Puesto *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Desarrollador Full Stack"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Nombre de la Empresa *
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  placeholder="Ej: TechCorp Inc."
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Ubicación *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Montreal, QC (Híbrido)"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="rounded-xl border border-border bg-background/50 p-6">
            <h2 className="text-xl font-semibold mb-4">Descripción del Puesto</h2>

            <div>
              <label className="block text-sm font-medium mb-2">
                Descripción *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Describa el puesto, las misiones principales..."
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Requisitos */}
          <div className="rounded-xl border border-border bg-background/50 p-6">
            <h2 className="text-xl font-semibold mb-4">Requisitos y Calificaciones</h2>

            <div>
              <label className="block text-sm font-medium mb-2">
                Requisitos
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={6}
                placeholder="Enumere las habilidades requeridas, educación, experiencia..."
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Compensación */}
          <div className="rounded-xl border border-border bg-background/50 p-6">
            <h2 className="text-xl font-semibold mb-4">Compensación</h2>

            <div>
              <label className="block text-sm font-medium mb-2">
                Salario (opcional)
              </label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Ej: $70,000 - $90,000 CAD / año"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href="/es/compte/dashboard/recruteur/offres"
              className="px-6 py-3 rounded-xl border border-border hover:bg-border/10 transition-colors flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Publicando...' : 'Publicar Oferta'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
