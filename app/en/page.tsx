'use client';

import Link from 'next/link';
import { Users, Briefcase, CheckCircle2, ArrowRight, Award, Star, Globe, Clock, Target, Heart, Lightbulb, Shield, FileText, Handshake, TrendingUp, Zap, Building2, User, Mail, Phone, MapPin } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <>
      <Header locale="en" />
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
                  CNESST License: AdmA A24-52400
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
              >
                <span className="gradient-text">Welcome to Cabinet DETIE</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-4 leading-relaxed"
              >
                Your trusted partner in <span className="text-violet-400 font-semibold">International Recruitment</span> and <span className="text-amber-400 font-semibold">Certified Administrative Services</span> in Canada
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
              >
                For over 10 years, Cabinet DETIE has established itself as a privileged partner for businesses and professionals seeking excellence and rigor. With our dual expertise in international recruitment and certified administration, we support our clients in their most strategic projects with a personalized approach and tailored solutions.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
              >
                <Link
                  href="/en/recruitment"
                  className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/50 w-full sm:w-auto justify-center"
                >
                  <Users className="h-5 w-5" />
                  International Recruitment
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                </Link>

                <Link
                  href="/en/admin"
                  className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50 w-full sm:w-auto justify-center"
                >
                  <Briefcase className="h-5 w-5" />
                  Certified Administrator
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 border-t border-border/50"
              >
                {[
                  { value: '10+', label: "Years of Experience", icon: Award },
                  { value: '500+', label: 'Happy Clients', icon: Users },
                  { value: '50+', label: 'Countries Covered', icon: Globe },
                  { value: '100%', label: 'Client Satisfaction', icon: Star },
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

        {/* SECTOR 1: INTERNATIONAL RECRUITMENT */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 via-transparent to-transparent" />

          <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 mb-6">
                <Users className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium text-violet-400 uppercase tracking-wider">International Recruitment</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">Connect with the Best Global Talents</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We connect Canadian employers with the best international talents. From selection to integration, we guide you at every step.
              </p>
            </div>

            {/* Two Columns: Employers & Candidates */}
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
                    <h3 className="text-2xl font-bold text-violet-400">For Employers</h3>
                    <p className="text-sm text-muted-foreground">Find the ideal talents</p>
                  </div>
                </div>

                <ul className="space-y-4 mb-6">
                  {[
                    { icon: FileText, text: 'Access to a global pool of qualified talents' },
                    { icon: CheckCircle2, text: 'Rigorous and personalized selection' },
                    { icon: Handshake, text: 'Complete work permit management' },
                    { icon: TrendingUp, text: 'Successful integration of your new employees' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <item.icon className="h-5 w-5 text-violet-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{item.text}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/en/recruitment" className="inline-flex items-center gap-2 text-violet-400 font-medium hover:gap-4 transition-all">
                  Learn More
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
                    <h3 className="text-2xl font-bold text-emerald-400">For Candidates</h3>
                    <p className="text-sm text-muted-foreground">Work in Canada</p>
                  </div>
                </div>

                <ul className="space-y-4 mb-6">
                  {[
                    { icon: FileText, text: 'Verified job offers with legitimate employers' },
                    { icon: CheckCircle2, text: 'Obtaining your CNESST permit' },
                    { icon: Handshake, text: 'Complete legal support' },
                    { icon: Globe, text: 'Support for your relocation to Canada' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <item.icon className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{item.text}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/en/recruitment" className="inline-flex items-center gap-2 text-emerald-400 font-medium hover:gap-4 transition-all">
                  Apply Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTOR 2: CERTIFIED ADMINISTRATOR */}
        <section className="py-20 md:py-32 relative overflow-hidden bg-secondary/30">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />

          <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
                <Briefcase className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-400 uppercase tracking-wider">Certified Administrator</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">Professional Certified Services</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Member of the Order of Certified Administrators of Quebec - Canada. License AdmA A24-52400.
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {[
                {
                  icon: TrendingUp,
                  title: 'Financial Restructuring',
                  desc: 'We help entities in difficulty overcome their crises through analysis, creditor negotiation, and recovery plans.',
                  gradient: 'from-amber-500 to-orange-600'
                },
                {
                  icon: Globe,
                  title: 'Asset Management',
                  desc: 'Our experts are recognized asset managers who manage and grow sustainable investment portfolios.',
                  gradient: 'from-amber-500 to-orange-600'
                },
                {
                  icon: Shield,
                  title: 'Trust & Trustee',
                  desc: 'Long-term asset protection through trust and escrow account management.',
                  gradient: 'from-amber-500 to-orange-600'
                },
                {
                  icon: Zap,
                  title: 'Strategic Optimization',
                  desc: 'Territorial strategic planning optimization based on local consultation and data analysis.',
                  gradient: 'from-amber-500 to-orange-600'
                },
                {
                  icon: Building2,
                  title: 'Toor Siyo Center',
                  desc: 'Design and implementation of new solutions with global partners in a continuous improvement dynamic.',
                  gradient: 'from-amber-500 to-orange-600'
                },
                {
                  icon: Target,
                  title: 'International Lobbying',
                  desc: 'Official representation with government organizations like OECD, UN, or EU for your complex files.',
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

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 text-center"
            >
              <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-amber-500/10 border-2 border-amber-500/30">
                <CheckCircle2 className="h-8 w-8 text-amber-400" />
                <div className="text-left">
                  <div className="text-lg font-bold text-amber-400">CNESST License Validated</div>
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
                <span className="text-sm font-medium text-primary uppercase tracking-wider">Our Values</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">Fundamental Values</span>
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              {[
                { icon: Target, title: 'Excellence', desc: 'A constant commitment to quality and performance' },
                { icon: Shield, title: 'Integrity', desc: 'Transparent and ethical practices in all circumstances' },
                { icon: Heart, title: 'Engagement', desc: 'Personalized and dedicated support for each client' },
                { icon: Lightbulb, title: 'Innovation', desc: 'Creative solutions adapted to modern challenges' },
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
                <span className="text-sm font-medium text-primary uppercase tracking-wider">Why Us</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">Why Choose Us?</span>
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              {[
                { icon: Award, title: 'Recognized Expertise', desc: 'OAAQ & CNESST Member' },
                { icon: Clock, title: '10+ Years', desc: 'Of experience' },
                { icon: Globe, title: 'Global Reach', desc: '50+ countries covered' },
                { icon: Star, title: 'Excellence', desc: '100% satisfaction' },
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
                <span className="text-sm font-medium text-primary uppercase tracking-wider">Contact</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">Contact Us</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our team is ready to answer all your questions
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
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-sm text-muted-foreground">+1 (514) 980-8001</p>
              </div>
              <div className="rounded-2xl bg-background/50 border border-border p-6 text-center">
                <MapPin className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Address</h3>
                <p className="text-sm text-muted-foreground">Montreal, Quebec, Canada</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="rounded-3xl bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-amber-600/20 border-2 border-primary/30 p-8 sm:p-12 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Our team of experts is ready to support you in all your recruitment and administrative service projects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/en/recruitment" className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-violet-500/50">
                  Recruitment
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href="/en/admin" className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-amber-500/50">
                  Administrator
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer locale="en" />
    </>
  );
}
