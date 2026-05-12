import type { Metadata } from 'next';
import { CmsAdminShell } from './_components/CmsAdminShell';

export const metadata: Metadata = {
  title: 'CMS',
  robots: { index: false, follow: false },
};

export default function CmsAdminLayout({ children }: { children: React.ReactNode }) {
  return <CmsAdminShell>{children}</CmsAdminShell>;
}
