'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { Container, Section, Heading, Text, Button } from '@/components/ui';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PublicError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <Section background="gradient" padding="lg">
      <Container>
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error-50">
            <AlertTriangle className="h-8 w-8 text-error-500" />
          </div>
          <Heading className="mt-6" level="h2">
            Oops! Something went wrong
          </Heading>
          <Text className="mx-auto mt-4 max-w-md" color="muted">
            We encountered an error while loading this page. Please try again.
          </Text>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              leftIcon={<RefreshCw className="h-4 w-4" />}
              variant="outline"
              onClick={reset}
            >
              Try Again
            </Button>
            <Link
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              href="/"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              Back to Home
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
