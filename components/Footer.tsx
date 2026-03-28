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
    <footer className="border-t border-zinc-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)` }}
              >
                <Layers className="w-3.5 h-3.5 text-white" strokeWidth={2} />
              </div>
              <span className="font-bold text-sm text-white">{config.logoText}</span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed">
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

        <div className="mt-10 pt-6 border-t border-zinc-800">
          <p className="text-center text-xs text-zinc-500">
            © 2026 StandMX / PuestoWeb. Todos los derechos reservados.
          </p>
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
      <h4 className="text-sm font-semibold text-white mb-3">{title}</h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-xs text-zinc-400 hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
