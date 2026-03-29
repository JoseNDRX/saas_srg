'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useAnalytics(userId: string | null) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchStats() {
      try {
        setLoading(true);
        
        // 1. Obtener los micrositios del usuario
        const { data: microsites } = await supabase
          .from('microsites')
          .select('id, slug')
          .eq('owner_id', userId!);

        if (!microsites || microsites.length === 0) {
          setStats({ totalScans: 0, byCountry: {}, byMicrosite: [] });
          return;
        }

        const micrositeIds = microsites.map(m => m.id);

        // 2. Obtener todas las analíticas filtradas por micrositios
        const { data: analytics, error } = await supabase
          .from('qr_analytics')
          .select('*')
          .in('microsite_id', micrositeIds);

        if (error) throw error;

        // 3. Procesar datos
        const countryCodes = (analytics || []).reduce((acc: any, curr: any) => {
          acc[curr.ip_country || 'Unknown'] = (acc[curr.ip_country || 'Unknown'] || 0) + 1;
          return acc;
        }, {});

        const sitePerformance = microsites.map(m => {
          const scans = (analytics || []).filter(a => a.microsite_id === m.id).length;
          return { name: m.slug, scans };
        });

        setStats({
          totalScans: analytics.length,
          byCountry: countryCodes,
          byMicrosite: sitePerformance.sort((a,b) => b.scans - a.scans),
          raw: analytics
        });

      } catch (err) {
        console.error('Analytics Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [userId]);

  return { stats, loading };
}
