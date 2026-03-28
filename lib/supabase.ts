import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

let _supabase: SupabaseClient<Database> | null = null;

/**
 * Lazily-initialized Supabase client.
 * Only throws when actually called, not at module load time —
 * so the dev server starts cleanly even without .env.local.
 */
export function getSupabase(): SupabaseClient<Database> {
  if (_supabase) return _supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      '❌ Supabase env vars missing. Copy .env.local.example → .env.local and fill in your project credentials.'
    );
  }

  _supabase = createClient<Database>(url, key);
  return _supabase;
}

// Convenience re-export for backwards-compatible usage
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_target, prop) {
    return (getSupabase() as unknown as Record<string, unknown>)[prop as string];
  },
});
