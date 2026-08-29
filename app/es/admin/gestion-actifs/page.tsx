'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp, Palette, Home, ArrowLeft, ArrowRight, CheckCircle2,
  Shield, Globe, Building2, FileText, Users, Award,
  Gem, Brush, Camera, Video, Hammer, Scissors, Mountain
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

type TabType = 'patrimonio' | 'artistas' | 'inmobiliario';

const tabs = [
  {
    id: 'patrimonio' as TabType,
    label: 'Gestión del Patrimonio Personal',
    icon: TrendingUp,
    color: 'from-violet-500 to-purple-600'
  },
  {
    id: 'artistas' as TabType,
    label: 'Activos Patrimoniales - Creadores',
    icon: Palette,
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'inmobiliario' as TabType,
    label: 'Activos Inmobiliarios',
    icon: Home,
    color: 'from-emerald-500 to-teal-600'
  },
];

const artistCategories = [
  { name: "Pintores", icon: Brush },
  { name: "Escultores", icon: Hammer },
  { name: "Fotógrafos", icon: Camera },
  { name: "Videógrafos", icon: Video },
  { name: "Artesanos", icon: Hammer },
  { name: "Gemólogos", icon: Gem },
  { name: "Creadores", icon: Palette },
  { name: "Montañas (obras)", icon: Mountain },
];

