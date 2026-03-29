'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Layout } from '@/components/Layout';

export default function NotFound() {
  return (
    <Layout hideNavbar floatingThemeToggle>
      <div className="min-h-screen w-full bg-background flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(0,201,177,0.1),transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center relative z-10"
        >
          <div className="relative inline-block mb-12">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                y: [0, -4, 0]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-[140px] font-black text-foreground/5 leading-none select-none"
            >
              404
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-[32px] bg-gradient-brand flex items-center justify-center shadow-2xl shadow-primary/30 rotate-12">
                <Search className="w-10 h-10 text-white -rotate-12" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-black text-foreground mb-4 tracking-tight">
            Página no encontrada
          </h1>
          <p className="text-muted-foreground mb-12 text-sm leading-relaxed max-w-[280px] mx-auto">
            Lo sentimos, el micrositio o la página que buscas no existe o ha sido movido.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <Link 
              href="/"
              className="flex items-center justify-center gap-2 bg-foreground text-background font-bold py-4 rounded-2xl hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-foreground/10"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm">Inicio</span>
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 glass border border-border text-foreground font-bold py-4 rounded-2xl hover:bg-muted transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Regresar</span>
            </button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
