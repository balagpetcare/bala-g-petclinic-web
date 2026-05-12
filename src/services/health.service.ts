import { http } from '@/lib/api';
import type { BackendApiResponse } from '@/types/api';
import type { HealthPayload, HealthReadyPayload } from '@/types/health';

export async function getHealth(): Promise<BackendApiResponse<HealthPayload>> {
  return http.get<HealthPayload>('/health');
}

export async function getHealthReady(): Promise<BackendApiResponse<HealthReadyPayload>> {
  return http.get<HealthReadyPayload>('/health/ready');
}
