'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, CheckCircle, Clock, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({ nom: '', email: '', sujet: '', message: '' });
        if (result.devMode) {
          console.log('✅ Correo enviado (modo desarrollo - verifique la consola del servidor)');
        }
      } else {
        setSubmitError(result.error || 'Error al enviar el mensaje');
      }
    } catch (error) {
      console.error('Error de envío del formulario:', error);
      setSubmitError('Error de conexión con el servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950/30 via-background to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/es" className="text-xl font-bold gradient-text">Agencia DETIE</Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Título */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 gradient-text">Contáctenos</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ¿Una pregunta? ¿Un proyecto? Nuestro equipo está aquí para acompañarle en sus esfuerzos de reclutamiento internacional.
          </p>
        </div>

        {/* Información de contacto */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-border bg-background/50 p-6 text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-violet-500/10 mx-auto mb-4">
              <Mail className="h-6 w-6 text-violet-400" />
            </div>
            <h3 className="font-semibold mb-2">Correo electrónico</h3>
            <a href="mailto:contact@cabinetdetie.com" className="text-sm text-muted-foreground hover:text-violet-400 transition-colors">
              contact@cabinetdetie.com
            </a>
          </div>

          <div className="rounded-2xl border border-border bg-background/50 p-6 text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-500/10 mx-auto mb-4">
              <Phone className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="font-semibold mb-2">Teléfono</h3>
            <a href="tel:+15149808001" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors">
              +1 (514) 980-8001
            </a>
          </div>

          <div className="rounded-2xl border border-border bg-background/50 p-6 text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-amber-500/10 mx-auto mb-4">
              <MapPin className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="font-semibold mb-2">Dirección</h3>
            <p className="text-sm text-muted-foreground">
              Montreal, Quebec, Canadá
            </p>
          </div>
        </div>

        {/* Formulario de contacto */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Formulario */}
          <div className="rounded-2xl border border-border bg-background/50 p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-violet-400" />
              Envíenos un mensaje
            </h2>

            {submitSuccess && (
              <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">¡Mensaje enviado con éxito!</span>
              </div>
            )}

            {submitError && (
              <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-red-400" />
                <span className="text-red-400 font-medium">{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nom" className="block text-sm font-medium mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  placeholder="Su nombre"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="su@correo.com"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label htmlFor="sujet" className="block text-sm font-medium mb-2">
                  Asunto *
                </label>
                <select
                  id="sujet"
                  name="sujet"
                  value={formData.sujet}
                  onChange={(e) => setFormData(prev => ({ ...prev, sujet: e.target.value }))}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="">Seleccione un asunto</option>
                  <option value="recruteur">Soy reclutador</option>
                  <option value="candidat">Soy candidato</option>
                  <option value="partenariat">Asociación</option>
                  <option value="information">Solicitud de información</option>
                  <option value="autre">Otro</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Describa su solicitud..."
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Enviar mensaje
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Información adicional */}
          <div className="space-y-6">
            {/* Horarios */}
            <div className="rounded-2xl border border-border bg-background/50 p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Clock className="h-6 w-6 text-violet-400" />
                Horarios de apertura
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lunes - Viernes</span>
                  <span className="font-medium">8:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sábado</span>
                  <span className="font-medium">Con cita previa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Domingo</span>
                  <span className="font-medium">Cerrado</span>
                </div>
              </div>
            </div>

            {/* ¿Por qué contactarnos? */}
            <div className="rounded-2xl border border-border bg-background/50 p-8">
              <h2 className="text-2xl font-bold mb-6">¿Por qué contactarnos?</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5" />
                  <span className="text-muted-foreground">
                    Acompañamiento personalizado para reclutadores y candidatos
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5" />
                  <span className="text-muted-foreground">
                    Experiencia en inmigración y programas de movilidad
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5" />
                  <span className="text-muted-foreground">
                    Red internacional de socios certificados
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5" />
                  <span className="text-muted-foreground">
                    Soporte completo desde la candidatura hasta la contratación
                  </span>
                </li>
              </ul>
            </div>

            {/* Preguntas frecuentes */}
            <div className="rounded-2xl border border-border bg-background/50 p-8">
              <h2 className="text-2xl font-bold mb-6">Preguntas frecuentes</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">¿Cuánto cuesta una consulta?</h3>
                  <p className="text-sm text-muted-foreground">
                    La primera consulta es gratuita. Nuestros paquetes se adaptan a sus necesidades.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">¿Responden rápidamente?</h3>
                  <p className="text-sm text-muted-foreground">
                    Respondemos en un plazo de 24-48 horas laborables.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Cabinet DETIE. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
