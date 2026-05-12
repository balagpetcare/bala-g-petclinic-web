import type { Metadata } from 'next';
import { getHealth } from '@/services/health.service';
import { Container, Heading, Text } from '@/components/ui';
import type { BackendApiResponse } from '@/types/api';
import type { HealthPayload } from '@/types/health';
import { ApiConnectivityClient } from './ApiConnectivityClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'API connectivity',
  description: 'Developer connectivity check for the Bala G Pet Clinic public site and backend API.',
  robots: { index: false, follow: false },
};

export default async function ConnectivityPage() {
  let health: BackendApiResponse<HealthPayload>;
  try {
    health = await getHealth();
  } catch (err) {
    health = {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: err instanceof Error ? err.message : 'Unable to reach API during server render',
      },
    };
  }

  return (
    <main className="py-16">
      <Container>
        <Heading as="h1" level="h1" className="mb-2">
          API connectivity
        </Heading>
        <Text className="mb-8 max-w-2xl text-neutral-600 dark:text-neutral-400">
          This page is not indexed. It demonstrates server-side and browser-side calls through the shared services and
          `@/lib/api` client.
        </Text>

        <section aria-labelledby="server-health-heading" className="space-y-3">
          <h2 id="server-health-heading" className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Server-side health (`GET /health`)
          </h2>
          <pre className="max-h-64 overflow-auto rounded-lg bg-neutral-100 p-4 text-xs dark:bg-neutral-900">
            {JSON.stringify(health, null, 2)}
          </pre>
        </section>

        <ApiConnectivityClient />
      </Container>
    </main>
  );
}
