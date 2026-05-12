import type { NavItem, FooterSection } from '@/types';

export const mainNavItems: NavItem[] = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Book',
    href: '/appointment',
  },
  {
    label: 'Services',
    href: '/services',
    children: [
      {
        label: 'Veterinary Care',
        href: '/services/veterinary',
        description: 'Complete medical care for your pets',
      },
      {
        label: 'Vaccinations',
        href: '/services/vaccinations',
        description: 'Protect your pets with timely vaccinations',
      },
      {
        label: 'Surgery',
        href: '/services/surgery',
        description: 'Expert surgical procedures',
      },
      {
        label: 'Grooming',
        href: '/services/grooming',
        description: 'Professional pet grooming services',
      },
      {
        label: 'Pet Boarding',
        href: '/services/boarding',
        description: 'Safe and comfortable boarding',
      },
      {
        label: 'Emergency Care',
        href: '/services/emergency',
        description: '24/7 emergency veterinary services',
      },
    ],
  },
  {
    label: 'Our Doctors',
    href: '/doctors',
  },
  {
    label: 'Locations',
    href: '/locations',
  },
  {
    label: 'Clinic',
    href: '/clinic',
  },
  {
    label: 'Shop',
    href: '/shop',
    children: [
      {
        label: 'All Products',
        href: '/shop',
        description: 'Browse our complete collection',
      },
      {
        label: 'Pet Food',
        href: '/shop/category/pet-food',
        description: 'Premium nutrition for your pets',
      },
      {
        label: 'Accessories',
        href: '/shop/category/accessories',
        description: 'Toys, beds, and more',
      },
      {
        label: 'Healthcare',
        href: '/shop/category/healthcare',
        description: 'Supplements and health products',
      },
    ],
  },
  {
    label: 'Blog',
    href: '/blog',
  },
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Testimonials',
    href: '/testimonials',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];

export const footerSections: FooterSection[] = [
  {
    title: 'Services',
    links: [
      { label: 'Veterinary Care', href: '/services/veterinary' },
      { label: 'Vaccinations', href: '/services/vaccinations' },
      { label: 'Surgery', href: '/services/surgery' },
      { label: 'Grooming', href: '/services/grooming' },
      { label: 'Pet Boarding', href: '/services/boarding' },
      { label: 'Emergency Care', href: '/services/emergency' },
    ],
  },
  {
    title: 'Shop',
    links: [
      { label: 'All Products', href: '/shop' },
      { label: 'Pet Food', href: '/shop/category/pet-food' },
      { label: 'Accessories', href: '/shop/category/accessories' },
      { label: 'Healthcare', href: '/shop/category/healthcare' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Team', href: '/doctors' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Testimonials', href: '/testimonials' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
    ],
  },
];

export const mobileNavItems: NavItem[] = mainNavItems.map((item) => ({
  ...item,
  children: undefined,
}));
