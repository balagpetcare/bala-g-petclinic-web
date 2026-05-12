'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/use-auth';
import { isAdminPortalRole, canAccessAnalyticsUi } from '@/lib/auth/constants';
import { canUseCmsUi } from '@/lib/cms/access';

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const portal = isAdminPortalRole(user.role);
  const cms = canUseCmsUi(user.role);
  const analyticsUi = canAccessAnalyticsUi(user.role);

  if (!portal && !cms && !analyticsUi) {
    return (
      <section className="py-14">
        <Container className="max-w-xl text-center">
          <Heading as="h1" className="mb-3" level="h3">
            Clinic admin area
          </Heading>
          <Text className="mb-6 text-neutral-600 dark:text-neutral-400">
            Your account does not include staff admin or CMS access. Patient features remain available from your account
            page.
          </Text>
          <Button onClick={() => router.push('/account')} type="button" variant="primary">
            Go to my account
          </Button>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <Heading as="h1" className="mb-2" level="h2">
          {portal ? 'Clinic operations' : cms ? 'Website content' : 'Analytics & tools'}
        </Heading>
        <Text className="mb-8 max-w-2xl text-neutral-600 dark:text-neutral-400">
          {portal
            ? `Operational hub for inventory, scheduling, and billing integrations. Your role: ${user.role}.`
            : cms
              ? `Manage marketing content for the public website. Your role: ${user.role}.`
              : `View clinic analytics for your assigned permissions. Your role: ${user.role}.`}
        </Text>

        {analyticsUi ? (
          <div className="mb-8">
            <Link
              className="inline-flex h-11 items-center justify-center rounded-lg border border-primary-600 bg-white px-6 text-sm font-medium text-primary-700 hover:bg-primary-50 dark:border-primary-500 dark:bg-neutral-950 dark:text-primary-300 dark:hover:bg-primary-950/40"
              href="/admin/analytics"
            >
              Open analytics dashboards
            </Link>
          </div>
        ) : null}
        {cms ? (
          <div className="mb-8">
            <Link
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary-600 px-6 text-sm font-medium text-white hover:bg-primary-700"
              href="/admin/cms"
            >
              Open website CMS
            </Link>
          </div>
        ) : null}

        {portal ? (
          <div className="rounded-2xl border border-dashed border-primary-300 bg-primary-50/50 p-8 dark:border-primary-800 dark:bg-primary-950/30">
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              Admin UI will connect to the same{' '}
              <code className="rounded bg-white/80 px-1 py-0.5 text-xs dark:bg-neutral-900">backendFetch</code> layer and
              RBAC-aware endpoints. No mock data here.
            </p>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
