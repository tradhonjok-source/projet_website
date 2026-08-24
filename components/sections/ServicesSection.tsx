'use client';

import { motion } from 'framer-motion';
import { Users, Scale, Handshake, ArrowRight, Globe, FileCheck, Briefcase, CheckCircle2, Building2, User } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { GlowCard } from '@/components/effects/GlowCard';

interface ServicesSectionProps {
  locale: 'fr' | 'en';
}

export default function ServicesSection({ locale }: ServicesSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const isFr = locale === 'fr';

  return (
    <>
      {/* SECTION 1: RECRUITMENT */}
      <section id="recruitment" className="scroll-mt-16 py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 via-transparent to-transparent" />

        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30">
              <Globe className="h-5 w-5 text-violet-400" />
              <span className="text-sm font-medium text-violet-400 uppercase tracking-wider">
                {isFr ? 'Recrutement International' : 'International Recruitment'}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">
                {isFr ? 'Trouvez les Meilleurs Talents' : 'Find the Best Talents'}
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {isFr ? 'De la sélection à l\'intégration.' : 'From selection to integration.'}
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2 mb-16">
            {/* Recruiters */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-2 border-violet-500/30 p-6 sm:p-8 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-violet-400">{isFr ? 'Je suis Recruteur' : 'I\'m a Recruiter'}</h3>
                  <p className="text-sm text-muted-foreground">{isFr ? 'Entreprises' : 'Companies'}</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">
                {isFr ? 'Accédez à un vivier mondial de talents.' : 'Access global talent pool.'}
              </p>

              <div className="space-y-4 mb-6">
                {[
                  { icon: Users, title: isFr ? 'Recrutement International' : 'International Recruitment', desc: isFr ? 'Accédez à un vivier mondial de talents qualifiés.' : 'Access a global pool of qualified talents.' },
                  { icon: FileCheck, title: isFr ? 'Gestion des Permis' : 'Work Permit Management', desc: isFr ? 'Étude LMIA et préparation CNESST.' : 'LMIA and CNESST preparation.' },
                  { icon: Handshake, title: isFr ? 'Intégration' : 'Integration', desc: isFr ? 'Orientation et suivi post-arrivée.' : 'Arrival orientation and follow-up.' },
                ].map((service, i) => (
                  <GlowCard key={i}>
                    <div className="flex items-start gap-4 p-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
                        <service.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-semibold mb-1">{service.title}</h4>
                        <p className="text-sm text-muted-foreground">{service.desc}</p>
                      </div>
                    </div>
                  </GlowCard>
                ))}
              </div>

              <Link href={`/${locale}#contact`} className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 text-sm font-medium text-white transition-all hover:scale-105">
                {isFr ? 'Demander un Candidat' : 'Request Candidate'}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            {/* Candidates */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30 p-6 sm:p-8 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600">
                  <User className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-emerald-400">{isFr ? 'Je suis Candidat' : 'I\'m a Candidate'}</h3>
                  <p className="text-sm text-muted-foreground">{isFr ? 'Travailleurs' : 'Workers'}</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">
                {isFr ? 'Obtenez un permis de travail au Canada.' : 'Get work permit in Canada.'}
              </p>

              <div className="space-y-4 mb-6">
                {[
                  { icon: Briefcase, title: isFr ? 'Offres Vérifiées' : 'Verified Offers', desc: isFr ? 'Emplois avec employeurs légitimes.' : 'Jobs with legitimate employers.' },
                  { icon: FileCheck, title: isFr ? 'Permis CNESST' : 'CNESST Permit', desc: isFr ? 'Permis de travail avec accompagnement.' : 'Work permit with support.' },
                  { icon: Globe, title: isFr ? 'Support Juridique' : 'Legal Support', desc: isFr ? 'Expertise pour vos démarches.' : 'Expertise for your procedures.' },
                ].map((service, i) => (
                  <GlowCard key={i}>
                    <div className="flex items-start gap-4 p-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                        <service.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-semibold mb-1">{service.title}</h4>
                        <p className="text-sm text-muted-foreground">{service.desc}</p>
                      </div>
                    </div>
                  </GlowCard>
                ))}
              </div>

              <Link href={`/${locale}#contact`} className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-medium text-white transition-all hover:scale-105">
                {isFr ? 'Postuler Maintenant' : 'Apply Now'}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: ADMIN */}
      <section id="admin" className="scroll-mt-16 py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />

        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30">
              <Scale className="h-5 w-5 text-amber-400" />
              <span className="text-sm font-medium text-amber-400 uppercase tracking-wider">
                {isFr ? 'Administrateur Agréé' : 'Certified Administrator'}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">
                {isFr ? 'Services Administratifs CNESST' : 'CNESST Administrative Services'}
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {isFr ? 'Permis AdmA A24-52400.' : 'License AdmA A24-52400.'}
            </p>

            <div className="mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-amber-500/10 border-2 border-amber-500/30">
              <CheckCircle2 className="h-6 w-6 text-amber-400" />
              <div className="text-left">
                <div className="text-sm font-bold text-amber-400">{isFr ? 'Permis CNESST Validé' : 'CNESST License Validated'}</div>
                <div className="text-xs text-amber-400/80">AdmA A24-52400</div>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto mb-12">
            {[
              { icon: Scale, title: isFr ? 'Immigration & Citoyenneté' : 'Immigration & Citizenship', desc: isFr ? 'Accompagnement complet immigration.' : 'Complete immigration support.' },
              { icon: Briefcase, title: isFr ? 'Conformité CNESST' : 'CNESST Compliance', desc: isFr ? 'Administrateur agréé pour conformité.' : 'Certified compliance administrator.' },
              { icon: Globe, title: isFr ? 'Lobbying & Représentation' : 'Lobbying & Representation', desc: isFr ? 'Représentation officielle.' : 'Official representation.' },
            ].map((service, index) => (
              <GlowCard key={service.title} className="group">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative p-6 sm:p-8"
                >
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 mb-6 shadow-lg`}>
                    <service.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-6">{service.desc}</p>
                  <Link href={`/${locale}#contact`} className="inline-flex items-center gap-2 text-sm font-medium text-amber-400 transition-all hover:gap-4">
                    {isFr ? 'Vérifier Éligibilité' : 'Check Eligibility'}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
