import type { WithId, WithSlug, ImageAsset } from './common';
import type { ComponentType, SVGProps } from 'react';

export type ClinicIcon = ComponentType<SVGProps<SVGSVGElement>>;

export interface ClinicService extends WithId, WithSlug {
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: ClinicIcon;
  image?: ImageAsset;
  features: string[];
  duration?: string;
  priceRange?: string;
}

export interface Doctor extends WithId, WithSlug {
  name: string;
  title: string;
  specialization: string;
  qualifications: string[];
  experience: string;
  bio: string;
  image?: ImageAsset;
  available: boolean;
}

export interface AppointmentFormData {
  petName: string;
  petType: string;
  ownerName: string;
  phone: string;
  email: string;
  serviceSlug: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
}

export interface EmergencyFormData {
  petName: string;
  petType: string;
  ownerName: string;
  phone: string;
  symptoms: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface FaqItem extends WithId {
  question: string;
  answer: string;
  category: string;
}

export interface FormState {
  status: 'idle' | 'submitting' | 'success' | 'error';
  message: string | null;
}
