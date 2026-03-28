'use client';

import { Layout } from '@/components/Layout';
import { ArrowRight, QrCode, Globe, Smartphone, Palette, MessageCircle, Shield } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const FEATURES = [
  {
    icon: QrCode,
    title: 'QR Inteligente',
    description: 'Códigos QR con redirección 301. Cambia de plan sin perder tu QR impreso.',
  },
  {
    icon: Globe,
    title: 'Dominio Propio',
    description: 'Desde subdominios hasta CNAME completo con SSL automático.',
  },
  {
    icon: Smartphone,
    title: 'PWA Nativa',
    description: 'Cada micro-sitio es instalable como app. Carga instantánea y offline.',
  },
  {
    icon: Palette,
    title: 'Editor No-Code',
    description: 'Sube logos, elige colores y actualiza precios sin tocar código.',
  },
  {
    icon: MessageCircle,
    title: 'Pedidos WhatsApp',
    description: 'Menús digitales con carrito y envío directo al WhatsApp del negocio.',
  },
  {
    icon: Shield,
    title: 'Multi-Tenant',
    description: 'Arquitectura SaaS escalable con roles, RLS y aislamiento por tenant.',
  },
];

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'para siempre',
    description: 'Perfecto para probar la plataforma.',
    urlExample: 'puestoweb.com/d/[hash]',
    features: ['1 micro-sitio', 'QR básico', 'Directorio con ads', 'Plantilla estándar'],
    ctaText: 'Empezar gratis',
    href: '/register',
    highlighted: false,
  },
  {
    name: 'Basic',
    price: '$99',
    period: '/mes MXN',
    description: 'Para profesionales independientes.',
    urlExample: 'puestoweb.com/[slug]',
    features: ['3 micro-sitios', 'QR inteligente', 'Slug personalizado', 'PWA Lite', 'Sin publicidad'],
    ctaText: 'Elegir plan',
    href: '/register?plan=basic',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$249',
    period: '/mes MXN',
    description: 'Para negocios que quieren destacar.',
    urlExample: '[tu-marca].standmx.com',
    features: [
      '10 micro-sitios',
      'Subdominio propio',
      'SSL automático',
      'Menú con WhatsApp',
      'Analytics básico',
      'Soporte prioritario',
    ],
    ctaText: 'Elegir plan',
    href: '/register?plan=pro',
    highlighted: true,
    badge: 'Popular',
  },
  {
    name: 'Elite',
    price: '$499',
    period: '/mes MXN',
    description: 'Dominio propio y control total.',
    urlExample: 'www.tudominio.com',
    features: [
      'Micro-sitios ilimitados',
      'Dominio propio (CNAME)',
      'SSL + CDN premium',
      'Editor avanzado',
      'Analytics completo',
      'API access',
      'White-label',
    ],
    ctaText: 'Elegir plan',
    href: '/register?plan=elite',
    highlighted: false,
  },
];

