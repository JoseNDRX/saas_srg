import { NextRequest, NextResponse } from 'next/server';

/**
 * Twin-Brand Proxy (Next.js 16+)
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";
  const [hostWithoutPort] = hostname.split(':');

  console.log(`[PROXY] Host: ${hostWithoutPort} | Path: ${pathname}`);

  // EXIT EARLY for reserved paths
  if (
    pathname === '/login' ||
    pathname === '/register' ||
    pathname.startsWith('/dashboard') ||
    pathname.includes('.') ||
    pathname.startsWith('/_next/')
  ) {
    console.log(`[PROXY] BYPASS -> ${pathname}`);
    return NextResponse.next();
  }

  // 1. QR redirect handler
  if (pathname.startsWith('/qr/')) {
    const qrId = pathname.slice(4);
    return NextResponse.redirect(new URL(`/api/qr/${qrId}`, request.url), 301);
  }

  // 2. Identificadores de Entorno
  const isLocalhost = hostWithoutPort.endsWith('localhost') ||
    hostWithoutPort === '127.0.0.1' ||
    hostWithoutPort.startsWith('192.168.') ||
    hostWithoutPort.includes('ngrok-free.dev') ||
    hostWithoutPort.includes('ngrok-free.app') ||
    hostWithoutPort.includes('vercel.app') ||
    hostWithoutPort.includes('netlify.app');

  const isStandMXBase = hostWithoutPort === 'standmx.com' || hostWithoutPort === 'www.standmx.com';
  const parts = hostWithoutPort.split('.');

  // Custom domain (Elite tier)
  if (!hostWithoutPort.includes('standmx.com') && !hostWithoutPort.includes('puestoweb.com') && !isLocalhost) {
    const url = request.nextUrl.clone();
    url.pathname = `/custom-domain/${encodeURIComponent(hostWithoutPort)}${pathname}`;
    return NextResponse.rewrite(url);
  }

  // Subdomain routing ([slug].standmx.com o [slug].localhost)
  if (parts.length > 1) {
    const slug = parts[0];
    const isLocalSub = hostWithoutPort.endsWith('localhost') && hostWithoutPort !== 'localhost';
    const isStandMXSub = hostWithoutPort.endsWith('.standmx.com') && !isStandMXBase;

    if ((isLocalSub || isStandMXSub) && slug !== 'www') {
      const url = request.nextUrl.clone();
      url.pathname = `/s/${slug}${pathname === '/' ? '' : pathname}`;
      console.log(`[PROXY] REWRITE -> ${url.pathname}`);
      return NextResponse.rewrite(url);
    }
  }

  // PuestoWeb / Local Base routes
  const isLocalBase = hostWithoutPort === 'localhost' || hostWithoutPort === '127.0.0.1' || (hostWithoutPort.startsWith('192.168.') && parts.length === 4) || hostWithoutPort.includes('ngrok-free.dev') || hostWithoutPort.includes('ngrok-free.app') || hostWithoutPort.includes('vercel.app');
  const isPuestoWebBase = hostWithoutPort === 'puestoweb.com' || hostWithoutPort === 'www.puestoweb.com';

  if (isPuestoWebBase || isLocalBase) {
    // /d/[hash] → hash-based microsite
    if (pathname.startsWith('/d/')) {
      const hash = pathname.slice(3);
      const url = request.nextUrl.clone();
      url.pathname = `/view/hash/${hash}`;
      return NextResponse.rewrite(url);
    }

    // /[slug] → slug-based microsite (single segment only)
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 1 && !isReservedPath(segments[0])) {
      const slug = segments[0];
      const url = request.nextUrl.clone();
      url.pathname = `/view/slug/${slug}`;
      console.log(`[PROXY] SLUG REWRITE -> ${url.pathname}`);
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

function isReservedPath(segment: string): boolean {
  return new Set([
    'api', 'login', 'register', 'dashboard', 'docs', 'about', 'blog', 'contact',
    'pricing', 'privacy', 'terms', 's', 'd', 'qr', 'view', '_next', 'custom-domain', 'demo'
  ]).has(segment.toLowerCase());
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
