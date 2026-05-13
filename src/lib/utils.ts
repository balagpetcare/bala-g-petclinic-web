import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = 'INR',
  locale: string = 'en-IN'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions,
  locale: string = 'en-IN'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    ...options,
  }).format(dateObj);
}

export function formatTime(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions,
  locale: string = 'en-IN'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    timeStyle: 'short',
    ...options,
  }).format(dateObj);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
}

/** Builds a `tel:` URI from any display format (non-digits stripped). */
export function toTelHref(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.length > 0 ? `tel:${digits}` : 'tel:';
}

/**
 * Bangladesh WhatsApp deep link (`wa.me`) from a local mobile string (e.g. `01881-227204`).
 */
export function toBangladeshWhatsAppHref(localPhone: string): string {
  const digits = localPhone.replace(/\D/g, '');
  const withoutLeadingZero = digits.startsWith('0') ? digits.slice(1) : digits;
  if (!withoutLeadingZero) {
    return 'https://wa.me/';
  }
  return `https://wa.me/880${withoutLeadingZero}`;
}

/** E.164-style display for Bangladesh mobiles (for JSON-LD `telephone`). */
export function toBangladeshInternationalTel(localPhone: string): string {
  const digits = localPhone.replace(/\D/g, '');
  const withoutLeadingZero = digits.startsWith('0') ? digits.slice(1) : digits;
  if (!withoutLeadingZero) {
    return '';
  }
  return `+880${withoutLeadingZero}`;
}

export function formatContactAddress(contact: {
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}): string {
  const line2 = [contact.city, contact.state].filter((s) => s.trim().length > 0).join(', ');
  const line3 = [contact.pincode, contact.country].filter((s) => String(s).trim().length > 0).join(' ');
  return [contact.address, line2, line3].filter(Boolean).join(' · ');
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
