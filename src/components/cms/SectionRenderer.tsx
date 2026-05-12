import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { CmsHeroSection, CmsHtmlSection } from './CmsContent';

export type CmsSection =
  | { type: 'hero'; title: string; subtitle?: string; imageUrl?: string; imageAlt?: string }
  | { type: 'richText'; html: string }
  | { type: 'cta'; label: string; href: string; variant?: 'primary' | 'secondary' };

function isSection(value: unknown): value is CmsSection {
  if (!value || typeof value !== 'object') return false;
  const t = (value as { type?: string }).type;
  return t === 'hero' || t === 'richText' || t === 'cta';
}

export function SectionRenderer({ sections }: { sections: unknown }) {
  if (!Array.isArray(sections)) return null;
  const blocks = sections.filter(isSection);

  return (
    <div className="space-y-0">
      {blocks.map((section, idx) => {
        if (section.type === 'hero') {
          return (
            <CmsHeroSection
              imageAlt={section.imageAlt}
              imageUrl={section.imageUrl}
              key={`hero-${idx}`}
              subtitle={section.subtitle}
              title={section.title}
            />
          );
        }
        if (section.type === 'richText') {
          return <CmsHtmlSection className="py-12" html={section.html} key={`rt-${idx}`} />;
        }
        if (section.type === 'cta') {
          const cls =
            section.variant === 'secondary'
              ? 'inline-flex h-11 items-center justify-center rounded-lg bg-secondary-500 px-6 text-sm font-medium text-white hover:bg-secondary-600'
              : 'inline-flex h-11 items-center justify-center rounded-lg bg-primary-600 px-6 text-sm font-medium text-white hover:bg-primary-700';
          return (
            <section className="py-12" key={`cta-${idx}`}>
              <Container className="flex justify-center">
                <Link className={cls} href={section.href}>
                  {section.label}
                </Link>
              </Container>
            </section>
          );
        }
        return null;
      })}
    </div>
  );
}
