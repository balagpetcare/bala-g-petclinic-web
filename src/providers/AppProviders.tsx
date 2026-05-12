'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { AuthProvider } from './AuthProvider';
import { EcommerceProvider } from './EcommerceProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider defaultTheme="system">
      <AuthProvider>
        <EcommerceProvider>{children}</EcommerceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
