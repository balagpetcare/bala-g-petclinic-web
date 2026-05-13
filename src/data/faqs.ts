import type { FaqItem } from '@/types';

export const faqs: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'What are the clinic operating hours?',
    answer:
      'Bala G Pet Clinic operates as an emergency veterinary service with 24-hour availability for urgent cases on DIT Road, Dhaka 1219. Call our emergency line any time for guidance or to arrange immediate care.',
    category: 'General',
  },
  {
    id: 'faq-2',
    question: 'Do I need an appointment for a consultation?',
    answer:
      'We recommend booking an appointment to minimize waiting time and ensure your pet receives dedicated attention. Walk-ins are accepted based on availability, but appointment holders are prioritized.',
    category: 'Appointments',
  },
  {
    id: 'faq-3',
    question: 'What should I bring for my pet\'s first visit?',
    answer:
      'Please bring any previous medical records, vaccination certificates, and a list of current medications or supplements. If your pet is on a special diet, noting the brand and type is helpful for our veterinarians.',
    category: 'General',
  },
  {
    id: 'faq-4',
    question: 'What vaccinations does my pet need?',
    answer:
      'Vaccination requirements depend on your pet\'s species, age, lifestyle, and health history. Our veterinarians will create a personalized vaccination schedule during your first consultation.',
    category: 'Vaccinations',
  },
  {
    id: 'faq-5',
    question: 'How do I handle a pet emergency after hours?',
    answer:
      'Call our 24/7 emergency helpline immediately. Our emergency team will provide guidance over the phone and arrange urgent clinic access if needed. Do not wait for regular hours if your pet shows signs of distress.',
    category: 'Emergency',
  },
  {
    id: 'faq-6',
    question: 'Do you offer grooming services for all breeds?',
    answer:
      'Yes, our grooming team is trained to handle all breeds and sizes of dogs and cats. Each grooming session includes a basic health check and uses gentle, pet-safe products.',
    category: 'Grooming',
  },
  {
    id: 'faq-7',
    question: 'Can I purchase pet food and supplies at the clinic?',
    answer:
      'Absolutely. Our clinic shop stocks vet-recommended pet food, supplements, hygiene products, and accessories. Our team can help you choose products that align with your pet\'s care plan.',
    category: 'Shop',
  },
  {
    id: 'faq-8',
    question: 'What payment methods do you accept?',
    answer:
      'We accept cash, all major credit and debit cards, UPI payments, and digital wallets. Payment details are provided at the reception before or after your visit.',
    category: 'General',
  },
  {
    id: 'faq-9',
    question: 'How often should I bring my pet for a checkup?',
    answer:
      'We recommend annual wellness checkups for adult pets and more frequent visits for puppies, kittens, senior pets, or animals with chronic conditions. Your veterinarian will suggest an appropriate schedule.',
    category: 'General',
  },
  {
    id: 'faq-10',
    question: 'Do you provide dental care for pets?',
    answer:
      'Yes, we offer professional dental cleaning, oral examinations, and dental procedures. Regular dental care prevents serious health issues. We also provide guidance on home dental care routines.',
    category: 'Services',
  },
];

export function getFaqsByCategory(category: string): FaqItem[] {
  return faqs.filter((f) => f.category === category);
}

export function getFaqCategories(): string[] {
  return Array.from(new Set(faqs.map((f) => f.category)));
}
