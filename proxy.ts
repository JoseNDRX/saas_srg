import { NextRequest, NextResponse } from 'next/server';
import { detectBrandFromHost } from './lib/brand';

/**
 * Twin-Brand Proxy (Next.js 16+)
 *
 * Routing logic (in priority order):
 * 1. Smart QR short-links  → /qr/[id]  → forwarded to the API route for 301 handling
 * 2. Custom domain tenants → any hostname not matching *.standmx.com / *.puestoweb.com
 *    → rewrite to /custom-domain/[hostname]/...
 * 3. Subdomains            → [slug].standmx.com  → rewrite to /s/[slug] (Pro tier)
 * 4. Hash routes           → puestoweb.com/d/[hash] → rewrite to /view/hash/[hash] (Free tier)
 * 5. Slug routes           → puestoweb.com/[slug]   → rewrite to /view/slug/[slug] (Basic tier)
 * 6. Marketing pages       → standmx.com or puestoweb.com (no subdomain) → pass through
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || ""; // Usar header host para ver el puerto si es necesario

  // ── 1. QR redirect handler ─────────────────────────────────────────
  if (pathname.startsWith('/qr/')) {
    const qrId = pathname.slice(4);
    const redirectUrl = new URL(`/api/qr/${qrId}`, request.url);
    return NextResponse.redirect(redirectUrl, 301);
  }

  // ── 2. Identificadores de Entorno ─────────────────────────────────
  // Extraemos el hostname SIN puerto
  const [hostWithoutPort] = hostname.split(':');
  
  console.log(`[PROXY] Host: ${hostname} | Path: ${pathname} | hostWithoutPort: ${hostWithoutPort}`);
  
  const isLocalhost = hostWithoutPort.endsWith('localhost') || hostWithoutPort === '127.0.0.1' || hostWithoutPort.startsWith('192.168.');
  
  const isStandMXBase = hostWithoutPort === 'standmx.com' || hostWithoutPort === 'www.standmx.com';
  const isStandMXSubdomain = hostWithoutPort.endsWith('.standmx.com') && !isStandMXBase;

  const parts = hostWithoutPort.split('.');
  // IPv4 es localBase si tiene 4 partes y empieza con 192. localhost es base si no tiene puntos.
  const isLocalBase = hostWithoutPort === 'localhost' || hostWithoutPort === '127.0.0.1' || (hostWithoutPort.startsWith('192.168.') && parts.length === 4);
  const isLocalSubdomain = isLocalhost && !isLocalBase;

  const isPuestoWebBase = hostWithoutPort === 'puestoweb.com' || hostWithoutPort === 'www.puestoweb.com';
  const isPuestoWebSubdomain = hostWithoutPort.endsWith('.puestoweb.com') && !isPuestoWebBase;

  // ── 3. Custom domain (Elite tier) ─────────────────────────────────
  // Si no está en nuestro clúster core ni es local, es un custom domain
  if (!hostWithoutPort.includes('standmx.com') && !hostWithoutPort.includes('puestoweb.com') && !isLocalhost) {
    const url = request.nextUrl.clone();
    url.pathname = `/custom-domain/${encodeURIComponent(hostWithoutPort)}${pathname}`;
    return NextResponse.rewrite(url);
  }

  // ── 4. Subdomain routing (Pro tier: [slug].standmx.com o [slug].localhost) ───────────
  // Si tiene más de un segmento y termina en localhost o .standmx.com, es un subdominio.
  if (parts.length > 1) {
    const isLocalSub = hostWithoutPort.endsWith('localhost') && hostWithoutPort !== 'localhost';
    const isStandMXSub = hostWithoutPort.endsWith('.standmx.com') && !isStandMXBase;

    if (isLocalSub || isStandMXSub) {
      const slug = parts[0];
      if (slug && slug !== 'www') {
        const url = request.nextUrl.clone();
        url.pathname = `/s/${slug}${pathname === '/' ? '' : pathname}`;
        console.log(`[PROXY] REWRITE EXECUTED: Host=${hostWithoutPort} -> Path=${url.pathname}`);
        return NextResponse.rewrite(url);
      }
    }
  }

  // ── 5. PuestoWeb hash/slug routes ─────────────────────────────────
  if (isPuestoWebBase || isLocalBase || isPuestoWebSubdomain) {
    // /d/[hash] → hash-based microsite (Free tier)
    if (pathname.startsWith('/d/')) {
      const hash = pathname.slice(3);
      const url = request.nextUrl.clone();
      url.pathname = `/view/hash/${hash}`;
      return NextResponse.rewrite(url);
    }

    // /[slug] → slug-based microsite (Basic tier) - single segment only
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 1 && !isReservedPath(segments[0])) {
      const slug = segments[0];
      const url = request.nextUrl.clone();
      url.pathname = `/view/slug/${slug}`;
      return NextResponse.rewrite(url);
    }
  }

  // ── 5. Pass through for marketing / app routes ────────────────────
  return NextResponse.next();
}

/** Paths that should NOT be treated as microsites */
function isReservedPath(segment: string): boolean {
  const reserved = new Set([
    'api',
    'login',
    'register',
    'dashboard',
    'docs',
    'about',
    'blog',
    'contact',
    'pricing',
    'privacy',
    'terms',
    's',
    'd',
    'qr',
    'view',
    '_next',
    'custom-domain',
    'demo',
  ]);
  return reserved.has(segment.toLowerCase());
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt (metadata)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
