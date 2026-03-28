'use client';

import Link from 'next/link';
import { Layers } from 'lucide-react';
import { useBrand, BRAND_CONFIG } from '@/hooks/useBrand';
import { ThemeToggle } from './ThemeToggle';

const NAV_LINKS = [
  { label: 'Funciones', href: '/#funciones' },
  { label: 'Precios', href: '/#precios' },
  { label: 'Docs', href: '/docs' },
];

export function Navbar() {
  const brand = useBrand();
  const config = BRAND_CONFIG[brand];
  const isStandMX = brand === 'standmx';
  
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label={`${config.name} — Inicio`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
            <Layers className="w-4 h-4 text-primary-foreground" strokeWidth={2} />
          </div>
          <span className="font-display font-bold text-lg">{config.logoText}</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle variant="navbar" />
          <Link href="/login" className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 rounded-md px-3 text-muted-foreground hover:text-foreground">
            Iniciar sesión
          </Link>
          <Link href="/register" className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-9 rounded-md px-3 bg-gradient-brand text-primary-foreground font-medium">
            Registrarse
          </Link>
        </div>
      </div>
    </header>
  );
}
