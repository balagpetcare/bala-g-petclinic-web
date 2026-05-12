'use client';

import { useCallback, useEffect, useState } from 'react';
import { getHealth } from '@/services/health.service';
import type { BackendApiResponse } from '@/types/api';
import type { HealthPayload } from '@/types/health';

export function useApiHealth() {
  const [result, setResult] = useState<BackendApiResponse<HealthPayload> | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const next = await getHealth();
    setResult(next);
    setLoading(false);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { result, loading, reload };
}
