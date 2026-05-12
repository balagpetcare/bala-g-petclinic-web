import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { RequireAuth } from '@/components/auth/RequireAuth';

export const metadata: Metadata = {
  title: 'My account',
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}
