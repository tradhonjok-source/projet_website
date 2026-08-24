'use client';

import { Building2, User, Users, FileCheck, Handshake, Briefcase, Globe, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function RecruitmentPage() {
  const locale = 'es';

  return (
    <>
      <Header locale={locale} />
      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-b from-violet-500/10 via-background to-background">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 mb-6">
                <Globe className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium text-violet-400 uppercase">
                  Reclutamiento Internacional
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                <span className="gradient-text">Conéctese con los Mejores Talentos Globales</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Conectamos empleadores canadienses con los mejores talentos internacionales. Desde la selección hasta la integración, lo guiamos en cada paso.
              </p>
            </div>
          </div>
        </section>

        {/* Navigation Rapide */}
        <section className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="flex justify-center gap-4 py-4">
              <Link
                href="#empleador"
                className="px-6 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 font-medium hover:bg-violet-500/20 transition-all"
              >
                🏢 Soy Empleador
              </Link>
              <Link
                href="#candidato"
                className="px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium hover:bg-emerald-500/20 transition-all"
              >
                👤 Soy Candidato
              </Link>
            </div>
          </div>
        </section>

        {/* Dual Path Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Employers */}
              <div id="empleador" className="rounded-3xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-2 border-violet-500/30 p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600">
                    <Building2 className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-violet-400">Para Empleadores</h2>
                    <p className="text-sm text-muted-foreground">Encuentre los talentos ideales</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6">
                  Acceda a un vivero mundial de talentos calificados. Gestionamos todo el proceso de reclutamiento para usted.
                </p>

                <div className="space-y-4 mb-6">
                  {[
                    { icon: Users, title: 'Reclutamiento Internacional', desc: 'Acceso a un vivero mundial de talentos calificados' },
                    { icon: FileCheck, title: 'Gestión de Permisos', desc: 'Estudio de viabilidad LMIA y preparación CNESST' },
                    { icon: Handshake, title: 'Integración', desc: 'Orientación y seguimiento post-llegada 30/60/90 días' },
                  ].map((service, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
                        <service.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold mb-1">{service.title}</h3>
                        <p className="text-sm text-muted-foreground">{service.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link href="/es#contact" className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 text-sm font-medium text-white transition-all hover:scale-105">
                  Solicitar un Candidato
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Candidates */}
              <div id="candidato" className="rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30 p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600">
                    <User className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-emerald-400">Para Candidatos</h2>
                    <p className="text-sm text-muted-foreground">Trabaje en Canadá</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6">
                  Obtenga un permiso de trabajo temporal en Canadá. Lo acompañamos en todos sus trámites.
                </p>

                <div className="space-y-4 mb-6">
                  {[
                    { icon: Briefcase, title: 'Ofertas Verificadas', desc: 'Empleos preseleccionados con empleadores legítimos' },
                    { icon: FileCheck, title: 'Permiso CNESST', desc: 'Obtenga su permiso de trabajo con nuestro acompañamiento' },
                    { icon: Globe, title: 'Apoyo Jurídico', desc: 'Experiencia jurídica para todos sus trámites de inmigración' },
                  ].map((service, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                        <service.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold mb-1">{service.title}</h3>
                        <p className="text-sm text-muted-foreground">{service.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link href="/es#contact" className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-medium text-white transition-all hover:scale-105">
                  Postular Ahora
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-8">
                <span className="gradient-text">¿Por Qué Elegirnos?</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {[
                  { value: '50+', label: 'Países cubiertos' },
                  { value: '500+', label: 'Colocaciones exitosas' },
                  { value: '10+', label: 'Años de experiencia' },
                  { value: '100%', label: 'Satisfacción del cliente' },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-4">
                    <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="rounded-3xl bg-gradient-to-r from-violet-600/20 to-purple-600/20 border-2 border-violet-500/30 p-8 sm:p-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">¿Listo para Encontrar Su Talento?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Contáctenos hoy para discutir sus necesidades de reclutamiento internacional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    document.getElementById('empleador')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-violet-500/50"
                >
                  Soy Empleador
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {
                    document.getElementById('candidato')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/50"
                >
                  Soy Candidato
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer locale={locale} />
    </>
  );
}
