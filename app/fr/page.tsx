'use client';

import Link from 'next/link';
import { Users, Briefcase, CheckCircle2, ArrowRight, Award, Star, Globe, Clock, Target, Heart, Lightbulb, Shield, FileText, Handshake, TrendingUp, Zap, Building2, User, Mail, Phone, MapPin } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { HeroSlideshow } from '@/components/effects/HeroSlideshow';

export default function HomePage() {
  return (
    <>
      <Header locale="fr" />
      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-violet-950/50 via-background to-background pt-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
            <div className="text-center max-w-5xl mx-auto">
              {/* Slideshow Rectangle */}
              <HeroSlideshow />

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 mb-8 backdrop-blur-sm"
              >
                <CheckCircle2 className="h-4 w-4 text-violet-400" />
                <span className="text-xs sm:text-sm font-medium text-violet-300">
                  Permis CNESST : AdmA A24-52400
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
              >
                <span className="gradient-text">Bienvenue au Cabinet DETIE</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl sm:text-2xl md:text-3xl font-semibold text-violet-300 max-w-3xl mx-auto mb-6 italic"
              >
                Ensemble pour l'excellence
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-4 leading-relaxed"
              >
                Votre partenaire de confiance en <span className="text-violet-400 font-semibold">Recrutement International</span> et <span className="text-amber-400 font-semibold">Services Administratifs Agréés</span> au Canada
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
              >
                Depuis plus de 10 ans, le Cabinet d'Expertise DETIE s'impose comme un partenaire privilégié pour les entreprises et les professionnels à la recherche d'excellence et de rigueur. Forts de notre double expertise en recrutement international et administration agréée, nous accompagnons nos clients dans leurs projets les plus stratégiques avec une approche personnalisée et des solutions sur mesure.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
              >
                <Link
                  href="/fr/recrutement"
                  className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/50 w-full sm:w-auto justify-center"
                >
                  <Users className="h-5 w-5" />
                  Recrutement International
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                </Link>

                <Link
                  href="/fr/admin"
                  className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50 w-full sm:w-auto justify-center"
                >
                  <Briefcase className="h-5 w-5" />
                  Administrateur Agréé
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 border-t border-border/50"
              >
                {[
                  { value: '10+', label: "Années d'Expérience", icon: Award },
                  { value: '500+', label: 'Clients Satisfaits', icon: Users },
                  { value: '50+', label: 'Pays Couverts', icon: Globe },
                  { value: '100%', label: 'Satisfaction Client', icon: Star },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-center group"
                  >
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-violet-500/10 mb-3 group-hover:bg-violet-500/20 transition-colors">
                      <stat.icon className="h-5 w-5 text-violet-400" />
                    </div>
                    <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>


        {/* SECTEUR 1: RECRUTEMENT INTERNATIONAL */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 via-transparent to-transparent" />

          <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 mb-6">
                <Users className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium text-violet-400 uppercase tracking-wider">Recrutement International</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">Connectez-vous aux Meilleurs Talents Mondiaux</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Nous connectons les employeurs canadiens avec les meilleurs talents internationaux. De la sélection à l'intégration, nous vous guidons à chaque étape.
              </p>
            </div>

            {/* Two Columns: Employers & Candidates */}
            <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
              {/* Employers Card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-2 border-violet-500/30 p-8 hover:border-violet-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/20"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-violet-400">Pour les Employeurs</h3>
                    <p className="text-sm text-muted-foreground">Trouvez les talents idéaux</p>
                  </div>
                </div>

                <ul className="space-y-4 mb-6">
                  {[
                    { icon: FileText, text: 'Accès à un vivier mondial de talents qualifiés' },
                    { icon: CheckCircle2, text: 'Sélection rigoureuse et personnalisée' },
                    { icon: Handshake, text: 'Gestion complète des permis de travail' },
                    { icon: TrendingUp, text: 'Intégration réussie de vos nouveaux employés' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <item.icon className="h-5 w-5 text-violet-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{item.text}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/fr/recrutement" className="inline-flex items-center gap-2 text-violet-400 font-medium hover:gap-4 transition-all">
                  En Savoir Plus
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>

              {/* Candidates Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30 p-8 hover:border-emerald-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-emerald-400">Pour les Candidats</h3>
                    <p className="text-sm text-muted-foreground">Travaillez au Canada</p>
                  </div>
                </div>

                <ul className="space-y-4 mb-6">
                  {[
                    { icon: FileText, text: 'Offres d emploi verifiees avec employeurs legitimes' },
                    { icon: CheckCircle2, text: 'Obtention de votre permis CNESST' },
                    { icon: Handshake, text: 'Accompagnement juridique complet' },
                    { icon: Globe, text: 'Support pour votre installation au Canada' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <item.icon className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{item.text}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/fr/recrutement" className="inline-flex items-center gap-2 text-emerald-400 font-medium hover:gap-4 transition-all">
                  Postuler Maintenant
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTEUR 2: ADMINISTRATEUR AGRÉÉ */}
        <section className="py-20 md:py-32 relative overflow-hidden bg-secondary/30">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />

          <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
                <Briefcase className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-400 uppercase tracking-wider">Administrateur Agréé</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">Services Professionnels Agréés</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Membre de l'Ordre des Administrateurs Agréés du Québec - Canada. Permis AdmA A24-52400.
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {[
                {
                  icon: TrendingUp,
                  title: 'Restructuration Financière',
                  desc: 'Nous aidons les entités en difficulté à surmonter leurs crises. Analyse, négociation avec créanciers, restructuration de dette et plans de redressement.',
                  gradient: 'from-amber-500 to-orange-600'
                },
                {
                  icon: Globe,
                  title: 'Gestion d\'Actifs',
                  desc: 'Nos experts sont des gestionnaires d\'actifs reconnus qui gèrent et font croître un portefeuille de placements durables.',
                  gradient: 'from-amber-500 to-orange-600'
                },
                {
                  icon: Shield,
                  title: 'Fiducie & Mandataire',
                  desc: 'Gestion de l\'argent d\'une tierce personne via la fiducie et le compte en fidicommis pour protéger les biens à long terme.',
                  gradient: 'from-amber-500 to-orange-600'
                },
                {
                  icon: Zap,
                  title: 'Optimisation Stratégique',
                  desc: 'Optimisation de la programmation stratégique des territoires basée sur la concertation locale et l\'analyse de données.',
                  gradient: 'from-amber-500 to-orange-600'
                },
                {
                  icon: Building2,
                  title: 'Centre Toor Siyo',
                  desc: 'Conception et mise en oeuvre de solutions nouvelles avec des partenaires mondiaux dans une dynamique d\'amélioration continue.',
                  gradient: 'from-amber-500 to-orange-600'
                },
                {
                  icon: Target,
                  title: 'Lobbying International',
                  desc: 'Représentation officielle auprès des organismes gouvernementaux comme l\'OCDE, l\'ONU ou l\'UE pour vos dossiers complexes.',
                  gradient: 'from-amber-500 to-orange-600'
                },
              ].map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 p-6 hover:border-amber-500/60 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/20"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 text-center"
            >
              <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-amber-500/10 border-2 border-amber-500/30">
                <CheckCircle2 className="h-8 w-8 text-amber-400" />
                <div className="text-left">
                  <div className="text-lg font-bold text-amber-400">Permis CNESST Valide</div>
                  <div className="text-sm text-amber-400/80">AdmA A24-52400</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 md:py-32 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 mb-6">
                <Heart className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium text-violet-400 uppercase tracking-wider">Nos Valeurs</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">Nos Valeurs Fondamentales</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Les principes qui guident notre action au quotidien
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              {[
                { icon: Target, title: 'Excellence', desc: 'Un engagement constant vers la qualité et la performance', gradient: 'from-violet-500 to-violet-600' },
                { icon: Shield, title: 'Intégrité', desc: 'Des pratiques transparentes et éthiques en toute circonstance', gradient: 'from-amber-500 to-amber-600' },
                { icon: Heart, title: 'Engagement', desc: 'Un accompagnement personnalisé et dédié à chaque client', gradient: 'from-purple-500 to-purple-600' },
                { icon: Lightbulb, title: 'Innovation', desc: 'Des solutions créatives adaptées aux défis modernes', gradient: 'from-orange-500 to-orange-600' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group text-center p-6 rounded-2xl bg-background/50 border border-border hover:border-primary/30 transition-all duration-300 backdrop-blur-sm"
                >
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <item.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
                <Star className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-400 uppercase tracking-wider">Pourquoi Nous Choisir</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">Pourquoi Nous Choisir ?</span>
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              {[
                { icon: Award, title: 'Expertise Reconnue', desc: 'Membre OAAQ & CNESST', gradient: 'from-violet-600 to-purple-600' },
                { icon: Clock, title: '10+ Années', desc: "D'expérience", gradient: 'from-amber-600 to-orange-600' },
                { icon: Globe, title: 'Portée Mondiale', desc: '50+ pays couverts', gradient: 'from-blue-600 to-cyan-600' },
                { icon: Star, title: 'Excellence', desc: '100% satisfaction', gradient: 'from-pink-600 to-rose-600' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group text-center p-6 rounded-2xl bg-gradient-to-br from-secondary/50 to-secondary/30 border border-border hover:border-primary/30 transition-all duration-300 backdrop-blur-sm relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  <div className="relative">
                    <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <item.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FRANCHISE SECTION */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 via-transparent to-transparent" />

          <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
                <Globe className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-400 uppercase tracking-wider">Expansion Mondiale</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">Opportunité de Franchises à travers le Monde</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Rejoignez notre réseau international et bénéficiez de notre expertise reconnue
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="rounded-3xl overflow-hidden border-2 border-amber-500/30 shadow-2xl shadow-amber-500/20 mb-12"
              >
                <img
                  src="/timothe/franchise/franchise.jpeg"
                  alt="Opportunité de franchises internationales"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
              </motion.div>

              <div className="grid gap-8 md:grid-cols-3">
                {[
                  {
                    icon: Globe,
                    title: 'Réseau Mondial',
                    desc: 'Déjà présents dans 50+ pays, nous continuons notre expansion internationale',
                    gradient: 'from-amber-500 to-orange-600'
                  },
                  {
                    icon: Handshake,
                    title: 'Partenariat Complet',
                    desc: 'Formation, support opérationnel et accès à notre méthodologie éprouvée',
                    gradient: 'from-violet-500 to-purple-600'
                  },
                  {
                    icon: TrendingUp,
                    title: 'Croissance Assurée',
                    desc: 'Un modèle économique rentable avec un accompagnement personnalisé',
                    gradient: 'from-emerald-500 to-teal-600'
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 p-6 hover:border-amber-500/60 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/20"
                  >
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mt-12"
              >
                <Link
                  href="/fr/contact"
                  className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-amber-500/50"
                >
                  Devenir Franchisé
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 md:py-32 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 mb-6">
                <Mail className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium text-violet-400 uppercase tracking-wider">Contact</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">Contactez-Nous</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Notre équipe est prête à répondre à toutes vos questions
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0 }}
                className="group rounded-2xl bg-background/50 border border-border p-6 text-center hover:border-violet-500/30 transition-all duration-300 hover:shadow-lg"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-sm text-muted-foreground">contact@cabinetdetie.com</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="group rounded-2xl bg-background/50 border border-border p-6 text-center hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Telephone</h3>
                <p className="text-sm text-muted-foreground">+1 (514) 980-8001</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="group rounded-2xl bg-background/50 border border-border p-6 text-center hover:border-violet-500/30 transition-all duration-300 hover:shadow-lg"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Adresse</h3>
                <p className="text-sm text-muted-foreground">Montreal, Quebec, Canada</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="rounded-3xl bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-amber-600/20 border-2 border-primary/30 p-8 sm:p-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 mb-6">
                <ArrowRight className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium text-violet-400 uppercase tracking-wider">Demarrer</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Prêt à Commencer ?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Notre équipe d'experts est prête à vous accompagner dans tous vos projets de recrutement et services administratifs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/fr/recrutement" className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-violet-500/50">
                  Recrutement
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href="/fr/admin" className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-amber-500/50">
                  Administrateur Agréé
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer locale="fr" />
    </>
  );
}
