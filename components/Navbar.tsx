'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Layers, Menu, X, ArrowRight, ChevronRight } from 'lucide-react';
import { useBrand, BRAND_CONFIG } from '@/hooks/useBrand';
import { ThemeToggle } from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Funciones', href: '/#funciones' },
  { label: 'Precios', href: '/#precios' },
  { label: 'Contacto', href: '/contact' },
];

export function Navbar() {
  const brand = useBrand();
  const config = BRAND_CONFIG[brand];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu on resize
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setIsMenuOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  return (
    <>
      <header className="fixed top-0 z-[100] w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 z-[110]" onClick={() => setIsMenuOpen(false)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-2xl shadow-primary/20 hover:scale-110 transition-transform">
              <Layers className="w-5 h-5 text-white" strokeWidth={3} />
            </div>
            <span className="font-display font-black text-xl tracking-tighter text-foreground uppercase pt-1">
              {config.logoText}
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all active:scale-95">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* DESKTOP CTAs */}
          <div className="hidden md:flex items-center gap-6">
            <ThemeToggle variant="navbar" />
            <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all">
              Ingreso
            </Link>
            <Link href="/register" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-brand text-black font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all">
              Empezar <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* MOBILE TOGGLE (HEADER) */}
          <div className="flex md:hidden items-center gap-4 z-[110]">
            <ThemeToggle variant="navbar" />
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-xl bg-muted/50 border border-border/50 text-foreground active:scale-90 transition-all focus:outline-none"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMenuOpen ? 'close' : 'open'}
                  initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="md:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-[1001] bg-black/60 backdrop-blur-2xl"
              style={{ top: 0, left: 0, width: '100vw', height: '100vh' }}
            />
            
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200, bounce: 0 }}
              className="fixed right-0 top-0 bottom-0 w-[85%] z-[1002] bg-background/95 backdrop-blur-3xl pt-10 px-10 flex flex-col border-l border-border/50 shadow-[-50px_0_100px_rgba(0,0,0,0.5)] overflow-y-auto custom-scrollbar"
            >
              {/* Internal Close Button */}
              <div className="flex justify-end mb-8 shrink-0">
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-3 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-all active:scale-90 border border-border/20 shadow-sm"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-10">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={link.href}
                  >
                    <Link 
                      href={link.href} 
                      onClick={() => setIsMenuOpen(false)}
                      className="text-4xl font-black text-foreground tracking-tighter hover:text-primary transition-colors flex items-center justify-between group"
                    >
                      {link.label}
                      <ChevronRight className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* ACTION BUTTONS: mt-10 instead of mt-auto to keep distribution consistent */}
              <div className="mt-10 pb-16 flex flex-col gap-5">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link 
                    href="/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-5 rounded-2xl border border-border text-center font-black text-xs uppercase tracking-[0.2em] text-muted-foreground active:bg-muted/100 transition-colors block"
                  >
                    Acceder a mi panel
                  </Link>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link 
                    href="/register" 
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-5 rounded-3xl bg-gradient-brand text-black text-center font-black text-xs uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(0,201,177,0.3)] active:scale-95 transition-all flex justify-center gap-3 items-center block"
                  >
                    Empezar Ahora <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