export default function GestionActifsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("patrimonio");

  return (
    <>
      <Header locale="es" />
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-950/30 via-background to-background">

        {/* Back Button */}
        <section className="py-8 border-b border-border/40">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <Link
              href="/es/admin"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a los Servicios de Administración Autorizada
            </Link>
          </div>
        </section>

        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 mb-6">
                <Building2 className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium text-violet-400 uppercase">
                  Gestor de Activos (Asset Manager)
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                <span className="gradient-text">Servicios de Gestión de Activos</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Nuestros expertos son gestores de activos reconocidos que gestionan y hacen crecer
                una cartera de inversiones sostenibles para clientes (Ciudadanos, empresas o fondos sostenibles).
              </p>
            </div>
          </div>
        </section>

        {/* Tabs Navigation */}
        <section className="py-8 border-y border-border/40 bg-background/50 backdrop-blur">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="flex flex-wrap justify-center gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all duration-300 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} border-transparent text-white shadow-lg`
                      : "bg-background/50 border-border hover:border-violet-500/30 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-white' : 'text-violet-400'}`} />
                  <span className="font-medium hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Tab Content */}
        <section className="py-16 md:py-24 flex-1">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">

            {/* Tab: Patrimonio Personal */}
            {activeTab === "patrimonio" && (
              <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Main Card */}
                <div className="rounded-3xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-2 border-violet-500/30 p-8 md:p-12">
                  <div className="flex items-start gap-6 mb-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex-shrink-0">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-4 text-violet-400">
                        Gestión del Patrimonio Personal
                      </h2>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        La gestión del patrimonio personal implica un enfoque global para hacer crecer,
                        proteger y transmitir sus activos. Esto incluye consejos sobre inversión,
                        jubilación, sucesión y empresa.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-background/50 border border-border p-6 md:p-8">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Award className="h-5 w-5 text-violet-400" />
                      Rol del Administrador Autorizado
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      El Administrador Autorizado, con su mandato, analiza su situación financiera y le ofrece
                      recomendaciones personalizadas para alcanzar sus objetivos lucrativos o comunitarios.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        "Análisis completo de su situación financiera",
                        "Consejos en inversión estratégica",
                        "Planificación de la jubilación",
                        "Optimización sucesoria",
                        "Transmisión de patrimonio",
                        "Gestión de empresa familiar",
                        "Objetivos lucrativos y comunitarios",
                        "Seguimiento y reajuste continuo",
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-violet-500/5">
                          <CheckCircle2 className="h-5 w-5 text-violet-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Secondary Info */}
                <div className="rounded-2xl border border-border bg-background/50 p-6 md:p-8">
                  <h3 className="text-xl font-semibold mb-4">¿Por qué una gestión patrimonial?</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Una gestión patrimonial eficaz le permite maximizar su potencial financiero mientras
                    minimiza los riesgos. Tiene en cuenta su perfil inversor, sus objetivos de vida
                    y su situación fiscal para elaborar una estrategia a medida.
                  </p>
                </div>
              </div>
            )}

            {/* Tab: Artistas y Creadores */}
            {activeTab === "artistas" && (
              <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Main Card */}
                <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-2 border-amber-500/30 p-8 md:p-12">
                  <div className="flex items-start gap-6 mb-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex-shrink-0">
                      <Palette className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-4 text-amber-400">
                        Gestión de Activos Patrimoniales - Creadores y Artistas
                      </h2>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        Para una gestión de activos patrimoniales eficaz, es esencial comprender
                        los diferentes tipos de activos posibles y valorizarlos adecuadamente.
                      </p>
                    </div>
                  </div>

                  {/* Artist Categories Grid */}
                  <div className="rounded-2xl bg-background/50 border border-border p-6 md:p-8 mb-8">
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                      <Users className="h-5 w-5 text-amber-400" />
                      Categorías de Creadores Acompañados
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {artistCategories.map((category, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center gap-3 p-4 rounded-xl bg-amber-500/5 hover:bg-amber-500/10 transition-colors"
                        >
                          <category.icon className="h-8 w-8 text-amber-400" />
                          <span className="text-sm font-medium text-center">{category.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Asset Types */}
                  <div className="rounded-2xl bg-background/50 border border-border p-6 md:p-8">
                    <h3 className="text-xl font-semibold mb-4">Tipos de Activos Gestionados</h3>
                    <p className="text-muted-foreground mb-6">
                      El primer paso consiste en evaluar la situación patrimonial actual, haciendo un balance
                      patrimonial y analizando los ingresos y gastos.
                    </p>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        "Acciones y Obligaciones",
                        "Fondos comunes de inversión",
                        "Seguro de vida",
                        "Residencia principal",
                        "Inmobiliario locativo",
                        "SCPI (Sociedad Civil de Inversión Inmobiliaria)",
                        "Empresa y Fondo de comercio",
                        "Obras de arte",
                        "Vehículos de colección",
                        "Piedras preciosas",
                        "Derechos de autor y Patentes",
                        "Y más...",
                      ].map((asset, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/5">
                          <CheckCircle2 className="h-4 w-4 text-amber-400 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{asset}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Process Info */}
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      icon: FileText,
                      title: "1. Balance Patrimonial",
                      desc: "Evaluación completa de sus activos, ingresos y gastos actuales.",
                    },
                    {
                      icon: TrendingUp,
                      title: "2. Estrategia de Crecimiento",
                      desc: "Elaboración de un plan de inversión adaptado a sus objetivos.",
                    },
                    {
                      icon: Shield,
                      title: "3. Protección y Transmisión",
                      desc: "Implementación de dispositivos para asegurar y transmitir su patrimonio.",
                    },
                  ].map((step, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-border bg-background/50 p-6 hover:border-amber-500/30 transition-colors"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 mb-4">
                        <step.icon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold mb-2">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Inmobiliario */}
            {activeTab === "inmobiliario" && (
              <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Main Card */}
                <div className="rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30 p-8 md:p-12">
                  <div className="flex items-start gap-6 mb-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex-shrink-0">
                      <Home className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-4 text-emerald-400">
                        Gestión de Activos Inmobiliarios
                      </h2>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        La gestión de bienes inmobiliarios consiste en administrar, valorizar y asegurar
                        un patrimonio inmobiliario por cuenta de propietarios, combinando experiencia
                        jurídica, financiera y técnica.
                      </p>
                    </div>
                  </div>

                  {/* Main Description */}
                  <div className="rounded-2xl bg-background/50 border border-border p-6 md:p-8 mb-8">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-emerald-400" />
                      Conjunto de Bienes Fonciers e Inmuebles
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      La gestión inmobiliaria reúne el conjunto de acciones necesarias para administrar
                      un bien residencial, comercial o locativo. Busca optimizar el rendimiento,
                      asegurar la conformidad reglamentaria y garantizar la satisfacción de los ocupantes.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        "Gestión locativa completa",
                        "Selección y acompañamiento de los locatarios",
                        "Establecimiento de contratos y estados de lugar",
                        "Cobro de alquileres y cargas",
                        "Gestión de contenciosos e impagos",
                        "Mantenimiento y reparaciones",
                        "Seguimiento de trabajos y renovaciones",
                        "Contabilidad y declaraciones fiscales",
                        "Consejo estratégico patrimonial",
                        "Optimización fiscal",
                        "Evaluación y experticia",
                        "Transacciones y arbitrajes",
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/5">
                          <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Property Types */}
                  <div className="rounded-2xl bg-background/50 border border-border p-6 md:p-8">
                    <h3 className="text-xl font-semibold mb-4">Tipos de Bienes Gestionados</h3>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { name: "Residencial", desc: "Apartamentos, casas" },
                        { name: "Comercial", desc: "Oficinas, tiendas" },
                        { name: "Locativo", desc: "Inversión" },
                        { name: "Foncier", desc: "Terrenos desnudos" },
                        { name: "Inmuebles", desc: "Conjuntos inmobiliarios" },
                        { name: "Mixto", desc: "Uso combinado" },
                      ].map((prop, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors"
                        >
                          <h4 className="font-semibold text-emerald-400 mb-1">{prop.name}</h4>
                          <p className="text-sm text-muted-foreground">{prop.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      icon: TrendingUp,
                      title: "Optimización del Rendimiento",
                      desc: "Maximización de los ingresos locativos y de la plusvalía a largo plazo.",
                    },
                    {
                      icon: Shield,
                      title: "Conformidad Reglamentaria",
                      desc: "Respeto de las obligaciones legales y reglamentarias vigentes.",
                    },
                    {
                      icon: Users,
                      title: "Satisfacción Ocupantes",
                      desc: "Gestión proactiva para asegurar la calidad de vida y la fidelización.",
                    },
                  ].map((benefit, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-border bg-background/50 p-6 hover:border-emerald-500/30 transition-colors"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-4">
                        <benefit.icon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold mb-2">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-violet-600/20 to-purple-600/20 border-t border-violet-500/30">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                ¿Necesita un Acompañamiento Personalizado?
              </h2>
              <p className="text-muted-foreground mb-8">
                Nuestros expertos en gestión de activos están a su disposición para analizar su situación
                y proponerle las mejores soluciones.
              </p>
              <Link
                href="/es#contact"
                className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-violet-500/50"
              >
                Tomar Cita
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        <Footer locale="es" />
      </div>
    </>
  );
}
