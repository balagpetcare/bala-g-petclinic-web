import Link from 'next/link';
import { Ambulance, ArrowRight, Phone } from 'lucide-react';
import { Container } from '@/components/ui';
import { MotionReveal } from '@/components/motion';
import { emergencyContact } from '@/config';

export function EmergencyCta() {
  return (
    <section className="bg-neutral-950 py-14 text-white sm:py-16">
      <Container>
        <MotionReveal>
          <div className="grid gap-8 rounded-[2rem] bg-gradient-to-r from-primary-700 to-primary-600 p-6 shadow-soft-lg sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <Ambulance className="h-8 w-8" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-100">
                  Emergency CTA
                </p>
                <h2 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">
                  Need urgent pet care guidance?
                </h2>
                <p className="mt-3 max-w-2xl text-primary-50">
                  Call the clinic for immediate direction. This area is structured
                  for future integration with triage, appointments, and emergency
                  case intake.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-secondary-500 px-6 text-base font-medium text-white transition-colors hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-secondary-300"
                href={`tel:${emergencyContact.phone}`}
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {emergencyContact.phone}
              </a>
              <Link
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border-2 border-white/70 px-6 text-base font-medium text-white transition-colors hover:bg-white hover:text-primary-700"
                href="/services/emergency"
              >
                Emergency details
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </MotionReveal>
      </Container>
    </section>
  );
}
