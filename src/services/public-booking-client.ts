'use client';

import { backendFetch } from '@/lib/api';
import type {
  PublicAvailabilityResponse,
  PublicBookingRequestResult,
  PublicBranchSummary,
  PublicDoctorSummary,
  PublicDoctorDetail,
  PublicEmergencyIntakeResult,
  PetSummary,
} from '@/types/public-booking';
import type { BackendApiResponse } from '@/types/api';

export async function clientGetDoctorBySlug(slug: string): Promise<PublicDoctorDetail | null> {
  const res = await backendFetch<PublicDoctorDetail>(`public/doctors/slug/${encodeURIComponent(slug)}`, {
    method: 'GET',
  });
  if (!res.success || !res.data) return null;
  return res.data;
}

export async function clientListBranches(): Promise<PublicBranchSummary[]> {
  const res = await backendFetch<PublicBranchSummary[]>('public/branches', { method: 'GET' });
  if (!res.success || !Array.isArray(res.data)) return [];
  return res.data;
}

export async function clientListDoctors(branchId?: string): Promise<PublicDoctorSummary[]> {
  const res = await backendFetch<PublicDoctorSummary[]>('public/doctors', {
    method: 'GET',
    params: branchId ? { branchId } : undefined,
  });
  if (!res.success || !Array.isArray(res.data)) return [];
  return res.data;
}

export async function clientListAvailability(input: {
  doctorId: string;
  branchId?: string;
  fromIso: string;
  toIso: string;
}): Promise<PublicAvailabilityResponse | null> {
  const res = await backendFetch<PublicAvailabilityResponse>('public/availability', {
    method: 'GET',
    params: {
      doctorId: input.doctorId,
      branchId: input.branchId,
      from: input.fromIso,
      to: input.toIso,
    },
  });
  if (!res.success || !res.data) return null;
  return res.data;
}

export async function clientCreateBookingRequest(
  body: {
    branchId?: string;
    doctorId?: string;
    petName: string;
    petSpecies: string;
    ownerName: string;
    contactPhone: string;
    contactEmail?: string;
    serviceSlug?: string;
    preferredScheduledAt: string;
    durationMinutes?: number;
    notes?: string;
    honeypot?: string;
  },
  options?: { idempotencyKey: string }
): Promise<BackendApiResponse<PublicBookingRequestResult>> {
  const idempotencyKey =
    options?.idempotencyKey ??
    (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}`);
  return backendFetch<PublicBookingRequestResult>('public/booking-requests', {
    method: 'POST',
    body,
    headers: { 'Idempotency-Key': idempotencyKey },
  });
}

export async function clientCreateEmergencyIntake(body: {
  branchId?: string;
  contactPhone: string;
  petSpecies: string;
  petName?: string;
  description: string;
  address?: string;
}): Promise<BackendApiResponse<PublicEmergencyIntakeResult>> {
  return backendFetch<PublicEmergencyIntakeResult>('public/emergency-intakes', {
    method: 'POST',
    body,
  });
}

export async function clientCreateReview(body: {
  targetType: 'DOCTOR' | 'BRANCH';
  targetId: string;
  guestName?: string;
  rating: number;
  title?: string;
  body: string;
  honeypot?: string;
}): Promise<BackendApiResponse<{ id: string; status: string }>> {
  return backendFetch('public/reviews', { method: 'POST', body });
}

export async function clientListPets(): Promise<PetSummary[]> {
  const res = await backendFetch<PetSummary[]>('pets', {
    method: 'GET',
    params: { page: 1, limit: 50 },
  });
  if (!res.success || !Array.isArray(res.data)) return [];
  return res.data;
}

export async function clientCreateAuthenticatedAppointment(body: {
  petId: string;
  doctorId: string;
  branchId?: string;
  scheduledAt: string;
  duration?: number;
  reason?: string;
}): Promise<BackendApiResponse<{ id: string; scheduledAt?: string }>> {
  return backendFetch('public/appointments', { method: 'POST', body });
}
