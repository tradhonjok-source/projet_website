'use client';

import { motion, useInView } from 'framer-motion';
import { CheckCircle2, Globe, Award, Shield, Star, Clock, Rocket, Heart, Users } from 'lucide-react';
import { useRef } from 'react';

interface WhyChooseUsSectionProps {
  locale: 'fr' | 'en';
}

const benefits = [
  { icon: Globe, title: { fr: 'Solution Intégrale', en: 'Comprehensive Solution' } },
  { icon: Award, title: { fr: 'Expertise Juridique', en: 'Legal Expertise' } },
  { icon: Shield, title: { fr: 'Transparence', en: 'Transparency' } },
  { icon: Star, title: { fr: 'Intégrité', en: 'Integrity' } },
  { icon: Clock, title: { fr: 'Rigueur', en: 'Rigor' } },
  { icon: Rocket, title: { fr: 'Rapidité', en: 'Speed' } },
  { icon: Heart, title: { fr: 'Support Dédié', en: 'Dedicated Support' } },
  { icon: Users, title: { fr: 'Réseau Mondial', en: 'Global Network' } },
];

export default function WhyChooseUsSection({ locale }: WhyChooseUsSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const isFr = locale === 'fr';

  return (
    <section className="py-16 sm:py-20 md:py-28 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 via-transparent to-secondary/50" />

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 px-2">
            <span className="gradient-text">{isFr ? 'Pourquoi Nous Choisir ?' : 'Why Choose Us?'}</span>
          </h2>
        </motion.div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative overflow-hidden rounded-2xl sm:rounded-3xl glass-card p-4 sm:p-6 md:p-8 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                <div className={`inline-flex h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 mb-3 sm:mb-4 md:mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-semibold">
                  {benefit.title[locale as 'fr' | 'en']}
                </h3>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 sm:mt-16 md:mt-20 text-center"
        >
          <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-full glass-card border border-primary/30">
            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <p className="text-sm sm:text-base md:text-lg">
              {isFr ? 'Un accompagnement complet pour vous' : 'Complete support for you'}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
