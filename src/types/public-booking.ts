/** Shapes returned by `GET/POST /api/v1/public/*` (Bala G Pet Clinic public booking API). */

export interface PublicBranchSummary {
  id: string;
  name: string;
  slug: string;
  clinicName: string;
  contactPhone: string | null;
  contactEmail: string | null;
  addressLine1: string | null;
  city: string | null;
  region: string | null;
  postalCode: string | null;
  country: string | null;
  timezone: string;
}

export interface PublicBranchDetail extends PublicBranchSummary {
  addressLine2: string | null;
  weeklyHours: { dayOfWeek: string; startTime: string; endTime: string }[];
  doctors: {
    id: string;
    marketingSlug: string | null;
    firstName: string;
    lastName: string;
    specialization: string;
    profileImageUrl: string | null;
    isAvailable: boolean;
  }[];
}

export interface PublicDoctorSummary {
  id: string;
  marketingSlug: string | null;
  firstName: string;
  lastName: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  bio: string | null;
  profileImageUrl: string | null;
  isAvailable: boolean;
  emergencyAvailable: boolean;
  defaultSlotMinutes: number;
  branches: { id: string; name: string; slug: string }[];
}

export interface PublicDoctorDetail extends PublicDoctorSummary {
  reviewAverage: number;
  reviewCount: number;
}

export interface PublicAvailabilityResponse {
  doctorId: string;
  branchId: string | null;
  slots: string[];
}

export interface PublicBookingRequestResult {
  id: string;
  referenceNumber: string;
  status: string;
  preferredScheduledAt: string;
}

export interface PublicEmergencyIntakeResult {
  id: string;
  referenceNumber: string;
}

export interface PublicReviewItem {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  author: string;
  createdAt: string;
}

export interface PublicReviewsPayload {
  reviews: PublicReviewItem[];
  total: number;
  averageRating: number;
  reviewCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PetSummary {
  id: string;
  name: string;
  species: string;
}
