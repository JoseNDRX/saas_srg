/**
 * Twin-Brand detection utilities.
 * Determines if the current context is StandMX or PuestoWeb based on hostname.
 */

export type Brand = 'standmx' | 'puestoweb';

export interface BrandConfig {
  name: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  domain: string;
  logoText: string;
}

export const BRAND_CONFIG: Record<Brand, BrandConfig> = {
  standmx: {
    name: 'StandMX',
    tagline: 'Plataforma de Identidad Digital',
    primaryColor: '#00c9b1',
    accentColor: '#a78bfa',
    domain: 'standmx.com',
    logoText: 'StandMX',
  },
  puestoweb: {
    name: 'PuestoWeb',
    tagline: 'Tu negocio, en línea en minutos',
    primaryColor: '#f59e0b',
    accentColor: '#10b981',
    domain: 'puestoweb.com',
    logoText: 'PuestoWeb',
  },
};

/**
 * Detect brand from a hostname string.
 * Works in both middleware (Edge) and server components.
 */
export function detectBrandFromHost(host: string): Brand {
  const lower = host.toLowerCase();
  if (lower.includes('standmx') || lower.includes('stand.mx')) return 'standmx';
  if (lower.includes('puestoweb') || lower.includes('puesto.web')) return 'puestoweb';
  // Default
  return 'standmx';
}

/**
 * Returns the public URL format for the user's microsite based on their
 * subscription tier.
 */
export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'elite';

export function getMicrositeUrl(
  slug: string,
  hash: string,
  tier: SubscriptionTier
): string {
  switch (tier) {
    case 'free':
      return `https://puestoweb.com/d/${hash}`;
    case 'basic':
      return `https://puestoweb.com/${slug}`;
    case 'pro':
      return `https://${slug}.standmx.com`;
    case 'elite':
      // Custom domain — stored in user profile
      return `https://${slug}`;
    default:
      return `https://puestoweb.com/d/${hash}`;
  }
}
