import type { Doctor } from '@/types';

export const doctors: Doctor[] = [
  {
    id: 'doc-1',
    slug: 'dr-veterinary-lead',
    name: 'Dr. Veterinary Lead',
    title: 'Chief Veterinarian',
    specialization: 'General Medicine & Surgery',
    qualifications: ['BVSc & AH', 'MVSc (Veterinary Medicine)'],
    experience: '10+ years of clinical practice',
    bio: 'Leading the clinic with a focus on evidence-based veterinary medicine. Specializes in internal medicine, preventive care, and complex diagnostic cases. Committed to clear communication with pet parents throughout every treatment journey.',
    available: true,
  },
  {
    id: 'doc-2',
    slug: 'dr-surgical-specialist',
    name: 'Dr. Surgical Specialist',
    title: 'Veterinary Surgeon',
    specialization: 'Orthopedic & Soft Tissue Surgery',
    qualifications: ['BVSc & AH', 'MVSc (Veterinary Surgery)'],
    experience: '8+ years of surgical practice',
    bio: 'Dedicated to advanced surgical techniques including orthopedic repairs, soft tissue surgeries, and emergency surgical interventions. Maintains a compassionate approach with thorough pre- and post-operative care planning.',
    available: true,
  },
  {
    id: 'doc-3',
    slug: 'dr-dermatology-care',
    name: 'Dr. Dermatology Care',
    title: 'Veterinary Dermatologist',
    specialization: 'Dermatology & Allergy Management',
    qualifications: ['BVSc & AH', 'Diploma in Veterinary Dermatology'],
    experience: '6+ years of dermatology practice',
    bio: 'Focused on diagnosing and treating skin conditions, allergies, and chronic dermatological issues in companion animals. Works closely with the grooming team to align hygiene practices with medical treatment plans.',
    available: true,
  },
  {
    id: 'doc-4',
    slug: 'dr-emergency-response',
    name: 'Dr. Emergency Response',
    title: 'Emergency Care Veterinarian',
    specialization: 'Emergency & Critical Care',
    qualifications: ['BVSc & AH', 'Certificate in Emergency Veterinary Medicine'],
    experience: '7+ years of emergency practice',
    bio: 'Trained in rapid triage, stabilization, and critical care management. Available for urgent consultations and experienced in guiding pet parents through high-stress situations with clarity and calm.',
    available: true,
  },
];

export function getDoctorBySlug(slug: string): Doctor | undefined {
  return doctors.find((d) => d.slug === slug);
}

export function getAllDoctorSlugs(): string[] {
  return doctors.map((d) => d.slug);
}
