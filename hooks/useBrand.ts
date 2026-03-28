'use client';

import { useEffect, useState } from 'react';
import { detectBrandFromHost, BRAND_CONFIG, type Brand } from '@/lib/brand';

export function useBrand(): Brand {
  const [brand, setBrand] = useState<Brand>('standmx');

  useEffect(() => {
    const host = window.location.hostname;
    setBrand(detectBrandFromHost(host));
  }, []);

  return brand;
}

export { BRAND_CONFIG };
