import type { ContactInfo, SocialLink, BusinessHours, EmergencyContact } from '@/types';
import { toBangladeshWhatsAppHref } from '@/lib/utils';

export const siteConfig = {
  name: 'Bala G Pet Clinic',
  shortName: 'Bala G',
  /** Shown under the logo in the main header (desktop). */
  headerTagline: '24/7 Pet Emergency Care',
  description:
    'Emergency veterinary clinic on DIT Road, Dhaka 1219. 24-hour vet support, vaccinations, surgery, grooming, and vet-led pet shop — trusted animal hospital for cats and dogs in Bangladesh.',
  tagline: 'Caring for Your Pets Like Family',
  url: process.env['NEXT_PUBLIC_SITE_URL'] || 'https://balagpetclinic.com',
  ogImage: '/images/og-image.jpg',
  locale: 'en_BD',
  defaultCurrency: 'INR',
  currencySymbol: '₹',
} as const;

export const contactInfo: ContactInfo = {
  phone: '01881-227204',
  secondaryPhone: '01701-022274',
  email: 'info@balagpetclinic.com',
  address: '364 DIT Road',
  city: 'Dhaka',
  state: '',
  pincode: '1219',
  country: 'Bangladesh',
};

export const emergencyContact: EmergencyContact = {
  phone: '01881-227204',
  available: '24/7',
  label: '24/7 Emergency Call',
  headline: '24/7 Emergency Veterinary Service',
};

export const socialLinks: SocialLink[] = [
  {
    platform: 'facebook',
    url: 'https://facebook.com/balagpetclinic',
    label: 'Follow us on Facebook',
  },
  {
    platform: 'instagram',
    url: 'https://instagram.com/balagpetclinic',
    label: 'Follow us on Instagram',
  },
  {
    platform: 'whatsapp',
    url: toBangladeshWhatsAppHref(contactInfo.phone),
    label: 'Chat on WhatsApp',
  },
];

export const businessHours: BusinessHours[] = [
  { day: 'Monday', open: '09:00', close: '21:00' },
  { day: 'Tuesday', open: '09:00', close: '21:00' },
  { day: 'Wednesday', open: '09:00', close: '21:00' },
  { day: 'Thursday', open: '09:00', close: '21:00' },
  { day: 'Friday', open: '09:00', close: '21:00' },
  { day: 'Saturday', open: '09:00', close: '21:00' },
  { day: 'Sunday', open: '10:00', close: '18:00' },
];
