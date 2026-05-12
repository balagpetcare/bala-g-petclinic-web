import { Container } from '@/components/ui';
import { MotionReveal } from '@/components/motion';
import type { HomeIcon } from '@/data/homepage';

interface TrustFeature {
  title: string;
  description: string;
  icon: HomeIcon;
}

interface TrustFeatureStripProps {
  features: TrustFeature[];
}

export function TrustFeatureStrip({ features }: TrustFeatureStripProps) {
  return (
    <section className="bg-primary-50 py-12 dark:bg-primary-950/30">
      <Container>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <MotionReveal key={feature.title} delay={index * 0.08}>
                <article className="flex gap-4 rounded-2xl bg-white p-5 shadow-soft dark:bg-neutral-900">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-white">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-neutral-950 dark:text-white">
                      {feature.title}
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                      {feature.description}
                    </p>
                  </div>
                </article>
              </MotionReveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
