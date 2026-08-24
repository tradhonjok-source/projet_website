'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp, Palette, Home, ArrowLeft, ArrowRight, CheckCircle2,
  Shield, Globe, Building2, FileText, Users, Award,
  Gem, Brush, Camera, Video, Hammer, Scissors, Mountain
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

type TabType = 'patrimoine' | 'artistes' | 'immobilier';

const tabs = [
  {
    id: 'patrimoine' as TabType,
    label: 'Gestion du Patrimoine Personnel',
    icon: TrendingUp,
    color: 'from-violet-500 to-purple-600'
  },
  {
    id: 'artistes' as TabType,
    label: 'Actifs Patrimoniaux - Créateurs',
    icon: Palette,
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'immobilier' as TabType,
    label: 'Actifs Immobiliers',
    icon: Home,
    color: 'from-emerald-500 to-teal-600'
  },
];

const artistCategories = [
  { name: "Peintres", icon: Brush },
  { name: "Sculpteurs", icon: Hammer },
  { name: "Photographes", icon: Camera },
  { name: "Vidéastes", icon: Video },
  { name: "Artisans", icon: Hammer },
  { name: "Gemmologues", icon: Gem },
  { name: "Créateurs", icon: Palette },
  { name: "Montagnes (œuvres)", icon: Mountain },
];

