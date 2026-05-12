import type { Metadata } from 'next';
import Link from 'next/link';
import { Heart, ShieldCheck, Users, PawPrint, ArrowRight } from 'lucide-react';
import { Container, Section, Card } from '@/components/ui';
import { PageHeader } from '@/components/shared';
import { generatePageMetadata } from '@/config/seo';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = generatePageMetadata({
  title: 'About Us',
  description:
    `Learn about ${siteConfig.name} — our mission, values, team, and commitment to providing comprehensive veterinary care and pet wellness services.`,
  keywords: ['about', 'pet clinic', 'veterinary', 'mission', 'team'],
});

const values = [
  {
    icon: Heart,
    title: 'Compassionate care',
    description:
      'Every pet is treated with patience, gentleness, and genuine concern for their wellbeing and comfort.',
  },
  {
    icon: ShieldCheck,
    title: 'Medical excellence',
    description:
      'Evidence-based veterinary medicine guided by qualified professionals and continuous learning.',
  },
  {
    icon: Users,
    title: 'Pet-parent partnership',
    description:
      'Clear communication and education so pet parents can make informed decisions about their companion\'s health.',
  },
  {
    icon: PawPrint,
    title: 'Holistic approach',
    description:
      'Integrating healthcare, nutrition, grooming, and wellness into a unified care journey for every pet.',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        description="A clinic built around the belief that every pet deserves expert care, clear communication, and a calm clinic experience."
        eyebrow="About our clinic"
        title={`About ${siteConfig.name}`}
      />

      <Section padding="lg">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-heading text-2xl font-bold text-neutral-950 dark:text-white">
              Our story
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
              <p>
                {siteConfig.name} was founded with a simple vision: to create a pet care ecosystem
                where healthcare, nutrition, grooming, and products are connected under one
                trusted team. We believe that veterinary care should be accessible, understandable,
                and designed around the needs of both pets and their families.
              </p>
              <p>
                Our clinic combines qualified veterinary professionals with a carefully curated
                pet shop, offering everything from routine wellness checkups to emergency support
                and premium nutrition products — all guided by medical expertise.
              </p>
              <p>
                Whether you&apos;re visiting for a vaccination, seeking emergency guidance, or
                choosing the right food for your new puppy, our team is here to support every
                step of your pet&apos;s health journey.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section background="muted" padding="lg">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-heading text-2xl font-bold text-neutral-950 dark:text-white">
              Our values
            </h2>
            <p className="mt-3 text-neutral-600 dark:text-neutral-400">
              The principles that guide everything we do.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <Card key={v.title} padding="lg">
                  <Icon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                  <h3 className="mt-3 font-semibold text-neutral-950 dark:text-white">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {v.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section padding="md">
        <Container>
          <div className="flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
            <div>
              <h2 className="font-heading text-2xl font-bold text-neutral-950 dark:text-white">
                Ready to visit?
              </h2>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                Book an appointment or explore our services.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 text-base font-medium text-white transition-colors hover:bg-primary-700"
                href="/appointment"
              >
                Book Appointment
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                className="inline-flex h-11 items-center justify-center rounded-lg border border-neutral-300 px-6 text-base font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                href="/services"
              >
                View Services
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
