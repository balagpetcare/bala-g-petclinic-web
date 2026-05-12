'use client';

import { FormEvent, useState } from 'react';
import { Mail } from 'lucide-react';
import { Container, Input } from '@/components/ui';
import { MotionReveal } from '@/components/motion';
import { isValidEmail } from '@/lib/utils';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidEmail(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    setMessage('Thanks. Newsletter integration will connect to the CMS/API layer.');
    setEmail('');
  };

  return (
    <section className="bg-neutral-950 py-16 text-white sm:py-20">
      <Container>
        <MotionReveal>
          <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8 lg:grid-cols-[0.85fr_1fr] lg:items-center lg:p-10">
            <div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500 text-white">
                <Mail className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="mt-5 font-heading text-3xl font-bold">
                Join the pet care newsletter
              </h2>
              <p className="mt-3 max-w-xl text-neutral-300">
                Get clinic updates, pet wellness reminders, product launches,
                and seasonal care guidance.
              </p>
            </div>

            <form className="space-y-3" noValidate onSubmit={handleSubmit}>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <Input
                  className="border-white/20 bg-white text-neutral-950"
                  label="Email address"
                  name="newsletter-email"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <button
                  className="self-end rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
                  type="submit"
                >
                  Subscribe
                </button>
              </div>
              {message && (
                <p className="text-sm text-primary-100" role="status">
                  {message}
                </p>
              )}
            </form>
          </div>
        </MotionReveal>
      </Container>
    </section>
  );
}
