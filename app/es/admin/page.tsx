'use client';

import { CheckCircle2, TrendingUp, Shield, Globe, Building2, FileText, Bus, BookOpen, Users, Briefcase, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface ServiceItem {
  icon: any;
  title: string;
  desc: string;
  items?: string[];
  href?: string;
}

const adminAgreeServices: ServiceItem[] = [
  {
    icon: TrendingUp,
    title: 'Asesor en Restructuración Financiera',
    desc: 'El gabinete ayuda a las entidades en dificultad a superar sus crisis. Nuestro rol consiste en analizar la situación, negociar con los acreedores, reestructurar la deuda y elaborar planes de recuperación para preservar el valor de la empresa y evitar la quiebra. A nivel de la deuda de los países, privilegiamos enfoques sostenibles como la auditoría ciudadana.',
  },
  {
    icon: Building2,
    title: 'Gestor de Activos (Asset Manager)',
    desc: 'Nuestros expertos son gestores de activos reconocidos que gestionan y hacen crecer una cartera de inversiones sostenibles para clientes (Ciudadanos, empresas o fondos sostenibles).',
    href: '/es/admin/gestion-actifs',
  },
  {
    icon: Shield,
    title: 'Mandatario (Fideicomiso y Cuenta Fideicomisaria)',
    desc: 'Nuestro gabinete, mandatario o administrador, gestiona el dinero de un tercero mediante herramientas precisas: el fideicomiso (para colocar y proteger bienes a largo plazo) y la cuenta en fideicomiso (reservada a profesionales para mantener el dinero de los clientes de forma segura).',
  },
  {
    icon: Globe,
    title: 'Optimización de la Programación Estratégica de Territorios',
    desc: 'La optimización de la programación estratégica de territorios se basa en la concertación local, el análisis de datos y el seguimiento de objetivos. Este proceso permite adaptar las políticas públicas a las necesidades reales.',
  },
  {
    icon: Building2,
    title: 'Centro Toor Siyo – Kaizen de África',
    desc: 'Nuestro gabinete diseña, desarrolla e implementa soluciones nuevas con socios a través del mundo en una dinámica de mejora continua (productos, servicios, modelos de negocio o políticas) para responder de manera más sostenible a los desafíos sociales y ambientales. Coloca al ser humano y al impacto colectivo en el centro de las decisiones. También es un centro de simulación técnica y tecnológica mundial al servicio de los ciudadanos portadores de ideas innovadoras o patentes.',
  },
  {
    icon: Bus,
    title: 'Programa HOTI PROS',
    desc: 'Una aplicación desarrollada con socios para la protección de los usuarios del transporte colectivo y una transparencia en el dominio del transporte remunerado de personas.',
  },
  {
    icon: BookOpen,
    title: 'Folleto Universal de Verificación Sumaria de Taxi',
    desc: 'El gabinete ha puesto a disposición de los profesionales del transporte remunerado una herramienta fácil de usar para la verificación de sus vehículos antes de la salida y editado en 3 idiomas (Francés-Inglés-Español). Disponible bajo pedido o en librerías los 4 rincones del Mundo en Montreal.',
  },
];

const gestionAdminServices: ServiceItem[] = [
  {
    icon: FileText,
    title: 'Gestión Administrativa',
    desc: 'El gabinete asiste y aconseja a sus usuarios en la gestión administrativa de sus expedientes.',
    items: [
      'Evaluaciones de carrera',
      'Desarrollo y optimización del CV',
      'Preparación y acompañamiento de entrevistas',
      'Estrategia de búsqueda de empleo y focalización',
      'Orientación profesional',
      'Conformidad jurídica',
    ],
  },
];

const lobbyingServices: ServiceItem[] = [
  {
    icon: Globe,
    title: 'Lobbyismo ante las Instituciones Internacionales',
    desc: 'El lobbyismo ante las instituciones internacionales designa la acción de influenciar decisiones políticas, económicas o normativas en el seno de organismos mundiales como la OCDE, la ONU o la UE.',
  },
  {
    icon: Users,
    title: 'Lobbying para Personas Físicas e Instituciones',
    desc: 'Representación profesional para personas físicas, instituciones privadas, lucrativas y no lucrativas.',
  },
];

export default function AdminPage() {
  const localeTyped = 'es' as const;

  return (
    <>
      <Header locale={localeTyped} />
      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-b from-amber-500/10 via-background to-background">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
                <CheckCircle2 className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-400 uppercase">
                  Administrador Autorizado - Miembro del Colegio de Administradores Autorizados de Quebec - Canadá
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                <span className="gradient-text">Servicios Profesionales Autorizados</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Gabinete de experticia multidisciplinar ofreciendo servicios profesionales autorizados en Quebec y Canadá.
              </p>

              {/* Permis Ordre - Image Display */}
              <div className="mb-8">
                <a
                  href="/documents/permis-ordre.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block group"
                >
                  <div className="rounded-2xl overflow-hidden border-2 border-amber-500/30 hover:border-amber-500/60 transition-all shadow-lg hover:shadow-xl hover:shadow-amber-500/20">
                    <img
                      src="/images/permis-ordre.png"
                      alt="Permiso del Colegio de Administradores Autorizados de Quebec"
                      className="w-full max-w-md h-auto group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-center mt-3">
                    <span className="text-sm text-amber-400 font-medium group-hover:underline">
                      Haga clic para visualizar el documento oficial
                    </span>
                  </div>
                </a>
              </div>

              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-amber-500/10 border-2 border-amber-500/30">
                <CheckCircle2 className="h-6 w-6 text-amber-400" />
                <div className="text-left">
                  <div className="text-sm font-bold text-amber-400">N° PERMISO AdmA A24-52400</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Administrateur Agréé */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 mb-6">
                <Briefcase className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium text-violet-400 uppercase">
                  Administrador Autorizado
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="gradient-text">Servicios de Administración Autorizada</span>
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
              {adminAgreeServices.map((service, index) => {
                const cardContent = (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 mb-4">
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3">{service.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
                  </>
                );

                return (
                  <div
                    key={index}
                    className={`rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/30 p-6 transition-all ${
                      service.href
                        ? 'hover:border-violet-500/60 cursor-pointer group'
                        : ''
                    }`}
                  >
                    {service.href ? (
                      <Link href={service.href} className="block h-full">
                        {cardContent}
                        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          Saber más
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    ) : (
                      cardContent
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 2: Gestion Administrative */}
        <section className="py-20 md:py-32 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
                <FileText className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400 uppercase">
                  Gestión Administrativa
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="gradient-text">Servicios de Gestión de Carrera</span>
              </h2>
            </div>

            <div className="max-w-4xl mx-auto">
              {gestionAdminServices.map((service, index) => (
                <div key={index} className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 p-8 hover:border-emerald-500/60 transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                      <service.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-emerald-400">{service.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">{service.desc}</p>
                  <ul className="grid gap-3 md:grid-cols-2">
                    {service.items?.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Lobby-Conseil */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
                <Globe className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-400 uppercase">
                  Lobby-Consejo
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="gradient-text">Consejo a las Organizaciones Lucrativas y No Lucrativas</span>
              </h2>
              <p className="text-lg text-muted-foreground">QUEBEC - CANADÁ | N° LOBBY QUEBEC 20260148</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
              {lobbyingServices.map((service, index) => (
                <div key={index} className="rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 p-8 hover:border-amber-500/60 transition-all">
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

        {/* Trust Badge Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-amber-500/10 border-2 border-amber-500/30">
                <CheckCircle2 className="h-8 w-8 text-amber-400" />
                <div className="text-left">
                  <div className="text-lg font-bold text-amber-400">Permiso CNESST Validado</div>
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
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">¿Necesita una Asistencia Profesional?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Nuestro equipo de expertos está listo para acompañarlo en todos sus trámites.
              </p>
              <Link href="/es#contact" className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-amber-500/50">
                Contactarnos
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer locale={localeTyped} />
    </>
  );
}
