import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Building2, User, Users, FileCheck, Handshake, Briefcase, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function RecruitmentPage() {
  const locale = 'en';
  const isFr = false;

  return (
    <>
      <Header locale={locale} />
      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-b from-violet-500/10 via-background to-background">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 mb-6">
                <Globe className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium text-violet-400 uppercase">
                  International Recruitment
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                <span className="gradient-text">Find the Best Global Talents</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                From selection to integration, we guide you through every step of international recruitment.
              </p>
            </div>
          </div>
        </section>

        {/* Navigation Rapide */}
        <section className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="flex justify-center gap-4 py-4">
              <Link
                href="#recruiter"
                className="px-6 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 font-medium hover:bg-violet-500/20 transition-all"
              >
                🏢 I'm a Recruiter
              </Link>
              <Link
                href="#candidate"
                className="px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium hover:bg-emerald-500/20 transition-all"
              >
                👤 I'm a Candidate
              </Link>
            </div>
          </div>
        </section>

        {/* Dual Path Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Recruiters */}
              <div id="recruiter" className="rounded-3xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-2 border-violet-500/30 p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600">
                    <Building2 className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-violet-400">I'm a Recruiter</h2>
                    <p className="text-sm text-muted-foreground">Companies & Employers</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6">
                  Access a global pool of qualified talents. We manage the entire recruitment process for you.
                </p>

                <div className="space-y-4 mb-6">
                  {[
                    { icon: Users, title: 'International Recruitment', desc: 'Access a global pool of qualified talents.' },
                    { icon: FileCheck, title: 'Work Permit Management', desc: 'LMIA feasibility study and CNESST preparation.' },
                    { icon: Handshake, title: 'Integration', desc: 'Arrival orientation and post-arrival follow-up.' },
                  ].map((service, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
                        <service.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold mb-1">{service.title}</h3>
                        <p className="text-sm text-muted-foreground">{service.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link href={`/${locale}#contact`} className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 text-sm font-medium text-white transition-all hover:scale-105">
                  Request a Candidate
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Candidates */}
              <div id="candidate" className="rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30 p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600">
                    <User className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-emerald-400">I'm a Candidate</h2>
                    <p className="text-sm text-muted-foreground">International Workers</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6">
                  Get a temporary work permit in Canada. We guide you through all administrative procedures.
                </p>

                <div className="space-y-4 mb-6">
                  {[
                    { icon: Briefcase, title: 'Verified Job Offers', desc: 'Pre-screened opportunities with legitimate employers.' },
                    { icon: FileCheck, title: 'CNESST Work Permit', desc: 'Get your work permit with our complete support.' },
                    { icon: Globe, title: 'Legal Support', desc: 'Legal expertise for all your immigration procedures.' },
                  ].map((service, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                        <service.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold mb-1">{service.title}</h3>
                        <p className="text-sm text-muted-foreground">{service.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link href={`/${locale}#contact`} className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-medium text-white transition-all hover:scale-105">
                  Apply Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-8">
                <span className="gradient-text">Why Choose Us?</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {[
                  { value: '50+', label: 'Countries' },
                  { value: '500+', label: 'Successful Placements' },
                  { value: '10+', label: 'Years Experience' },
                  { value: '100%', label: 'Client Satisfaction' },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-4">
                    <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="rounded-3xl bg-gradient-to-r from-violet-600/20 to-purple-600/20 border-2 border-violet-500/30 p-8 sm:p-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Find Your Talent?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Contact us today to discuss your international recruitment needs.
              </p>
              <Link href={`/${locale}#contact`} className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-violet-500/50">
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
