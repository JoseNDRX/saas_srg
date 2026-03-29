'use client';

import { Layout } from '@/components/Layout';
import { motion } from 'framer-motion';
import { Construction, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ConstructionPage({ title = "Sección en Construcción" }: { title?: string }) {
  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center max-w-md w-full"
        >
          <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-10 shadow-xl shadow-amber-500/5 rotate-12">
            <Construction className="w-10 h-10 text-amber-500 -rotate-12" />
          </div>
          <h1 className="text-3xl font-black mb-4 tracking-tight capitalize">{title}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-10">
            Estamos trabajando arduamente para brindarte la mejor experiencia en esta sección. 
            ¡Vuelve pronto para ver las novedades!
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-foreground text-background font-bold h-12 px-8 rounded-2xl hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-foreground/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Volver al Inicio</span>
          </Link>
        </motion.div>
      </div>
    </Layout>
  );
}
