'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Text } from '@/components/ui/Text';
import { useAuth } from '@/hooks/use-auth';
import { canUseCmsUi } from '@/lib/cms/access';

const LINKS = [
  { href: '/admin/cms', label: 'Overview' },
  { href: '/admin/cms/blogs', label: 'Blogs' },
  { href: '/admin/cms/pages', label: 'Pages' },
  { href: '/admin/cms/banners', label: 'Banners' },
  { href: '/admin/cms/media', label: 'Media' },
  { href: '/admin/cms/seo', label: 'SEO guide' },
] as const;

export function CmsAdminShell({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useAuth();
  const pathname = usePathname();

  if (!isInitialized) {
    return (
      <Container className="py-16">
        <Text color="muted">Loading session…</Text>
      </Container>
    );
  }

  if (!user || !canUseCmsUi(user.role)) {
    return (
      <Container className="max-w-lg py-16">
        <Text className="text-center" color="muted">
          Your account does not include CMS tools. If you believe this is a mistake, ask a clinic administrator to grant
          CMS permissions on the API.
        </Text>
      </Container>
    );
  }

  return (
    <>
      <div className="border-b border-neutral-200 bg-neutral-50 py-4 dark:border-neutral-800 dark:bg-neutral-900/40">
        <Container className="flex flex-wrap items-center gap-3">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  active
                    ? 'bg-primary-600 text-white'
                    : 'text-neutral-700 hover:bg-neutral-200/80 dark:text-neutral-200 dark:hover:bg-neutral-800'
                }`}
                href={l.href}
                key={l.href}
              >
                {l.label}
              </Link>
            );
          })}
        </Container>
      </div>
      {children}
    </>
  );
}
