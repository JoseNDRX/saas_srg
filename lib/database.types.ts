/**
 * Supabase Database Types for Twin-Brand Platform
 * Based on PRD schema: Profiles, Microsites, QR Analytics
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/* ─── JSONB Content Blocks ───────────────────────────────────────── */
export interface VCardContent {
  displayName: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  avatarUrl?: string;
  socialLinks?: { platform: string; url: string }[];
  theme?: {
    primaryColor: string;
    accentColor: string;
    backgroundStyle: 'solid' | 'gradient' | 'image';
  };
}

export interface MenuContent {
  businessName: string;
  logoUrl?: string;
  currency?: string;
  whatsappPhone: string;
  categories: {
    id: string;
    name: string;
    items: {
      id: string;
      name: string;
      description?: string;
      price: number;
      imageUrl?: string;
      available: boolean;
    }[];
  }[];
}

export interface ShowcaseContent {
  headline: string;
  description?: string;
  heroImageUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  sections?: Json[];
}

export type MicrositeContent = VCardContent | MenuContent | ShowcaseContent;

/* ─── Database Tables ────────────────────────────────────────────── */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          subscription_tier: 'free' | 'basic' | 'pro' | 'elite';
          custom_domain: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & { email: string; id: string };
        Update: Partial<Database['public']['Tables']['profiles']['Row']>;
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };

      microsites: {
        Row: {
          id: string;
          owner_id: string;
          slug: string;
          hash: string | null;
          type: string; 
          config: any;
          content: any;
          published: boolean;
          custom_domain: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['microsites']['Row']> & { owner_id: string; slug: string; type: string };
        Update: Partial<Database['public']['Tables']['microsites']['Row']>;
        Relationships: [
          {
            foreignKeyName: 'microsites_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };

      qr_codes: {
        Row: {
          id: string;
          microsite_id: string;
          current_url: string;
          redirect_url: string | null;
          is_301_redirect: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['qr_codes']['Row']> & { microsite_id: string; current_url: string };
        Update: Partial<Database['public']['Tables']['qr_codes']['Row']>;
        Relationships: [
          {
            foreignKeyName: 'qr_codes_microsite_id_fkey';
            columns: ['microsite_id'];
            isOneToOne: false;
            referencedRelation: 'microsites';
            referencedColumns: ['id'];
          }
        ];
      };

      qr_analytics: {
        Row: {
          id: string;
          microsite_id: string;
          scanned_at: string;
          user_agent: string | null;
          ip_country: string | null;
          referrer: string | null;
        };
        Insert: Partial<Database['public']['Tables']['qr_analytics']['Row']> & { microsite_id: string };
        Update: Partial<Database['public']['Tables']['qr_analytics']['Row']>;
        Relationships: [
          {
            foreignKeyName: 'qr_analytics_microsite_id_fkey';
            columns: ['microsite_id'];
            isOneToOne: false;
            referencedRelation: 'microsites';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      subscription_tier: 'free' | 'basic' | 'pro' | 'elite';
      microsite_type: 'vCard' | 'Menu' | 'Showcase' | 'vcard' | 'menu' | 'showcase';
    };
  };
}
