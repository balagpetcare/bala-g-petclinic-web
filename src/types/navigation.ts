import type { ReactNode } from 'react';

export interface NavItem {
  label: string;
  href: string;
  icon?: ReactNode;
  description?: string;
  children?: NavItem[];
  badge?: string;
  external?: boolean;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface FooterSection {
  title: string;
  links: {
    label: string;
    href: string;
    external?: boolean;
  }[];
}
