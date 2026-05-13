import type { ReactNode } from 'react';

export interface BaseProps {
  className?: string;
  children?: ReactNode;
}

export interface WithId {
  id: string;
}

export interface WithSlug {
  slug: string;
}

export interface WithTimestamps {
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface ImageAsset {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
}

export interface LinkItem {
  label: string;
  href: string;
  external?: boolean;
  icon?: ReactNode;
}

export interface ContactInfo {
  phone: string;
  /** Optional second line (e.g. general enquiries). */
  secondaryPhone?: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface EmergencyContact {
  phone: string;
  available: string;
  label: string;
  /** Marketing line shown on contact / emergency surfaces. */
  headline: string;
}

export interface SocialLink {
  platform: 'facebook' | 'instagram' | 'twitter' | 'youtube' | 'linkedin' | 'whatsapp';
  url: string;
  label: string;
}

export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  isClosed?: boolean;
}

export type Status = 'idle' | 'loading' | 'success' | 'error';

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
