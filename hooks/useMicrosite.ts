'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type Microsite = Database['public']['Tables']['microsites']['Row'];

export function useMicrosite(userId: string | null) {
  const [microsite, setMicrosite] = useState<Microsite | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMicrosite = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('microsites')
        .select('*')
        .eq('owner_id', userId)
        .maybeSingle();

      if (error) throw error;
      setMicrosite(data);
    } catch (e: any) {
      setError(e.message);
      console.error('Error fetching microsite:', e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchMicrosite();
  }, [fetchMicrosite]);

  const saveMicrosite = async (updates: Partial<Microsite>) => {
    if (!userId) return;

    try {
      setSaving(true);
      setError(null);

      const { data, error } = await supabase
        .from('microsites')
        .upsert({
          ...microsite,
          ...updates,
          owner_id: userId,
          updated_at: new Date().toISOString(),
        } as any)
        .select()
        .single();

      if (error) throw error;
      setMicrosite(data);
      return data;
    } catch (e: any) {
      setError(e.message);
      console.error('Error saving microsite:', e);
      throw e;
    } finally {
      setSaving(false);
    }
  };

  return { microsite, loading, saving, error, saveMicrosite, refresh: fetchMicrosite };
}
