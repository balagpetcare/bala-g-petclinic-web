'use client';

import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { AccountNotificationPanel } from '@/components/account/AccountNotificationPanel';
import { useAuth } from '@/hooks/use-auth';

export default function AccountPage() {
  const { user, logout, refreshUser, isBusy } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.replace('/login');
  }

  return (
    <section aria-labelledby="account-heading" className="py-10 sm:py-14">
      <Container className="max-w-3xl">
        <Heading as="h1" className="mb-2" id="account-heading" level="h2">
          My account
        </Heading>
        <Text className="mb-8 text-neutral-600 dark:text-neutral-400">
          Signed-in session and profile details from the clinic portal.
        </Text>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft dark:border-neutral-800 dark:bg-neutral-950">
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="font-medium text-neutral-500 dark:text-neutral-400">Name</dt>
              <dd className="mt-0.5 text-neutral-900 dark:text-white">
                {user?.firstName} {user?.lastName}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-neutral-500 dark:text-neutral-400">Email</dt>
              <dd className="mt-0.5 text-neutral-900 dark:text-white">{user?.email}</dd>
            </div>
            <div>
              <dt className="font-medium text-neutral-500 dark:text-neutral-400">Role</dt>
              <dd className="mt-0.5 font-mono text-xs text-neutral-800 dark:text-neutral-200">{user?.role}</dd>
            </div>
            <div>
              <dt className="font-medium text-neutral-500 dark:text-neutral-400">Email verified</dt>
              <dd className="mt-0.5 text-neutral-900 dark:text-white">{user?.emailVerified ? 'Yes' : 'No'}</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button disabled={isBusy} onClick={() => void refreshUser()} variant="outline">
              Refresh from server
            </Button>
            <Button disabled={isBusy} onClick={() => void handleLogout()} variant="destructive">
              Sign out
            </Button>
          </div>
        </div>

        {user ? <AccountNotificationPanel /> : null}
      </Container>
    </section>
  );
}
