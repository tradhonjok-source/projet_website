'use client';

import Link from 'next/link';
import { Users, Briefcase, CheckCircle2, ArrowRight, Award, Star, Globe, Clock, Target, Heart, Lightbulb, Shield, FileText, Handshake, TrendingUp, Zap, Building2, User, Mail, Phone, MapPin } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <>
      <Header locale="es" />
      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-violet-950/50 via-background to-background">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
            <div className="text-center max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 mb-8 backdrop-blur-sm"
              >
                <CheckCircle2 className="h-4 w-4 text-violet-400" />
                <span className="text-xs sm:text-sm font-medium text-violet-300">
                  Licencia CNESST: AdmA A24-52400
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
              >
                <span className="gradient-text">Bienvenido a Cabinet DETIE</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-4 leading-relaxed"
              >
                Su socio de confianza en <span className="text-violet-400 font-semibold">Reclutamiento Internacional</span> y <span className="text-amber-400 font-semibold">Servicios Administrativos Certificados</span> en Canadá
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
              >
                Durante más de 10 años, Cabinet DETIE se ha establecido como un socio privilegiado para empresas y profesionales que buscan excelencia y rigor. Con nuestra doble experiencia en reclutamiento internacional y administración certificada, apoyamos a nuestros clientes en sus proyectos más estratégicos con un enfoque personalizado y soluciones a medida.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
              >
                <Link
                  href="/es/recruitment"
                  className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/50 w-full sm:w-auto justify-center"
                >
                  <Users className="h-5 w-5" />
                  Reclutamiento Internacional
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                </Link>

                <Link
                  href="/es/admin"
                  className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50 w-full sm:w-auto justify-center"
                >
                  <Briefcase className="h-5 w-5" />
                  Administrador Certificado
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 border-t border-border/50"
              >
                {[
                  { value: '10+', label: "Años de Experiencia", icon: Award },
                  { value: '500+', label: 'Clientes Satisfechos', icon: Users },
                  { value: '50+', label: 'Países Cubiertos', icon: Globe },
                  { value: '100%', label: 'Satisfacción del Cliente', icon: Star },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-center group"
                  >
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-violet-500/10 mb-3 group-hover:bg-violet-500/20 transition-colors">
                      <stat.icon className="h-5 w-5 text-violet-400" />
                    </div>
                    <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTOR 1: RECLUTAMIENTO INTERNACIONAL */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 via-transparent to-transparent" />

          <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 mb-6">
                <Users className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium text-violet-400 uppercase tracking-wider">Reclutamiento Internacional</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">Conéctese con los Mejores Talentos Globales</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Conectamos empleadores canadienses con los mejores talentos internacionales. Desde la selección hasta la integración, lo guiamos en cada paso.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
              {/* Employers Card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-2 border-violet-500/30 p-8 hover:border-violet-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/20"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-violet-400">Para Empleadores</h3>
                    <p className="text-sm text-muted-foreground">Encuentre los talentos ideales</p>
                  </div>
                </div>

                <ul className="space-y-4 mb-6">
                  {[
                    { icon: FileText, text: 'Acceso a un vivero mundial de talentos calificados' },
                    { icon: CheckCircle2, text: 'Selección rigurosa y personalizada' },
                    { icon: Handshake, text: 'Gestión completa de permisos de trabajo' },
                    { icon: TrendingUp, text: 'Integración exitosa de sus nuevos empleados' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <item.icon className="h-5 w-5 text-violet-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{item.text}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/es/recruitment" className="inline-flex items-center gap-2 text-violet-400 font-medium hover:gap-4 transition-all">
                  Saber Más
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>

              {/* Candidates Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30 p-8 hover:border-emerald-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-emerald-400">Para Candidatos</h3>
                    <p className="text-sm text-muted-foreground">Trabaje en Canadá</p>
                  </div>
                </div>

                <ul className="space-y-4 mb-6">
                  {[
                    { icon: FileText, text: 'Ofertas de empleo verificadas con empleadores legítimos' },
                    { icon: CheckCircle2, text: 'Obtención de su permiso CNESST' },
                    { icon: Handshake, text: 'Acompañamiento jurídico completo' },
                    { icon: Globe, text: 'Apoyo para su instalación en Canadá' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <item.icon className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{item.text}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/es/recruitment" className="inline-flex items-center gap-2 text-emerald-400 font-medium hover:gap-4 transition-all">
                  Postular Ahora
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTOR 2: ADMINISTRADOR CERTIFICADO */}
        <section className="py-20 md:py-32 relative overflow-hidden bg-secondary/30">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />

          <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
                <Briefcase className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-400 uppercase tracking-wider">Administrador Certificado</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">Servicios Profesionales Certificados</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Miembro de la Orden de Administradores Certificados de Quebec - Canadá. Licencia AdmA A24-52400.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {[
                {
                  icon: TrendingUp,
                  title: 'Reestructuración Financiera',
                  desc: 'Ayudamos a entidades en dificultad a superar sus crisis mediante análisis, negociación con acreedores y planes de recuperación.',
                  gradient: 'from-amber-500 to-orange-600'
                },
                {
                  icon: Globe,
                  title: 'Gestión de Activos',
                  desc: 'Nuestros expertos son gestores de activos reconocidos que gestionan y hacen crecer carteras de inversión sostenibles.',
                  gradient: 'from-amber-500 to-orange-600'
                },
                {
                  icon: Shield,
                  title: 'Fideicomiso y Mandatario',
                  desc: 'Protección de activos a largo plazo mediante gestión de fideicomisos y cuentas en depósito.',
                  gradient: 'from-amber-500 to-orange-600'
                },
                {
                  icon: Zap,
                  title: 'Optimización Estratégica',
                  desc: 'Optimización de la planificación estratégica territorial basada en consulta local y análisis de datos.',
                  gradient: 'from-amber-500 to-orange-600'
                },
                {
                  icon: Building2,
                  title: 'Centro Toor Siyo',
                  desc: 'Diseño e implementación de nuevas soluciones con socios globales en una dinámica de mejora continua.',
                  gradient: 'from-amber-500 to-orange-600'
                },
                {
                  icon: Target,
                  title: 'Lobbying Internacional',
                  desc: 'Representación oficial ante organismos gubernamentales como OCDE, ONU o UE para sus expedientes complejos.',
                  gradient: 'from-amber-500 to-orange-600'
                },
              ].map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 p-6 hover:border-amber-500/60 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/20"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 text-center"
            >
              <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-amber-500/10 border-2 border-amber-500/30">
                <CheckCircle2 className="h-8 w-8 text-amber-400" />
                <div className="text-left">
                  <div className="text-lg font-bold text-amber-400">Licencia CNESST Validada</div>
                  <div className="text-sm text-amber-400/80">AdmA A24-52400</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary uppercase tracking-wider">Nuestros Valores</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">Valores Fundamentales</span>
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              {[
                { icon: Target, title: 'Excelencia', desc: 'Un compromiso constante con la calidad y el rendimiento' },
                { icon: Shield, title: 'Integridad', desc: 'Prácticas transparentes y éticas en toda circunstancia' },
                { icon: Heart, title: 'Compromiso', desc: 'Acompañamiento personalizado y dedicado a cada cliente' },
                { icon: Lightbulb, title: 'Innovación', desc: 'Soluciones creativas adaptadas a los desafíos modernos' },
              ].map((item, i) => (
                <div key={i} className="group text-center p-6 rounded-2xl bg-background/50 border border-border hover:border-primary/30 transition-all">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 md:py-32 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
                <Award className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary uppercase tracking-wider">Por Qué Nosotros</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">¿Por Qué Elegirnos?</span>
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              {[
                { icon: Award, title: 'Experiencia Reconocida', desc: 'Miembro OAAQ y CNESST' },
                { icon: Clock, title: '10+ Años', desc: 'De experiencia' },
                { icon: Globe, title: 'Alcance Global', desc: '50+ países cubiertos' },
                { icon: Star, title: 'Excelencia', desc: '100% satisfacción' },
              ].map((item, i) => (
                <div key={i} className="group text-center p-6 rounded-2xl bg-background/50 border border-border hover:border-primary/30 transition-all">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 md:py-32 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary uppercase tracking-wider">Contacto</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">Contáctenos</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Nuestro equipo está listo para responder todas sus preguntas
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
              <div className="rounded-2xl bg-background/50 border border-border p-6 text-center">
                <Mail className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-sm text-muted-foreground">contact@cabinetdetie.com</p>
              </div>
              <div className="rounded-2xl bg-background/50 border border-border p-6 text-center">
                <Phone className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Teléfono</h3>
                <p className="text-sm text-muted-foreground">+1 (514) 980-8001</p>
              </div>
              <div className="rounded-2xl bg-background/50 border border-border p-6 text-center">
                <MapPin className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Dirección</h3>
                <p className="text-sm text-muted-foreground">Montreal, Quebec, Canadá</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="rounded-3xl bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-amber-600/20 border-2 border-primary/30 p-8 sm:p-12 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">¿Listo para Comenzar?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Nuestro equipo de expertos está listo para apoyarlo en todos sus proyectos de reclutamiento y servicios administrativos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/es/recruitment" className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-violet-500/50">
                  Reclutamiento
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href="/es/admin" className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-amber-500/50">
                  Administrador
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer locale="es" />
    </>
  );
}