export default function GestionActifsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("patrimoine");

  return (
    <>
      <Header locale="fr" />
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-950/30 via-background to-background">

        {/* Back Button */}
        <section className="py-8 border-b border-border/40">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <Link
              href="/fr/admin"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux Services d'Administration Agréée
            </Link>
          </div>
        </section>

        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 mb-6">
                <Building2 className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium text-violet-400 uppercase">
                  Gestionnaire d'Actifs (Asset Manager)
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                <span className="gradient-text">Services de Gestion d'Actifs</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Nos experts sont des gestionnaires d'actifs reconnus qui gèrent et font croître
                un portefeuille de placements durables pour des clients (Citoyens, entreprises ou fonds durables).
              </p>
            </div>
          </div>
        </section>

        {/* Tabs Navigation */}
        <section className="py-8 border-y border-border/40 bg-background/50 backdrop-blur">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="flex flex-wrap justify-center gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all duration-300 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} border-transparent text-white shadow-lg`
                      : "bg-background/50 border-border hover:border-violet-500/30 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-white' : 'text-violet-400'}`} />
                  <span className="font-medium hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Tab Content */}
        <section className="py-16 md:py-24 flex-1">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">

            {/* Tab: Patrimoine Personnel */}
            {activeTab === "patrimoine" && (
              <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Main Card */}
                <div className="rounded-3xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-2 border-violet-500/30 p-8 md:p-12">
                  <div className="flex items-start gap-6 mb-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex-shrink-0">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-4 text-violet-400">
                        Gestion du Patrimoine Personnel
                      </h2>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        La gestion du patrimoine personnel implique une approche globale pour faire croître,
                        protéger et transmettre vos actifs. Cela inclut des conseils sur l'investissement,
                        la retraite, la succession, et l'entreprise.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-background/50 border border-border p-6 md:p-8">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Award className="h-5 w-5 text-violet-400" />
                      Rôle de l'Administrateur Agréé
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      L'Administrateur Agréé, avec votre mandat, analyse votre situation financière et vous offre
                      des recommandations personnalisées pour atteindre vos objectifs lucratifs ou communautaires.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        "Analyse complète de votre situation financière",
                        "Conseils en investissement stratégique",
                        "Planification de la retraite",
                        "Optimisation successorale",
                        "Transmission de patrimoine",
                        "Gestion d'entreprise familiale",
                        "Objectifs lucratifs et communautaires",
                        "Suivi et réajustement continu",
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-violet-500/5">
                          <CheckCircle2 className="h-5 w-5 text-violet-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Secondary Info */}
                <div className="rounded-2xl border border-border bg-background/50 p-6 md:p-8">
                  <h3 className="text-xl font-semibold mb-4">Pourquoi une gestion patrimoniale ?</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Une gestion patrimoniale efficace vous permet de maximiser votre potentiel financier tout en
                    minimisant les risques. Elle tient compte de votre profil investisseur, de vos objectifs de vie
                    et de votre situation fiscale pour élaborer une stratégie sur mesure.
                  </p>
                </div>
              </div>
            )}

            {/* Tab: Artistes & Créateurs */}
            {activeTab === "artistes" && (
              <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Main Card */}
                <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-2 border-amber-500/30 p-8 md:p-12">
                  <div className="flex items-start gap-6 mb-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex-shrink-0">
                      <Palette className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-4 text-amber-400">
                        Gestion d'Actifs Patrimoniaux - Créateurs & Artistes
                      </h2>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        Pour une gestion d'actifs patrimoniaux efficace, il est essentiel de comprendre
                        les différents types d'actifs possibles et de les valoriser adéquatement.
                      </p>
                    </div>
                  </div>

                  {/* Artist Categories Grid */}
                  <div className="rounded-2xl bg-background/50 border border-border p-6 md:p-8 mb-8">
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                      <Users className="h-5 w-5 text-amber-400" />
                      Catégories de Créateurs Accompagnés
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {artistCategories.map((category, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center gap-3 p-4 rounded-xl bg-amber-500/5 hover:bg-amber-500/10 transition-colors"
                        >
                          <category.icon className="h-8 w-8 text-amber-400" />
                          <span className="text-sm font-medium text-center">{category.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Asset Types */}
                  <div className="rounded-2xl bg-background/50 border border-border p-6 md:p-8">
                    <h3 className="text-xl font-semibold mb-4">Types d'Actifs Gérés</h3>
                    <p className="text-muted-foreground mb-6">
                      La première étape consiste à évaluer la situation patrimoniale actuelle, en faisant un bilan
                      patrimonial et en analysant les revenus et dépenses.
                    </p>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        "Actions & Obligations",
                        "Fonds communs de placement",
                        "Assurance vie",
                        "Résidence principale",
                        "Immobilier locatif",
                        "SCPI (Société Civile de Placement Immobilier)",
                        "Entreprise & Fonds de commerce",
                        "Œuvres d'art",
                        "Véhicules de collection",
                        "Pierres précieuses",
                        "Droits d'auteur & Brevets",
                        "Et plus encore...",
                      ].map((asset, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/5">
                          <CheckCircle2 className="h-4 w-4 text-amber-400 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{asset}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Process Info */}
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      icon: FileText,
                      title: "1. Bilan Patrimonial",
                      desc: "Évaluation complète de vos actifs, revenus et dépenses actuels.",
                    },
                    {
                      icon: TrendingUp,
                      title: "2. Stratégie de Croissance",
                      desc: "Élaboration d'un plan d'investissement adapté à vos objectifs.",
                    },
                    {
                      icon: Shield,
                      title: "3. Protection & Transmission",
                      desc: "Mise en place de dispositifs pour sécuriser et transmettre votre patrimoine.",
                    },
                  ].map((step, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-border bg-background/50 p-6 hover:border-amber-500/30 transition-colors"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 mb-4">
                        <step.icon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold mb-2">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Immobilier */}
            {activeTab === "immobilier" && (
              <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Main Card */}
                <div className="rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30 p-8 md:p-12">
                  <div className="flex items-start gap-6 mb-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex-shrink-0">
                      <Home className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-4 text-emerald-400">
                        Gestion d'Actifs Immobiliers
                      </h2>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        La gestion de biens immobiliers consiste à administrer, valoriser et sécuriser
                        un patrimoine immobilier pour le compte de propriétaires, en combinant expertise
                        juridique, financière et technique.
                      </p>
                    </div>
                  </div>

                  {/* Main Description */}
                  <div className="rounded-2xl bg-background/50 border border-border p-6 md:p-8 mb-8">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-emerald-400" />
                      Ensemble de Biens Fonciers et Immeubles
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      La gestion immobilière regroupe l'ensemble des actions nécessaires pour administrer
                      un bien résidentiel, commercial ou locatif. Elle vise à optimiser le rendement,
                      assurer la conformité réglementaire et garantir la satisfaction des occupants.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        "Gestion locative complète",
                        "Sélection et accompagnement des locataires",
                        "Établissement des baux et états des lieux",
                        "Encaissement des loyers et charges",
                        "Gestion des contentieux et impayés",
                        "Maintenance et réparations",
                        "Suivi des travaux et rénovations",
                        "Comptabilité et déclarations fiscales",
                        "Conseil stratégique patrimonial",
                        "Optimisation fiscale",
                        "Évaluation et expertise",
                        "Transactions et arbitrages",
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/5">
                          <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Property Types */}
                  <div className="rounded-2xl bg-background/50 border border-border p-6 md:p-8">
                    <h3 className="text-xl font-semibold mb-4">Types de Biens Gérés</h3>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { name: "Résidentiel", desc: "Appartements, maisons" },
                        { name: "Commercial", desc: "Bureaux, boutiques" },
                        { name: "Locatif", desc: "Investissement" },
                        { name: "Foncier", desc: "Terrains nus" },
                        { name: "Immeubles", desc: "Ensembles immobiliers" },
                        { name: "Mixte", desc: "Usage combiné" },
                      ].map((prop, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors"
                        >
                          <h4 className="font-semibold text-emerald-400 mb-1">{prop.name}</h4>
                          <p className="text-sm text-muted-foreground">{prop.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      icon: TrendingUp,
                      title: "Optimisation du Rendement",
                      desc: "Maximisation des revenus locatifs et de la plus-value à long terme.",
                    },
                    {
                      icon: Shield,
                      title: "Conformité Réglementaire",
                      desc: "Respect des obligations légales et réglementaires en vigueur.",
                    },
                    {
                      icon: Users,
                      title: "Satisfaction Occupants",
                      desc: "Gestion proactive pour assurer la qualité de vie et la fidélisation.",
                    },
                  ].map((benefit, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-border bg-background/50 p-6 hover:border-emerald-500/30 transition-colors"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-4">
                        <benefit.icon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold mb-2">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-violet-600/20 to-purple-600/20 border-t border-violet-500/30">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Besoin d'un Accompagnement Personnalisé ?
              </h2>
              <p className="text-muted-foreground mb-8">
                Nos experts en gestion d'actifs sont à votre disposition pour analyser votre situation
                et vous proposer les meilleures solutions.
              </p>
              <Link
                href="/fr#contact"
                className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-violet-500/50"
              >
                Prendre Rendez-vous
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        <Footer locale="fr" />
      </div>
    </>
  );
}
