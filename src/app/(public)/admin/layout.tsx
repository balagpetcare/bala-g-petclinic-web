import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { RequireAuth } from '@/components/auth/RequireAuth';

export const metadata: Metadata = {
  title: 'Clinic admin',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}
