import type { ContactInfo, SocialLink, BusinessHours } from '@/types';

export const siteConfig = {
  name: 'Bala G Pet Clinic',
  shortName: 'Bala G',
  description:
    'Premier veterinary care and pet shop in your area. Expert doctors, 24/7 emergency services, quality pet products, and comprehensive animal healthcare.',
  tagline: 'Caring for Your Pets Like Family',
  url: process.env['NEXT_PUBLIC_SITE_URL'] || 'https://balagpetclinic.com',
  ogImage: '/images/og-image.jpg',
  locale: 'en_IN',
  defaultCurrency: 'INR',
  currencySymbol: '₹',
} as const;

export const contactInfo: ContactInfo = {
  phone: '+91 XXXXXXXXXX',
  email: 'info@balagpetclinic.com',
  address: 'Address Line 1',
  city: 'City',
  state: 'State',
  pincode: 'XXXXXX',
  country: 'India',
};

export const emergencyContact = {
  phone: '+91 XXXXXXXXXX',
  available: '24/7',
  label: 'Emergency Helpline',
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
    url: 'https://wa.me/91XXXXXXXXXX',
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
