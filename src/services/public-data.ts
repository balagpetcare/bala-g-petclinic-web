import { http } from '@/lib/api/http';
import type {
  PublicBranchSummary,
  PublicBranchDetail,
  PublicDoctorSummary,
  PublicDoctorDetail,
  PublicReviewsPayload,
} from '@/types/public-booking';

const REVAL_BRANCH = 120;
const REVAL_LIST = 60;

export async function fetchPublicBranches(): Promise<PublicBranchSummary[]> {
  try {
    const res = await http.get<PublicBranchSummary[]>('public/branches', {
      next: { revalidate: REVAL_BRANCH },
    });
    if (!res.success || !Array.isArray(res.data)) return [];
    return res.data;
  } catch {
    return [];
  }
}

export async function fetchPublicBranchBySlug(slug: string): Promise<PublicBranchDetail | null> {
  try {
    const res = await http.get<PublicBranchDetail>(`public/branches/slug/${encodeURIComponent(slug)}`, {
      next: { revalidate: REVAL_BRANCH },
    });
    if (!res.success || !res.data) return null;
    return res.data;
  } catch {
    return null;
  }
}

export async function fetchPublicDoctors(branchId?: string): Promise<PublicDoctorSummary[]> {
  try {
    const res = await http.get<PublicDoctorSummary[]>('public/doctors', {
      params: branchId ? { branchId } : undefined,
      next: { revalidate: REVAL_LIST },
    });
    if (!res.success || !Array.isArray(res.data)) return [];
    return res.data;
  } catch {
    return [];
  }
}

export async function fetchPublicDoctorBySlug(slug: string): Promise<PublicDoctorDetail | null> {
  try {
    const res = await http.get<PublicDoctorDetail>(`public/doctors/slug/${encodeURIComponent(slug)}`, {
      cache: 'no-store',
    });
    if (!res.success || !res.data) return null;
    return res.data;
  } catch {
    return null;
  }
}

export async function fetchPublicReviews(params: {
  targetType: 'DOCTOR' | 'BRANCH';
  targetId: string;
  page?: number;
  limit?: number;
}): Promise<PublicReviewsPayload | null> {
  try {
    const res = await http.get<PublicReviewsPayload>('public/reviews', {
      params: {
        targetType: params.targetType,
        targetId: params.targetId,
        page: params.page ?? 1,
        limit: params.limit ?? 10,
      },
      next: { revalidate: REVAL_LIST },
    });
    if (!res.success || !res.data) return null;
    return res.data;
  } catch {
    return null;
  }
}
