'use client';

import Link from 'next/link';
import { Menu, X, ChevronDown, User } from 'lucide-react';
import { useState } from 'react';
import LanguageSelector from './LanguageSelector';

interface HeaderProps {
  locale?: 'fr' | 'en' | 'es';
}

export default function Header({ locale = 'fr' }: HeaderProps) {
  const isFr = locale === 'fr';
  const isEs = locale === 'es';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [recrutementOpen, setRecrutementOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const recrutementSlug = isFr ? 'recrutement' : isEs ? 'reclutamiento' : 'recruitment';
  const recrutementLabel = isFr ? 'Recrutement International' : isEs ? 'Reclutamiento Internacional' : 'International Recruitment';
  const recruiterLabel = isFr ? 'Je suis Recruteur' : isEs ? 'Soy Empleador' : "I'm a Recruiter";
  const candidateLabel = isFr ? 'Je suis Candidat' : isEs ? 'Soy Candidato' : "I'm a Candidate";

  const recrutementLinks = [
    { href: `/${locale}/${recrutementSlug}`, label: recrutementLabel },
    { href: `/${locale}/${recrutementSlug}${isFr ? '#recruteur' : isEs ? '#empleador' : '#recruiter'}`, label: recruiterLabel },
    { href: `/${locale}/${recrutementSlug}${isFr ? '#candidat' : isEs ? '#candidato' : '#candidate'}`, label: candidateLabel },
  ];

  const adminLabel = isFr ? 'Administrateur Agréé' : isEs ? 'Administrador Certificado' : 'Certified Administrator';
  const adminServicesLabel = isFr ? 'Services Administratifs' : isEs ? 'Servicios Administrativos' : 'Administrative Services';
  const adminCareerLabel = isFr ? 'Gestion de Carrière' : isEs ? 'Gestión de Carrera' : 'Career Management';

  const adminLinks = [
    { href: `/${locale}/admin`, label: adminLabel },
    { href: `/${locale}/admin#services`, label: adminServicesLabel },
    { href: `/${locale}/admin#gestion`, label: adminCareerLabel },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href={`/${locale || 'fr'}`} className="flex items-center">
          <img
            src="/images/logo.png"
            alt="Cabinet DETIE Logo"
            className="h-14 md:h-16 w-auto object-contain flex-shrink-0"
            style={{ display: 'block', visibility: 'visible', opacity: 1 }}
          />
        </Link>

        <nav className="hidden md:flex items-center gap-4">
          {/* Accueil Link */}
          <Link href={`/${locale}`} className="px-4 py-2 text-sm font-medium text-primary hover:text-foreground transition-colors">
            {isFr ? 'Accueil' : isEs ? 'Inicio' : 'Home'}
          </Link>

          {/* Recrutement Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setRecrutementOpen(!recrutementOpen); setAdminOpen(false); }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
            >
              <span>{isFr ? 'Recrutement International' : isEs ? 'Reclutamiento Internacional' : 'International Recruitment'}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${recrutementOpen ? 'rotate-180' : ''}`} />
            </button>
            {recrutementOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 rounded-xl bg-background border border-border shadow-lg py-2 z-50">
                {recrutementLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setRecrutementOpen(false)}
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Admin Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setAdminOpen(!adminOpen); setRecrutementOpen(false); }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
            >
              <span>{isFr ? 'Administrateur Agréé' : isEs ? 'Administrador Certificado' : 'Certified Administrator'}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${adminOpen ? 'rotate-180' : ''}`} />
            </button>
            {adminOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 rounded-xl bg-background border border-border shadow-lg py-2 z-50">
                {adminLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setAdminOpen(false)}
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link
            href={`/${locale}/compte/dashboard`}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
          >
            <User className="h-4 w-4" />
            {isFr ? 'Mon Compte' : isEs ? 'Mi Cuenta' : 'My Account'}
          </Link>
          <LanguageSelector currentLocale={locale} />
          <Link
            href={`/${locale}#contact`}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2 text-sm font-medium text-primary-foreground transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
          >
            {isFr ? 'Contact' : isEs ? 'Contacto' : 'Contact'}
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-muted-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-border bg-background px-4 py-4" role="navigation">
          <nav className="flex flex-col gap-4">
            {/* Accueil Link */}
            <Link href={`/${locale}`} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg">
              {isFr ? '🏠 Accueil' : isEs ? '🏠 Inicio' : '🏠 Home'}
            </Link>

            {/* Recrutement Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-violet-400 font-semibold text-sm">
                {isFr ? '🏢 Recrutement International' : '🏢 International Recruitment'}
              </div>
              <div className="pl-6 space-y-2">
                {recrutementLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Admin Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                {isFr ? '🏛️ Administrateur Agréé' : isEs ? '🏛️ Administrador Certificado' : '🏛️ Certified Administrator'}
              </div>
              <div className="pl-6 space-y-2">
                {adminLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <Link
                href={`/${locale}/compte/dashboard`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-violet-400 bg-violet-500/10 rounded-lg"
              >
                <User className="h-4 w-4" />
                {isFr ? 'Mon Compte' : isEs ? 'Mi Cuenta' : 'My Account'}
              </Link>
              <LanguageSelector currentLocale={locale} variant="mobile" />
              <Link href={`/${locale}#contact`} onClick={() => setMobileMenuOpen(false)} className="block text-center rounded-full bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-medium text-primary-foreground">
                {isFr ? 'Contact' : 'Contact'}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
