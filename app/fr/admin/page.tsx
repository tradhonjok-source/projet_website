'use client';

import { CheckCircle2, TrendingUp, Shield, Globe, Building2, FileText, Bus, BookOpen, Users, Briefcase, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface ServiceItem {
  icon: any;
  title: string;
  desc: string;
  items?: string[];
  href?: string;
}

const adminAgreeServices: ServiceItem[] = [
  {
    icon: TrendingUp,
    title: 'Conseiller en Restructuration Financière',
    desc: 'Le cabinet aide les entités en difficulté à surmonter leurs crises. Notre rôle consiste à analyser la situation, négocier avec les créanciers, restructurer la dette et élaborer des plans de redressement pour préserver la valeur de l\'entreprise et éviter la faillite. Au niveau de la dette des pays, nous privilégions des approches durables comme l\'audit citoyen.',
  },
  {
    icon: Building2,
    title: 'Gestionnaire d\'Actifs (Asset Manager)',
    desc: 'Nos experts sont des gestionnaires d\'actifs reconnus qui gèrent et font croître un portefeuille de placements durables pour des clients (Citoyens, entreprises ou fonds durables).',
    href: '/fr/admin/gestion-actifs',
  },
  {
    icon: Shield,
    title: 'Mandataire (Fiducie & Compte Fidéicommis)',
    desc: 'Notre cabinet, mandataire ou administrateur, gère l\'argent d\'une tierce personne via des outils précis : la fiducie (pour placer et protéger des biens sur le long terme) et le compte en fidéicommis (réservé aux professionnels pour garder l\'argent des clients en sécurité).',
  },
  {
    icon: Globe,
    title: 'Optimisation de la Programmation Stratégique des Territoires',
    desc: 'L\'optimisation de la programmation stratégique des territoires repose sur la concertation locale, l\'analyse des données et le suivi des objectifs. Ce processus permet d\'adapter les politiques publiques aux besoins réels.',
  },
  {
    icon: Building2,
    title: 'Centre Toor Siyo – Kaizen d\'Afrique',
    desc: 'Notre cabinet conçoit, développe et met en œuvre des solutions nouvelles avec des partenaires à travers le monde dans une dynamique d\'amélioration continue (produits, services, modèles d\'affaires ou politiques) pour répondre plus durablement aux défis sociétaux et environnementaux. Il place l\'humain et l\'impact collectif au cœur des décisions. Il est aussi un centre de simulation technique et technologique mondial au service des citoyens porteurs d\'idées innovatrices ou brevets.',
  },
  {
    icon: Bus,
    title: 'Programme HOTI PROS',
    desc: 'Une application mise au point avec des partenaires pour la protection des usagers du transport collectif et une transparence dans le domaine du transport rémunéré de personnes.',
  },
  {
    icon: BookOpen,
    title: 'Brochure Universelle de Vérification Somnaire de Taxi',
    desc: 'Le cabinet a mis à la disposition des professionnels du transport rémunéré un outil facile à utiliser pour la vérification de leurs véhicules avant-départ et édité en 3 langues (Français-Anglais-Espagnol). Disponible sur commande ou en librairie les 4 coins du Monde à Montréal.',
  },
];

const gestionAdminServices: ServiceItem[] = [
  {
    icon: FileText,
    title: 'Gestion Administrative',
    desc: 'Le cabinet assiste et conseille ses usagers dans la gestion administrative de leurs dossiers.',
    items: [
      'Évaluations de carrière',
      'Développement et optimisation du CV',
      'Préparation et accompagnement des entretiens',
      'Stratégie de recherche d\'emploi et ciblage',
      'Orientation professionnelle',
      'Conformité juridique',
    ],
  },
];

const lobbyingServices: ServiceItem[] = [
  {
    icon: Globe,
    title: 'Lobbyisme auprès des Institutions Internationales',
    desc: 'Le lobbyisme auprès des institutions internationales désigne l\'action d\'influencer des décisions politiques, économiques ou normatives au sein d\'organismes mondiaux comme l\'OCDE, l\'ONU ou l\'UE.',
  },
  {
    icon: Users,
    title: 'Lobbying pour Personnes Physiques et Institutions',
    desc: 'Représentation professionnelle pour des personnes physiques, des institutions privées, lucratives et non lucratives.',
  },
];

export default function AdminPage() {
  const localeTyped = 'fr' as const;

  return (
    <>
      <Header locale={localeTyped} />
      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-b from-amber-500/10 via-background to-background">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
                <CheckCircle2 className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-400 uppercase">
                  Administrateur Agréé - Membre de l'Ordre des Administrateurs Agréés du Québec - Canada
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                <span className="gradient-text">Services Professionnels Agréés</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Cabinet d'expertise multidisciplinaire offrant des services professionnels agréés au Québec et au Canada.
              </p>

              {/* Permis Ordre - Image Display */}
              <div className="mb-8">
                <a
                  href="/documents/permis-ordre.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block group"
                >
                  <div className="rounded-2xl overflow-hidden border-2 border-amber-500/30 hover:border-amber-500/60 transition-all shadow-lg hover:shadow-xl hover:shadow-amber-500/20">
                    <img
                      src="/images/permis-ordre.png"
                      alt="Permis de l'Ordre des Administrateurs Agréés du Québec"
                      className="w-full max-w-md h-auto group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-center mt-3">
                    <span className="text-sm text-amber-400 font-medium group-hover:underline">
                      Cliquez pour visualiser le document officiel
                    </span>
                  </div>
                </a>
              </div>

              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-amber-500/10 border-2 border-amber-500/30">
                <CheckCircle2 className="h-6 w-6 text-amber-400" />
                <div className="text-left">
                  <div className="text-sm font-bold text-amber-400">N° PERMIS AdmA A24-52400</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Administrateur Agréé */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 mb-6">
                <Briefcase className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium text-violet-400 uppercase">
                  Administrateur Agréé
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="gradient-text">Services d'Administration Agréée</span>
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
              {adminAgreeServices.map((service, index) => {
                const cardContent = (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 mb-4">
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3">{service.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
                  </>
                );

                return (
                  <div
                    key={index}
                    className={`rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/30 p-6 transition-all ${
                      service.href
                        ? 'hover:border-violet-500/60 cursor-pointer group'
                        : ''
                    }`}
                  >
                    {service.href ? (
                      <Link href={service.href} className="block h-full">
                        {cardContent}
                        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          En savoir plus
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    ) : (
                      cardContent
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 2: Gestion Administrative */}
        <section className="py-20 md:py-32 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
                <FileText className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400 uppercase">
                  Gestion Administrative
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="gradient-text">Services de Gestion de Carrière</span>
              </h2>
            </div>

            <div className="max-w-4xl mx-auto">
              {gestionAdminServices.map((service, index) => (
                <div key={index} className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 p-8 hover:border-emerald-500/60 transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                      <service.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-emerald-400">{service.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">{service.desc}</p>
                  <ul className="grid gap-3 md:grid-cols-2">
                    {service.items?.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Lobby-Conseil */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
                <Globe className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-400 uppercase">
                  Lobby-Conseil
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="gradient-text">Conseil aux Organisations Lucratives et Non Lucratives</span>
              </h2>
              <p className="text-lg text-muted-foreground">QUÉBEC - CANADA | N° LOBBY QUÉBEC 20260148</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
              {lobbyingServices.map((service, index) => (
                <div key={index} className="rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 p-8 hover:border-amber-500/60 transition-all">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 mb-4">
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Badge Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-amber-500/10 border-2 border-amber-500/30">
                <CheckCircle2 className="h-8 w-8 text-amber-400" />
                <div className="text-left">
                  <div className="text-lg font-bold text-amber-400">Permis CNESST Validé</div>
                  <div className="text-sm text-amber-400/80">AdmA A24-52400</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="rounded-3xl bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-2 border-amber-500/30 p-8 sm:p-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Besoin d'une Assistance Professionnelle ?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Notre équipe d'experts est prête à vous accompagner dans toutes vos démarches.
              </p>
              <Link href="/fr#contact" className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-amber-500/50">
                Nous Contacter
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer locale={localeTyped} />
    </>
  );
}
