import type { NavItem, FooterSection } from '@/types';

/** Shop categories — used in header “More” menu and mobile drawer. */
export const shopNavChildren: NavItem[] = [
  {
    label: 'All products',
    href: '/shop',
    description: 'Browse our complete collection',
  },
  {
    label: 'Pet food',
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
];

/** Primary header navigation (desktop + mobile main list). */
export const mainNavItems: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    href: '/services',
    children: [
      {
        label: 'Emergency care',
        href: '/services/emergency',
        description: '24/7 emergency veterinary support',
      },
      {
        label: 'Pet consultation',
        href: '/services/veterinary',
        description: 'Medical exams & treatment plans',
      },
      {
        label: 'Surgery',
        href: '/services/surgery',
        description: 'Expert surgical procedures',
      },
      {
        label: 'Vaccination',
        href: '/services/vaccinations',
        description: 'Core & lifestyle vaccines',
      },
      {
        label: 'Grooming',
        href: '/services/grooming',
        description: 'Professional grooming & hygiene',
      },
    ],
  },
  { label: 'Doctors', href: '/doctors' },
  { label: 'Locations', href: '/locations' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

/** Secondary links (header “More” menu + mobile “Also visit”). */
export const headerUtilityNavItems: NavItem[] = [
  {
    label: 'Shop',
    href: '/shop',
    children: shopNavChildren,
  },
  { label: 'Clinic', href: '/clinic' },
  { label: 'Testimonials', href: '/testimonials' },
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
