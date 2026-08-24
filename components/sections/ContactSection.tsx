'use client';

import { motion, useInView } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { getTranslations, Locale } from '@/lib/translations';
import { useRef, useState, FormEvent } from 'react';

interface ContactSectionProps {
  locale: Locale;
}

export default function ContactSection({ locale }: ContactSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const contactInfo = [
    {
      icon: Mail,
      label: locale === 'fr' ? 'Email' : 'Email',
      value: 'contact@equinoxworld.com',
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      icon: Phone,
      label: locale === 'fr' ? 'Téléphone' : 'Phone',
      value: '+1 (514) 980-8001',
      gradient: 'from-fuchsia-500 to-pink-600',
    },
    {
      icon: MapPin,
      label: locale === 'fr' ? 'Adresse' : 'Address',
      value: locale === 'fr' ? 'Montréal, Québec, Canada' : 'Montreal, Quebec, Canada',
      gradient: 'from-cyan-500 to-blue-600',
    },
  ];

  return (
    <section id="contact" className="scroll-mt-16 py-16 sm:py-20 md:py-28 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10" ref={ref}>
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
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
                {locale === 'fr' ? 'Contactez-nous' : 'Get in Touch'}
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold"
              >
                <span className="gradient-text">
                  {locale === 'fr' ? 'Parlons de votre projet' : 'Let\'s Talk'}
                </span>
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed"
            >
              {locale === 'fr'
                ? "Notre équipe est prête à vous accompagner dans vos projets de recrutement international."
                : 'Our team is ready to support you in your international recruitment projects.'}
            </motion.p>

            {/* Contact Info Cards */}
            <div className="flex flex-col gap-3 sm:gap-4 pt-6 sm:pt-8">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.15, duration: 0.5 }}
                    whileHover={{ x: 10 }}
                    className="group flex items-center gap-3 sm:gap-4 md:gap-5 p-3 sm:p-4 rounded-xl sm:rounded-2xl glass-card border border-primary/20 transition-all hover:border-primary/40 cursor-pointer"
                  >
                    <div className={`flex h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm text-muted-foreground truncate">{item.label}</div>
                      <div className="text-sm sm:text-base font-medium truncate">{item.value}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl sm:rounded-3xl glass-card border border-primary/30 p-6 sm:p-8 md:p-10">
              {/* Glow effect */}
              <div className="absolute -top-16 -right-16 sm:-top-20 sm:-right-20 w-32 h-32 sm:w-40 sm:h-40 bg-primary/30 rounded-full blur-3xl" />
              <div className="absolute -bottom-16 -left-16 sm:-bottom-20 sm:-left-20 w-32 h-32 sm:w-40 sm:h-40 bg-accent/30 rounded-full blur-3xl" />

              {/* Success Message */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {locale === 'fr' ? 'Message envoyé !' : 'Message Sent!'}
                  </h3>
                  <p className="text-muted-foreground">
                    {locale === 'fr'
                      ? 'Nous vous répondrons dans les plus brefs délais.'
                      : 'We will get back to you as soon as possible.'}
                  </p>
                  <button
                    onClick={() => setSubmitStatus('idle')}
                    className="mt-6 text-sm text-primary hover:underline"
                  >
                    {locale === 'fr' ? 'Envoyer un autre message' : 'Send another message'}
                  </button>
                </motion.div>
              )}

              {/* Form */}
              <form
                className={`relative z-10 flex flex-col gap-4 sm:gap-6 ${submitStatus === 'success' ? 'hidden' : ''}`}
                method="POST"
                onSubmit={async (e: FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  setIsSubmitting(true);

                  const formData = new FormData(e.currentTarget);
                  const data = Object.fromEntries(formData.entries());

                  try {
                    // TODO: Configurez votre ID Formspree via NEXT_PUBLIC_FORMSPREE_ID
                    const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID || 'YOUR_FORMSPREE_ID';
                    const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                      },
                      body: JSON.stringify(data),
                    });

                    if (response.ok) {
                      setSubmitStatus('success');
                      (e.target as HTMLFormElement).reset();
                    } else {
                      setSubmitStatus('error');
                    }
                  } catch (error) {
                    console.error('Form submission error:', error);
                    setSubmitStatus('error');
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                {/* Status Messages */}
                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span>
                      {locale === 'fr'
                        ? 'Une erreur est survenue. Veuillez réessayer.'
                        : 'An error occurred. Please try again.'}
                    </span>
                  </motion.div>
                )}
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="firstName" className="text-xs sm:text-sm font-medium">
                      {locale === 'fr' ? 'Prénom' : 'First Name'}
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="flex h-10 sm:h-12 w-full rounded-lg sm:rounded-xl bg-secondary/50 border border-border px-3 sm:px-4 py-2 sm:py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all"
                      placeholder={locale === 'fr' ? 'Jean' : 'John'}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="lastName" className="text-xs sm:text-sm font-medium">
                      {locale === 'fr' ? 'Nom' : 'Last Name'}
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="flex h-10 sm:h-12 w-full rounded-lg sm:rounded-xl bg-secondary/50 border border-border px-3 sm:px-4 py-2 sm:py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all"
                      placeholder={locale === 'fr' ? 'Dupont' : 'Doe'}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-xs sm:text-sm font-medium">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="flex h-10 sm:h-12 w-full rounded-lg sm:rounded-xl bg-secondary/50 border border-border px-3 sm:px-4 py-2 sm:py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all"
                    placeholder="jean@exemple.com"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-xs sm:text-sm font-medium">
                    {locale === 'fr' ? 'Message' : 'Message'}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="flex w-full resize-none rounded-lg sm:rounded-xl bg-secondary/50 border border-border px-3 sm:px-4 py-2 sm:py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all"
                    placeholder={locale === 'fr'
                      ? 'Comment pouvons-nous vous aider ?'
                      : 'How can we help you?'}
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full bg-gradient-to-r from-primary to-accent px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium text-white transition-all hover:shadow-lg hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <span className="h-4 w-4 sm:h-5 sm:w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {locale === 'fr' ? 'Envoyer le message' : 'Send Message'}
                      <Send className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-2" />
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
