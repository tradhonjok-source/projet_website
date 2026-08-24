'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Building2, FileCheck } from 'lucide-react';
import Link from 'next/link';

interface HeroSectionProps {
  locale: 'fr' | 'en';
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const isFr = locale === 'fr';

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-secondary/30 to-background">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">
              {isFr ? 'Permis CNESST : AdmA A24-52400' : 'CNESST License: AdmA A24-52400'}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            <span className="gradient-text">
              {isFr ? "Cabinet d'Expertise DETIE" : "Cabinet d'Expertise DETIE"}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12"
          >
            {isFr
              ? 'Recrutement International & Administrateur Agréé pour le Canada'
              : 'International Recruitment & Certified Administrator for Canada'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href={`/${locale === 'fr' ? 'fr/recrutement' : 'en/recruitment'}`}
              className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-violet-500/30 w-full sm:w-auto justify-center"
            >
              <Building2 className="h-5 w-5" />
              {isFr ? 'Recrutement International' : 'International Recruitment'}
            </Link>

            <Link
              href={`/${locale === 'fr' ? 'fr' : 'en'}/admin`}
              className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-amber-500/30 w-full sm:w-auto justify-center"
            >
              <FileCheck className="h-5 w-5" />
              {isFr ? 'Administrateur Agréé' : 'Certified Administrator'}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-16"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-flex flex-col items-center gap-2 text-muted-foreground/40"
            >
              <span className="text-xs uppercase tracking-wider">{isFr ? 'Découvrir' : 'Discover'}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
