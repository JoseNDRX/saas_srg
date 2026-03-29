'use client';

import Link from 'next/link';
import { Layers } from 'lucide-react';
import { useBrand, BRAND_CONFIG } from '@/hooks/useBrand';

export function Footer() {
  const brand = useBrand();
  const config = BRAND_CONFIG[brand];
  const isStandMX = brand === 'standmx';
  const primaryColor = isStandMX ? '#00c9b1' : '#f59e0b';
  const accentColor = isStandMX ? '#a78bfa' : '#10b981';

  return (
    <footer className="border-t border-border mt-auto bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-primary/10 transition-transform group-hover:scale-110"
                style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)` }}
              >
                <Layers className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-lg text-foreground tracking-tight">{config.logoText}</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Plataforma de identidad digital para profesionales y negocios en México.
            </p>
          </div>

          <FooterCol title="Producto" links={[
            { label: 'vCards', href: '/#vcards' },
            { label: 'Menús', href: '/#menus' },
            { label: 'Showcases', href: '/#showcases' },
            { label: 'QR Codes', href: '/#qr' },
          ]} />
          <FooterCol title="Empresa" links={[
            { label: 'Nosotros', href: '/about' },
            { label: 'Blog', href: '/blog' },
            { label: 'Contacto', href: '/contact' },
          ]} />
          <FooterCol title="Legal" links={[
            { label: 'Privacidad', href: '/privacy' },
            { label: 'Términos', href: '/terms' },
          ]} />
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 {config.name} by JNDRX - México.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Términos</Link>
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-sm font-bold text-foreground mb-4 uppercase tracking-widest">{title}</h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-xs text-muted-foreground hover:text-primary dark:hover:text-white transition-colors font-medium"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
