'use client';

import Link from 'next/link';
import { Globe, Send, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  locale: 'fr' | 'en' | 'es';
}

export default function Footer({ locale }: FooterProps) {
  const isFr = locale === 'fr';
  const isEs = locale === 'es';

  const homeLabel = isFr ? 'Accueil' : isEs ? 'Inicio' : 'Home';
  const servicesLabel = 'Services';
  const aboutLabel = isFr ? 'À propos' : isEs ? 'Acerca de' : 'About';
  const contactLabel = isFr ? 'Contact' : isEs ? 'Contacto' : 'Contact';
  const recruitmentLabel = isFr ? 'Recrutement International' : isEs ? 'Reclutamiento Internacional' : 'International Recruitment';
  const adminLabel = isFr ? 'Administrateur Agréé' : isEs ? 'Administrador Certificado' : 'Certified Admin';
  const followLabel = isFr ? 'Suivez-nous' : isEs ? 'Síguenos' : 'Follow Us';
  const copyrightFr = '© 2026 Cabinet d\'Expertise DETIE. Tous droits réservés.';
  const copyrightEn = '© 2026 Cabinet d\'Expertise DETIE. All rights reserved.';

  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold"><span className="gradient-text">CABINET D'EXPERTISE</span> <span className="text-white">DETIE</span></h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {isFr ? 'Permis CNESST : AR-2000074' : 'CNESST License: AR-2000074'}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">{isFr ? 'Liens Rapides' : isEs ? 'Enlaces Rápidos' : 'Quick Links'}</h4>
            <nav className="flex flex-col gap-2">
              <Link href={`/${locale}`} className="text-xs sm:text-sm text-muted-foreground hover:text-foreground">
                {homeLabel}
              </Link>
              <Link href={`/${locale}#services`} className="text-xs sm:text-sm text-muted-foreground hover:text-foreground">
                {servicesLabel}
              </Link>
              <Link href={`/${locale}#about`} className="text-xs sm:text-sm text-muted-foreground hover:text-foreground">
                {aboutLabel}
              </Link>
              <Link href={`/${locale}#contact`} className="text-xs sm:text-sm text-muted-foreground hover:text-foreground">
                {contactLabel}
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">{servicesLabel}</h4>
            <nav className="flex flex-col gap-2">
              <Link href={`/${locale}/${isFr ? 'recrutement' : isEs ? 'reclutamiento' : 'recruitment'}`} className="text-xs sm:text-sm text-muted-foreground hover:text-foreground">
                {recruitmentLabel}
              </Link>
              <Link href={`/${locale}/admin`} className="text-xs sm:text-sm text-muted-foreground hover:text-foreground">
                {adminLabel}
              </Link>
              <Link href={`/${locale}#contact`} className="text-xs sm:text-sm text-muted-foreground hover:text-foreground">
                {contactLabel}
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">{followLabel}</h4>
            <div className="flex gap-3 sm:gap-4 flex-wrap">
              <a href="#" className="text-muted-foreground hover:text-foreground" aria-label="LinkedIn"><Globe className="h-4 w-4 sm:h-5 sm:w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-foreground" aria-label="Email"><Send className="h-4 w-4 sm:h-5 sm:w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-foreground" aria-label="Phone"><Phone className="h-4 w-4 sm:h-5 sm:w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-foreground" aria-label="Location"><MapPin className="h-4 w-4 sm:h-5 sm:w-5" /></a>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 border-t border-border pt-6 sm:pt-8 text-center text-xs sm:text-sm text-muted-foreground">
          {isFr ? copyrightFr : copyrightEn}
        </div>
      </div>
    </footer>
  );
}
