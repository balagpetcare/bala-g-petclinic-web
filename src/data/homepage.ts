import {
  Ambulance,
  Bone,
  CalendarCheck,
  HeartPulse,
  PawPrint,
  Scissors,
  ShieldCheck,
  ShoppingBag,
  Stethoscope,
  Syringe,
} from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';

export type HomeIcon = ComponentType<SVGProps<SVGSVGElement>>;

export interface HomeHeroSlide {
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  description: string;
  primaryAction: {
    label: string;
    href: string;
  };
  secondaryAction: {
    label: string;
    href: string;
  };
  image: {
    src?: string;
    alt: string;
  };
}

export interface ServiceCardData {
  title: string;
  description: string;
  href: string;
  icon: HomeIcon;
}

export interface DoctorShowcaseItem {
  name: string;
  role: string;
  summary: string;
  image: {
    src?: string;
    alt: string;
  };
}

export interface ProductHighlight {
  name: string;
  category: string;
  priceLabel: string;
  href: string;
  image: {
    src?: string;
    alt: string;
  };
}

export interface TestimonialItem {
  quote: string;
  name: string;
  pet: string;
  rating: number;
}

export interface BlogPreviewItem {
  title: string;
  excerpt: string;
  href: string;
  category: string;
  publishedAt: string;
}

export const heroSlides: HomeHeroSlide[] = [
  {
    eyebrow: 'Trusted clinic and pet shop',
    title: 'Complete Care for',
    highlightedTitle: 'Happy, Healthy Pets',
    description:
      'Expert veterinary care, emergency support, grooming, and carefully selected pet essentials under one dependable clinic experience.',
    primaryAction: {
      label: 'Book Appointment',
      href: '/contact',
    },
    secondaryAction: {
      label: 'Shop Essentials',
      href: '/shop',
    },
    image: {
      alt: 'Veterinarian gently examining a healthy pet',
    },
  },
  {
    eyebrow: 'Emergency-ready veterinary team',
    title: 'Fast Help When',
    highlightedTitle: 'Every Minute Matters',
    description:
      'Reach the clinic quickly for urgent pet concerns, triage guidance, and connected follow-up care.',
    primaryAction: {
      label: 'Call Emergency',
      href: 'tel:+91XXXXXXXXXX',
    },
    secondaryAction: {
      label: 'View Services',
      href: '/services',
    },
    image: {
      alt: 'Emergency veterinary care team prepared for urgent pet treatment',
    },
  },
];

export const serviceCards: ServiceCardData[] = [
  {
    title: 'Veterinary Consultation',
    description: 'Preventive checkups, diagnosis, and treatment plans tailored to each pet.',
    href: '/services/veterinary',
    icon: Stethoscope,
  },
  {
    title: 'Vaccination Care',
    description: 'Age-appropriate vaccination schedules with reminders for future visits.',
    href: '/services/vaccinations',
    icon: Syringe,
  },
  {
    title: 'Emergency Support',
    description: 'Urgent assessment and guidance for critical pet health situations.',
    href: '/services/emergency',
    icon: Ambulance,
  },
  {
    title: 'Grooming and Hygiene',
    description: 'Clean, comfortable grooming services that support long-term health.',
    href: '/services/grooming',
    icon: Scissors,
  },
];

export const clinicHighlights = [
  {
    title: 'Care-first clinic',
    description: 'Designed around calm visits, clear communication, and pet comfort.',
    icon: HeartPulse,
  },
  {
    title: 'Doctor-led guidance',
    description: 'Treatment decisions stay connected to qualified veterinary oversight.',
    icon: ShieldCheck,
  },
  {
    title: 'Clinic + shop ecosystem',
    description: 'Healthcare, nutrition, grooming, and essentials planned as one journey.',
    icon: ShoppingBag,
  },
  {
    title: 'Pet-parent education',
    description: 'Practical advice for nutrition, vaccination, hygiene, and recovery.',
    icon: PawPrint,
  },
];

export const doctorShowcase: DoctorShowcaseItem[] = [
  {
    name: 'Veterinary Care Team',
    role: 'General medicine and preventive care',
    summary:
      'A coordinated team focused on routine care, wellness checks, vaccinations, and early diagnosis.',
    image: {
      alt: 'Bala G Pet Clinic veterinary care team',
    },
  },
  {
    name: 'Emergency Response Team',
    role: 'Urgent care and triage',
    summary:
      'Emergency-first workflows help pet parents get quick direction when urgent support is needed.',
    image: {
      alt: 'Emergency veterinary team ready for urgent pet care',
    },
  },
  {
    name: 'Grooming Specialists',
    role: 'Hygiene and comfort care',
    summary:
      'Gentle grooming services that support skin health, coat quality, and pet confidence.',
    image: {
      alt: 'Pet grooming specialist caring for a pet',
    },
  },
];

export const productHighlights: ProductHighlight[] = [
  {
    name: 'Vet-recommended nutrition',
    category: 'Pet Food',
    priceLabel: 'From clinic-approved brands',
    href: '/shop/category/pet-food',
    image: {
      alt: 'Premium pet food and nutrition products',
    },
  },
  {
    name: 'Wellness essentials',
    category: 'Healthcare',
    priceLabel: 'Supplements and care products',
    href: '/shop/category/healthcare',
    image: {
      alt: 'Pet wellness supplements and care essentials',
    },
  },
  {
    name: 'Comfort accessories',
    category: 'Accessories',
    priceLabel: 'Beds, bowls, toys, and more',
    href: '/shop/category/accessories',
    image: {
      alt: 'Pet accessories and comfort products',
    },
  },
];

export const testimonials: TestimonialItem[] = [
  {
    quote:
      'The team explained every step clearly and treated our dog with real patience. The combined clinic and shop support made follow-up care simple.',
    name: 'Pet Parent',
    pet: 'Dog wellness visit',
    rating: 5,
  },
  {
    quote:
      'We received quick guidance during an urgent situation and knew exactly what to do next. That calm support mattered.',
    name: 'Pet Parent',
    pet: 'Emergency consultation',
    rating: 5,
  },
  {
    quote:
      'Grooming was gentle, clean, and well organized. Our cat was comfortable throughout the visit.',
    name: 'Pet Parent',
    pet: 'Grooming service',
    rating: 5,
  },
];

export const blogPreviews: BlogPreviewItem[] = [
  {
    title: 'How often should pets visit the vet?',
    excerpt:
      'A practical guide to routine checkups, vaccination timelines, and signs that need faster attention.',
    href: '/blog/pet-checkup-frequency',
    category: 'Preventive Care',
    publishedAt: '2026-05-01',
  },
  {
    title: 'Choosing the right food for your pet',
    excerpt:
      'What to consider before selecting nutrition products for puppies, kittens, adults, and senior pets.',
    href: '/blog/choosing-pet-food',
    category: 'Nutrition',
    publishedAt: '2026-04-20',
  },
  {
    title: 'Emergency signs pet parents should know',
    excerpt:
      'Recognize symptoms that need urgent veterinary guidance and prepare for a calmer clinic visit.',
    href: '/blog/pet-emergency-signs',
    category: 'Emergency',
    publishedAt: '2026-04-10',
  },
];

export const trustFeatures = [
  {
    title: 'Vet-approved products',
    description: 'Shop essentials selected to support real care plans.',
    icon: ShieldCheck,
  },
  {
    title: 'Appointment-first clinic',
    description: 'Book visits and connect them to future reminders.',
    icon: CalendarCheck,
  },
  {
    title: 'Pet wellness focus',
    description: 'Health, grooming, and nutrition considered together.',
    icon: Bone,
  },
];
