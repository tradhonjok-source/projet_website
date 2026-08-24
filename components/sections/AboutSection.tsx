'use client';

import { motion, useInView } from 'framer-motion';
import { Globe, Award, Users } from 'lucide-react';
import { getTranslations, Locale } from '@/lib/translations';
import { useRef } from 'react';

interface AboutSectionProps {
  locale: Locale;
}

const stats = [
  { icon: Globe, value: '2014', label: { fr: "Années d'expérience", en: 'Years of Experience' } },
  { icon: Award, value: '500+', label: { fr: 'Clients satisfaits', en: 'Happy Clients' } },
  { icon: Users, value: '50+', label: { fr: 'Experts dédiés', en: 'Dedicated Experts' } },
];

export default function AboutSection({ locale }: AboutSectionProps) {
  const t = getTranslations(locale);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="scroll-mt-16 py-16 sm:py-20 md:py-28 lg:py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-accent/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10" ref={ref}>
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6 sm:gap-8"
          >
            <div className="space-y-4">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-block px-3 sm:px-4 py-2 rounded-full glass border border-primary/30 text-xs sm:text-sm font-medium gradient-text"
              >
                {locale === 'fr' ? 'Notre Histoire' : 'Our Story'}
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold"
              >
                <span className="gradient-text">{locale === 'fr' ? 'Notre Histoire' : 'Our Story'}</span>
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed"
            >
              {locale === 'fr' ? 'Spécialistes en recrutement international depuis 2014.' : 'International recruitment specialists since 2014.'}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-xs sm:text-sm md:text-base text-muted-foreground"
            >
              {locale === 'fr' ? 'Guidés par la transparence, l\'intégrité et la rigueur professionnelle.' : 'Guided by transparency, integrity, and professional rigor.'}
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label[locale as 'fr' | 'en']}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                    className="text-center group"
                  >
                    <div className="inline-flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
                    </div>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                    <div className="text-xs text-muted-foreground leading-tight">{stat.label[locale as 'fr' | 'en']}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: -20 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:rounded-3xl glass-card border border-primary/30">
              {/* Animated grid */}
              <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 md:p-8">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.8 + i * 0.15 }}
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      className="aspect-square rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur-sm border border-primary/20 flex items-center justify-center cursor-pointer"
                    >
                      <Users className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-muted-foreground" />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Floating elements */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-primary to-accent"
                  style={{
                    top: `${15 + i * 18}%`,
                    left: `${10 + (i % 3) * 35}%`,
                  }}
                  animate={{
                    y: [0, -20 + Math.random() * 30, 0],
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.4,
                  }}
                />
              ))}
            </div>

            {/* Decorative blur */}
            <div className="absolute -bottom-8 -right-8 sm:-bottom-10 sm:-right-10 w-32 h-32 sm:w-40 sm:h-40 bg-primary/30 rounded-full blur-3xl" />
            <div className="absolute -top-8 -left-8 sm:-top-10 sm:-left-10 w-32 h-32 sm:w-40 sm:h-40 bg-accent/30 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
