'use client';

import { Building2, User, Users, FileCheck, Handshake, Briefcase, Globe, ArrowRight, Shield } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function RecruitmentPage() {
  const locale = 'fr';
  const isFr = true;

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
                  Recrutement International
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                <span className="gradient-text">Trouvez les Meilleurs Talents Mondiaux</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                De la sélection à l'intégration, nous vous accompagnons dans chaque étape du recrutement international.
              </p>

              {/* Permis Recrutement - PDF Inline */}
              <div className="mb-8">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30">
                    <FileCheck className="h-4 w-4 text-amber-400" />
                    <span className="text-sm font-medium text-amber-400 uppercase">
                      Permis de Recrutement DETIE
                    </span>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-xl bg-background">
                  <div className="w-full max-w-[1000px] mx-auto p-4">
                    {/* Rotated PDF container - 90deg counterclockwise */}
                    <div className="relative w-full" style={{ height: '650px' }}>
                      <div
                        className="absolute inset-0"
                        style={{
                          transform: 'rotate(-90deg)',
                          transformOrigin: 'center center',
                          width: '100%',
                          height: '100%'
                        }}
                      >
                        <iframe
                          src="/documents/permis-recrutement.pdf#toolbar=0&navpanes=0&scrollbar=0&zoom=page&view=FitH"
                          className="w-full h-full border-0"
                          title="Permis de Recrutement DETIE"
                          style={{
                            width: '650px',
                            height: '900px',
                            transform: 'scale(1.3)',
                            transformOrigin: 'top left'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <a
                    href="/documents/permis-recrutement.pdf"
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 font-medium hover:bg-amber-500/30 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Télécharger le document
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sceau Rouge Section */}
        <section className="py-16 bg-gradient-to-b from-violet-500/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-amber-600/20 rounded-full blur-2xl" />
                  <img
                    src="/images/sceau-rouge.jpg"
                    alt="Sceau Rouge du Canada"
                    className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-amber-500/30 shadow-2xl shadow-amber-500/20"
                  />
                </div>
                <div className="max-w-3xl">
                  <p className="text-lg sm:text-xl md:text-2xl font-bold leading-relaxed">
                    <span className="gradient-text">LE CABINET DETIE A POUR RÉFÉRENCE LE SCEAU ROUGE DU CANADA DANS LE DOMAINE DES MÉTIERS POUR SON RECRUTEMENT À L'INTERNATIONAL</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Rapide */}
        <section className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="flex justify-center gap-4 py-4">
              <Link
                href="#recruteur"
                className="px-6 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 font-medium hover:bg-violet-500/20 transition-all"
              >
                🏢 Je suis Recruteur
              </Link>
              <Link
                href="#candidat"
                className="px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium hover:bg-emerald-500/20 transition-all"
              >
                👤 Je suis Candidat
              </Link>
            </div>
          </div>
        </section>

        {/* Dual Path Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Recruiters */}
              <div id="recruteur" className="rounded-3xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-2 border-violet-500/30 p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600">
                    <Building2 className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-violet-400">Je suis Recruteur</h2>
                    <p className="text-sm text-muted-foreground">Entreprises & Employeurs</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6">
                  Accédez à un vivier mondial de talents qualifiés. Nous gérons tout le processus de recrutement pour vous.
                </p>

                <div className="space-y-4 mb-6">
                  {[
                    { icon: Users, title: 'Recrutement International', desc: 'Accédez à un vivier mondial de talents qualifiés.' },
                    { icon: FileCheck, title: 'Gestion des Permis', desc: 'Étude de faisabilité LMIA et préparation CNESST.' },
                    { icon: Handshake, title: 'Intégration', desc: 'Orientation et suivi post-arrivée 30/60/90 jours.' },
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

                <Link
                  href="/fr/compte/inscription/recruteur"
                  className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 text-sm font-medium text-white transition-all hover:scale-105"
                >
                  Créer un compte Recruteur
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Candidates */}
              <div id="candidat" className="rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30 p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600">
                    <User className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-emerald-400">Je suis Candidat</h2>
                    <p className="text-sm text-muted-foreground">Travailleurs Internationaux</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6">
                  Obtenez un permis de travail temporaire au Canada. Nous vous accompagnons dans toutes vos démarches.
                </p>

                <div className="space-y-4 mb-6">
                  {[
                    { icon: Briefcase, title: 'Offres Vérifiées', desc: 'Emplois pré-sélectionnés avec employeurs légitimes.' },
                    { icon: FileCheck, title: 'Permis CNESST', desc: 'Obtenez votre permis de travail avec notre accompagnement.' },
                    { icon: Globe, title: 'Support Juridique', desc: 'Expertise juridique pour toutes vos démarches d\'immigration.' },
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

                <Link
                  href="/fr/compte/inscription/candidat"
                  className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-medium text-white transition-all hover:scale-105"
                >
                  Créer un compte Candidat
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Info Section - Remplace le formulaire */}
        <section className="py-20 md:py-32 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl mx-auto text-center">
              {/* Data Protection Banner */}
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30 mb-6">
                <Shield className="h-6 w-6 text-emerald-400" />
                <div className="text-left">
                  <div className="text-sm font-bold text-emerald-400">
                    LE CABINET DETIE RESPECTE ET PROTÈGE VOS DONNÉES PERSONNELLES
                  </div>
                  <div className="text-xs text-emerald-400/80">
                    Conformité RGPD • Données sécurisées • Usage interne uniquement
                  </div>
                </div>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="gradient-text">Créez votre compte pour continuer</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Pour postuler aux offres ou consulter les candidats, vous devez créer un compte sur notre plateforme sécurisée.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/fr/compte/inscription/candidat"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/50"
                >
                  <User className="h-5 w-5" />
                  Je suis Candidat
                </Link>
                <Link
                  href="/fr/compte/inscription/recruteur"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-violet-500/50"
                >
                  <Building2 className="h-5 w-5" />
                  Je suis Recruteur
                </Link>
              </div>

              <p className="text-sm text-muted-foreground mt-6">
                Déjà un compte ?{' '}
                <Link href="/fr/compte/connexion" className="text-violet-400 hover:text-violet-300 font-medium">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-8">
                <span className="gradient-text">Pourquoi Nous Choisir ?</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {[
                  { value: '50+', label: 'Pays couverts' },
                  { value: '500+', label: 'Placements réussis' },
                  { value: '10+', label: "Années d'expérience" },
                  { value: '100%', label: 'Satisfaction client' },
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
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Prêt à Trouver Votre Talent ?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Contactez-nous dès aujourd'hui pour discuter de vos besoins en recrutement international.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/fr/compte/inscription/recruteur"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-violet-500/50"
                >
                  Je suis Recruteur
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/fr/compte/inscription/candidat"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/50"
                >
                  Je suis Candidat
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer locale={locale} />
    </>
  );
}