const MICROSITE_TYPES = [
  { label: 'vCard', sublabel: 'Constructor' },
  { label: 'Menú', sublabel: 'Constructor' },
  { label: 'Showcase', sublabel: 'Constructor' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function HomePage() {
  return (
    <Layout>
      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="relative w-full flex flex-col items-center justify-center pt-32 pb-16 px-4 text-center overflow-hidden">
        {/* Subtle Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        
        {/* Glow Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(0,201,177,0.15),transparent_60%)] pointer-events-none" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative flex flex-col items-center w-full z-10"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border border-zinc-800 text-zinc-400 text-xs bg-zinc-950/50 backdrop-blur-sm">
            <span className="text-[#00c9b1]">⚡</span>
            Plataforma de Identidad Digital
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white max-w-4xl mx-auto leading-tight">
            Tu presencia digital,<br/>
            <span className="gradient-text-standmx">automatizada</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="max-w-xl mx-auto text-lg text-zinc-400 mb-10 text-balance leading-relaxed">
            Crea vCards, menús digitales y showcases profesionales en minutos. QR inteligente, dominio propio y PWA — todo en una sola plataforma.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium text-black transition-all hover:opacity-90 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,201,177,0.3)]"
              style={{ background: 'linear-gradient(135deg, #00c9b1 0%, #a78bfa 100%)' }}
            >
              Comenzar gratis
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/demo"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium border border-zinc-800 text-zinc-300 hover:bg-zinc-900 transition-all hover:-translate-y-1 bg-[#111113]/50 backdrop-blur-sm"
            >
              Ver demo
            </Link>
          </motion.div>
        </motion.div>

        {/* Microsite type cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative z-10 mt-20 w-full max-w-4xl mx-auto bg-[#0a0a0c]/80 border border-[#00c9b1]/20 rounded-[32px] p-8 md:p-12 backdrop-blur-xl shadow-[0_0_80px_-15px_rgba(0,201,177,0.15)] ring-1 ring-[#00c9b1]/10"
        >
          {/* Subtle internal grid/glow inside the big card */}
          <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_50%_50%,rgba(0,201,177,0.05),transparent_70%)] pointer-events-none" />

          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-6">
            {MICROSITE_TYPES.map((type) => (
              <div
                key={type.label}
                className="bg-[#111113] border border-zinc-800/60 rounded-2xl p-6 flex flex-col items-center justify-center gap-5 hover:border-zinc-700 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(0,201,177,0.2)] transition-all duration-300 cursor-pointer h-40"
              >
                <div
                  className="w-14 h-14 rounded-2xl shadow-[0_0_15px_rgba(0,201,177,0.4)]"
                  style={{ background: 'linear-gradient(135deg, #00c9b1 0%, #a78bfa 100%)' }}
                />
                <div className="text-center">
                  <p className="font-bold text-[15px] text-white tracking-wide">{type.label}</p>
                  <p className="text-[11px] text-zinc-500 uppercase tracking-widest mt-1 font-medium">{type.sublabel}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── Features ─────────────────────────────────────────────── */}
      <section id="funciones" className="w-full py-24 pb-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold mb-3 text-white">Todo lo que necesitas</motion.h2>
            <motion.p variants={fadeUp} className="text-zinc-400 max-w-lg mx-auto text-sm">
              Una plataforma completa para gestionar tu identidad digital profesional.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  variants={fadeUp}
                  className="bg-[#111113]/80 backdrop-blur-sm border border-zinc-800/60 rounded-xl p-6 flex flex-col gap-5 shadow-[0_0_30px_-10px_rgba(0,201,177,0.08)] hover:border-[#00c9b1]/30 hover:-translate-y-1 hover:shadow-[0_0_40px_-10px_rgba(0,201,177,0.2)] transition-all duration-300 ring-1 ring-white/5"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(0,201,177,0.1)' }}
                  >
                    <Icon className="w-5 h-5 text-[#00c9b1]" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-white text-[15px]">{feat.title}</h3>
                    <p className="text-[13px] text-zinc-400 leading-relaxed text-balance">{feat.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── Pricing ──────────────────────────────────────────────── */}
      <section id="precios" className="w-full pb-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold mb-3 text-white">
              Planes que <span className="gradient-text-standmx">escalan contigo</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-zinc-400 max-w-xl mx-auto text-sm">
              Desde gratis hasta white-label. Cada plan incluye QR inteligente con redirección 301.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto items-end"
          >
            {PLANS.map((plan) => (
              <motion.div
                key={plan.name}
                variants={fadeUp}
                className={`relative bg-[#111113]/80 backdrop-blur-sm border ${
                  plan.highlighted 
                    ? 'border-[#00c9b1]/60 shadow-[0_0_40px_-5px_rgba(0,201,177,0.25)] ring-1 ring-[#00c9b1]/30 hover:shadow-[0_0_50px_-5px_rgba(0,201,177,0.35)]' 
                    : 'border-zinc-800/60 shadow-[0_0_30px_-10px_rgba(0,201,177,0.08)] hover:shadow-[0_0_40px_-10px_rgba(0,201,177,0.2)] hover:border-[#00c9b1]/30'
                } rounded-xl p-6 flex flex-col h-full hover:-translate-y-1 transition-all duration-300 ring-1 ring-white/5`}
              >
                {plan.badge && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold text-black uppercase tracking-wider"
                    style={{ background: 'linear-gradient(135deg, #00c9b1 0%, #a78bfa 100%)' }}
                  >
                    {plan.badge}
                  </span>
                )}

                <div className="mb-4">
                  <h3 className="font-semibold text-[15px] text-white">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-[13px] text-zinc-400">{plan.period}</span>
                  </div>
                  <p className="text-[13px] text-zinc-400 mt-2 min-h-[40px]">{plan.description}</p>
                </div>

                <div
                  className="px-3 py-2.5 rounded-lg text-[12px] font-mono mb-6 bg-black/40 text-zinc-300 border border-zinc-800/50 truncate"
                >
                  <span className={plan.highlighted ? "text-[#00c9b1]" : "text-zinc-500"}>
                    {plan.urlExample}
                  </span>
                </div>

                <ul className="flex flex-col gap-3 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[13px] text-zinc-300">
                      <span className="text-[#00c9b1]">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`w-full py-3 rounded-xl text-[13px] font-semibold text-center mt-auto transition-all ${
                    plan.highlighted
                      ? 'text-black hover:opacity-90 hover:scale-105 active:scale-95'
                      : 'bg-transparent border border-zinc-700 text-white hover:bg-zinc-800 hover:text-white active:scale-95'
                  }`}
                  style={
                    plan.highlighted
                      ? { background: 'linear-gradient(135deg, #00c9b1 0%, #a78bfa 100%)' }
                      : {}
                  }
                >
                  {plan.ctaText}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
