'use client';

import { CheckCircle2, TrendingUp, Shield, Globe, Building2, FileText, Bus, BookOpen, Users, Briefcase, Scale, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AdminPage() {
  const locale = 'en';

  return (
    <>
      <Header locale={locale} />
      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-b from-amber-500/10 via-background to-background">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
                <CheckCircle2 className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-400 uppercase">
                  Certified Administrator - Member of the Order of Certified Administrators of Quebec - Canada
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                <span className="gradient-text">Professional Certified Services</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Multidisciplinary expertise firm offering certified professional services in Quebec and Canada.
              </p>
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-amber-500/10 border-2 border-amber-500/30">
                <CheckCircle2 className="h-6 w-6 text-amber-400" />
                <div className="text-left">
                  <div className="text-sm font-bold text-amber-400">LICENSE No. AdmA A24-52400</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Admin Services */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 mb-6">
                <Briefcase className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium text-violet-400 uppercase">
                  Certified Administrator
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="gradient-text">Certified Administrative Services</span>
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
              {[
                { icon: TrendingUp, title: 'Financial Restructuring', desc: 'We help entities in difficulty overcome their crises through analysis, creditor negotiation, and recovery plans.' },
                { icon: Building2, title: 'Asset Management', desc: 'Our experts manage and grow sustainable investment portfolios for clients.' },
                { icon: Shield, title: 'Trust & Trustee', desc: 'Long-term asset protection through trust and escrow account management.' },
                { icon: Globe, title: 'Strategic Planning', desc: 'Territorial strategic planning optimization based on local consultation and data analysis.' },
                { icon: Building2, title: 'Toor Siyo Center', desc: 'Continuous improvement solutions with global partners for societal challenges.' },
                { icon: Briefcase, title: 'HOTI PROS Program', desc: 'Application for public transport user protection and transparency.' },
                { icon: BookOpen, title: 'Taxi Verification', desc: 'Easy-to-use vehicle verification tool published in 3 languages.' },
              ].map((service, index) => (
                <div key={index} className="rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/30 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 mb-4">
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Career Management */}
        <section className="py-20 md:py-32 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
                <FileText className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400 uppercase">
                  Career Management
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="gradient-text">Career Management Services</span>
              </h2>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                    <FileText className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-400">Administrative Management</h3>
                </div>
                <p className="text-muted-foreground mb-6">We assist and advise our clients in the administrative management of their files.</p>
                <ul className="grid gap-3 md:grid-cols-2">
                  {[
                    'Career assessments',
                    'CV development and optimization',
                    'Interview preparation and coaching',
                    'Job search strategy and targeting',
                    'Professional orientation',
                    'Legal compliance',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Lobby-Consulting */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
                <Globe className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-400 uppercase">
                  Lobby-Consulting
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="gradient-text">For-Profit and Non-Profit Consulting</span>
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
              {[
                { icon: Globe, title: 'International Institutions', desc: 'Influencing political, economic or regulatory decisions within global organizations such as the OECD, UN or EU.' },
                { icon: Users, title: 'Individuals and Institutions', desc: 'Professional representation for individuals, private institutions, for-profit and non-profit organizations.' },
              ].map((service, index) => (
                <div key={index} className="rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 p-8">
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

        {/* Trust Badge */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-amber-500/10 border-2 border-amber-500/30">
                <CheckCircle2 className="h-8 w-8 text-amber-400" />
                <div className="text-left">
                  <div className="text-lg font-bold text-amber-400">CNESST License Validated</div>
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
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Need Professional Assistance?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Our team of experts is ready to guide you through all your procedures.
              </p>
              <Link href="/en#contact" className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-amber-500/50">
                Contact Us
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer locale={locale} />
    </>
  );
}
