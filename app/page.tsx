'use client';

import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { ArrowRight, QrCode, Globe, Smartphone, Palette, MessageCircle, Shield, X, Check, Smartphone as Phone, ScanLine, Layout as LayoutIcon } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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
  { 
    label: 'vCard', 
    sublabel: 'Identidad Digital', 
    icon: Phone,
    description: 'La evolución de la tarjeta de presentación física. Permite a tus clientes guardarte en sus contactos con un solo toque.',
    features: ['Botón Guardar Contacto (.vcf)', 'Links a Redes Sociales', 'Compatible con Apple & Google Wallet'],
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop'
  },
  { 
    label: 'Menú', 
    sublabel: 'Digital / WhatsApp', 
    icon: ScanLine,
    description: 'Convierte tu carta física en un sistema de pedidos digital. Ideal para restaurantes y cafeterías.',
    features: ['Catálogo con Precios', 'Carrito de Compras', 'Pedidos Directos a WhatsApp'],
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop'
  },
  { 
    label: 'Showcase', 
    sublabel: 'Portafolio Visual', 
    icon: LayoutIcon,
    description: 'Exhibe tus proyectos o servicios con galerías de alta resolución. Diseñado para impacto visual.',
    features: ['Galerías de Proyectos', 'Secciones Customizables', 'Optimizado para Conversión'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop'
  },
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
  const [selectedType, setSelectedType] = useState<typeof MICROSITE_TYPES[0] | null>(null);

  return (
    <Layout>
      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="relative w-full flex flex-col items-center justify-center pt-24 md:pt-32 pb-16 px-4 text-center overflow-hidden bg-background selection:bg-primary/20">
        {/* Subtle Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-50 dark:opacity-100" />
        
        {/* Glow Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(0,201,177,0.15),transparent_60%)] pointer-events-none" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative flex flex-col items-center w-full z-10"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border border-border text-muted-foreground text-[10px] md:text-xs glass shadow-sm">
            <span className="text-primary">⚡</span>
            Plataforma de Identidad Digital
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={fadeUp} className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6 text-foreground max-w-4xl mx-auto leading-tight">
            Tu presencia digital,<br/>
            <span className="gradient-text-standmx">automatizada</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="max-w-xl mx-auto text-base md:text-lg text-muted-foreground mb-10 text-balance leading-relaxed px-4">
            Crea vCards, menús digitales y showcases profesionales en minutos. QR inteligente, dominio propio y PWA — todo en una sola plataforma.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md px-4">
            <Link
              href="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-black transition-all hover:opacity-90 hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(0,201,177,0.3)]"
              style={{ background: 'linear-gradient(135deg, #00c9b1 0%, #a78bfa 100%)' }}
            >
              Comenzar gratis
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/demo"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold border border-border text-foreground hover:bg-muted transition-all hover:-translate-y-1 glass"
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
          className="relative z-10 mt-16 md:mt-24 w-full max-w-5xl mx-auto glass rounded-[40px] p-6 md:p-12 shadow-2xl border border-border"
        >
          <div className="absolute inset-0 rounded-[40px] bg-[radial-gradient(circle_at_50%_0%,rgba(0,201,177,0.1),transparent_70%)] pointer-events-none" />

          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
            {MICROSITE_TYPES.map((type) => {
              const Icon = type.icon;
              const itemId = type.label === 'vCard' ? 'vcards' : type.label === 'Menú' ? 'menus' : 'showcases';
              return (
                <div
                  key={type.label}
                  id={itemId}
                  onClick={() => setSelectedType(type)}
                  className="group bg-card/40 dark:bg-[#1a1a1c]/40 border border-border rounded-3xl p-6 flex flex-col items-center justify-center gap-5 hover:border-primary/50 hover:-translate-y-2 hover:bg-card/60 transition-all duration-500 cursor-pointer h-48 md:h-56 shadow-xl scroll-mt-32"
                >
                  <div
                    className="w-16 h-16 rounded-[22px] shadow-2xl shadow-primary/20 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform duration-500"
                    style={{ background: 'linear-gradient(135deg, #00c9b1 0%, #a78bfa 100%)' }}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="text-center">
                    <p className="font-black text-lg text-foreground tracking-wide">{type.label}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-1 font-black group-hover:text-primary transition-colors">{type.sublabel}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Modal Example */}
        <AnimatePresence>
          {selectedType && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedType(null)}
                className="absolute inset-0 bg-background/90 backdrop-blur-2xl" 
              />
              <motion.div 
                layoutId={`type-${selectedType.label}`}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-5xl bg-card border border-border rounded-[40px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative z-10 flex flex-col md:flex-row max-h-[90vh] overflow-y-auto custom-scrollbar"
              >
                <div className="relative w-full md:w-[45%] aspect-video md:aspect-auto bg-muted overflow-hidden">
                  <img src={selectedType.image} alt={selectedType.label} className="absolute inset-0 w-full h-full object-cover opacity-60 dark:opacity-40" />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-card via-transparent to-transparent" />
                </div>
                
                <div className="p-8 md:p-14 flex flex-col flex-1 relative">
                  <button 
                    onClick={() => setSelectedType(null)}
                    className="absolute top-8 right-8 p-3 rounded-full bg-muted/50 hover:bg-muted text-foreground transition-all active:scale-90 z-20"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center text-white shadow-2xl shadow-primary/20">
                      <selectedType.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-foreground">{selectedType.label}</h3>
                      <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">{selectedType.sublabel}</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-10 text-lg leading-relaxed font-medium">
                    {selectedType.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                     {selectedType.features.map(f => (
                       <div key={f} className="flex items-center gap-4 bg-muted/50 p-4 rounded-2xl border border-border">
                         <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                           <Check className="w-4 h-4 text-primary" strokeWidth={4} />
                         </div>
                         <span className="text-sm font-bold text-foreground/80">{f}</span>
                       </div>
                     ))}
                  </div>

                  <Link 
                    href="/register"
                    className="w-full py-5 bg-gradient-brand rounded-2xl text-black font-black text-xs uppercase tracking-widest text-center hover:opacity-90 transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-primary/20 mt-auto"
                  >
                    Empezar mi {selectedType.label}
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* ─── Features ─────────────────────────────────────────────── */}
      <section id="funciones" className="w-full py-24 md:py-32 relative overflow-hidden scroll-mt-20 bg-background">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16 md:mb-24"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-black mb-5 text-foreground tracking-tight">Todo lo que necesitas</motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground max-w-lg mx-auto text-base md:text-lg">
              Una plataforma completa diseñada para la nueva era de identidad digital.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto"
          >
            {FEATURES.map((feat) => {
              const Icon = feat.icon;
              const isQR = feat.title.includes('QR');
              return (
                <motion.div
                  key={feat.title}
                  id={isQR ? 'qr' : undefined}
                  variants={fadeUp}
                  className="bg-card/60 dark:bg-[#111113]/60 border border-border rounded-3xl p-8 flex flex-col gap-6 hover:border-primary/40 hover:-translate-y-2 transition-all duration-500 scroll-mt-40 shadow-sm"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20"
                  >
                    <Icon className="w-6 h-6 text-primary" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-black mb-3 text-foreground text-lg tracking-wide">{feat.title}</h3>
                    <p className="text-[14px] text-muted-foreground leading-relaxed font-medium">{feat.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── Pricing ──────────────────────────────────────────────── */}
      <section id="precios" className="w-full pb-32 scroll-mt-24 bg-background">
        <div className="container mx-auto px-6">
           <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16 md:mb-24"
          >
            <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-black mb-6 text-foreground tracking-tighter">
              Planes <span className="gradient-text-standmx">escalables</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg">
              Desde gratis hasta nivel empresarial. Incluye QR con redirección 301.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto items-stretch"
          >
            {PLANS.map((plan) => (
              <motion.div
                key={plan.name}
                variants={fadeUp}
                className={`relative bg-card border border-border rounded-[40px] p-8 flex flex-col h-full hover:-translate-y-2 transition-all duration-500 shadow-sm ${
                  plan.highlighted 
                    ? 'ring-2 ring-primary shadow-[0_40px_80px_-20px_rgba(0,201,177,0.3)] z-20' 
                    : 'hover:border-primary/20'
                }`}
              >
                {plan.badge && (
                  <span
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full text-[10px] font-black text-black uppercase tracking-[0.2em] bg-gradient-brand shadow-2xl"
                  >
                    {plan.badge}
                  </span>
                )}

                 <div className="mb-8">
                  <h3 className="font-bold text-muted-foreground text-xs uppercase tracking-[0.3em] mb-4">{plan.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-foreground">{plan.price}</span>
                    <span className="text-sm font-bold text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground mt-4 text-sm font-medium leading-relaxed">{plan.description}</p>
                </div>

                <div
                  className="px-4 py-4 rounded-2xl text-[11px] font-mono mb-8 bg-muted text-muted-foreground border border-border flex items-center justify-center overflow-hidden"
                >
                  <span className={plan.highlighted ? "text-primary truncate" : "text-muted-foreground truncate"}>
                    {plan.urlExample}
                  </span>
                </div>

                <ul className="flex flex-col gap-4 flex-1 mb-10">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-4 text-sm font-bold text-foreground/80">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                         <span className="text-primary text-xs">✓</span>
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`w-full py-5 rounded-[22px] text-xs font-black uppercase tracking-widest text-center mt-auto transition-all ${
                    plan.highlighted
                      ? 'text-black hover:opacity-90 hover:scale-105 active:scale-95 shadow-xl'
                      : 'bg-muted border border-border text-foreground hover:bg-muted/80 active:scale-95'
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
