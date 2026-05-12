import {
  Stethoscope,
  Syringe,
  Ambulance,
  Scissors,
  HeartPulse,
  Bone,
} from 'lucide-react';
import type { ClinicService } from '@/types';

export const clinicServices: ClinicService[] = [
  {
    id: 'svc-1',
    slug: 'veterinary',
    title: 'Veterinary Consultation',
    shortDescription:
      'Comprehensive checkups, diagnosis, and personalized treatment plans.',
    fullDescription:
      'Our veterinary consultation covers complete physical examination, diagnostic testing, treatment planning, and preventive care guidance. Each visit is tailored to your pet\'s age, breed, and medical history to ensure the best possible outcomes.',
    icon: Stethoscope,
    features: [
      'Complete physical examination',
      'Diagnostic blood work and lab tests',
      'Personalized treatment plans',
      'Nutritional counseling',
      'Follow-up care coordination',
    ],
    duration: '30–45 minutes',
    priceRange: 'Varies by consultation type',
  },
  {
    id: 'svc-2',
    slug: 'vaccinations',
    title: 'Vaccination Programs',
    shortDescription:
      'Age-appropriate vaccination schedules with future visit reminders.',
    fullDescription:
      'Stay ahead of preventable diseases with our structured vaccination programs. We follow recommended immunization schedules for puppies, kittens, and adult pets, and provide timely reminders so no dose is missed.',
    icon: Syringe,
    features: [
      'Core and non-core vaccine protocols',
      'Puppy and kitten vaccination series',
      'Annual booster scheduling',
      'Vaccination certificate issuance',
      'Adverse reaction monitoring',
    ],
    duration: '15–20 minutes',
    priceRange: 'Per vaccine pricing available',
  },
  {
    id: 'svc-3',
    slug: 'emergency',
    title: 'Emergency Care',
    shortDescription:
      'Urgent assessment and stabilization for critical pet health situations.',
    fullDescription:
      'When every minute counts, our emergency care service provides rapid triage, stabilization, and treatment guidance. We prioritize communication so pet parents understand what is happening and what comes next.',
    icon: Ambulance,
    features: [
      'Rapid triage and assessment',
      'Emergency stabilization procedures',
      'Critical care monitoring',
      'Emergency surgery referral coordination',
      'Post-emergency follow-up planning',
    ],
    duration: 'As needed',
    priceRange: 'Based on severity and treatment',
  },
  {
    id: 'svc-4',
    slug: 'grooming',
    title: 'Grooming & Hygiene',
    shortDescription:
      'Professional grooming that supports long-term skin and coat health.',
    fullDescription:
      'Our grooming services go beyond aesthetics. Each session includes health checks for skin conditions, ear infections, and dental concerns. We use gentle, pet-safe products and create a calm environment for every animal.',
    icon: Scissors,
    features: [
      'Full bath and blow-dry',
      'Breed-specific haircuts and styling',
      'Nail trimming and ear cleaning',
      'Skin and coat health assessment',
      'De-shedding and de-matting treatments',
    ],
    duration: '60–90 minutes',
    priceRange: 'Based on pet size and coat type',
  },
  {
    id: 'svc-5',
    slug: 'dental-care',
    title: 'Dental Care',
    shortDescription:
      'Oral health evaluations, cleaning, and preventive dental treatments.',
    fullDescription:
      'Dental disease is one of the most common conditions in pets. Our dental care services include professional cleaning, oral examinations, and guidance on home dental care routines to protect your pet\'s oral health.',
    icon: HeartPulse,
    features: [
      'Professional dental cleaning',
      'Oral health examination',
      'Tooth extraction when necessary',
      'Home dental care guidance',
      'Dental X-rays and diagnostics',
    ],
    duration: '45–90 minutes',
    priceRange: 'Varies by procedure',
  },
  {
    id: 'svc-6',
    slug: 'nutrition-counseling',
    title: 'Nutrition Counseling',
    shortDescription:
      'Vet-guided nutrition plans for optimal pet health at every life stage.',
    fullDescription:
      'Proper nutrition is the foundation of pet wellness. Our veterinarians assess your pet\'s dietary needs based on age, breed, weight, and health conditions to recommend evidence-based nutrition plans and premium food options from our clinic shop.',
    icon: Bone,
    features: [
      'Personalized diet assessment',
      'Weight management programs',
      'Life-stage nutrition planning',
      'Prescription diet guidance',
      'Integration with clinic shop products',
    ],
    duration: '20–30 minutes',
    priceRange: 'Included with consultation',
  },
];

export function getServiceBySlug(slug: string): ClinicService | undefined {
  return clinicServices.find((s) => s.slug === slug);
}

export function getAllServiceSlugs(): string[] {
  return clinicServices.map((s) => s.slug);
}
