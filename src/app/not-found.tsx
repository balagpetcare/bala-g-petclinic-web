import Link from 'next/link';
import { Home } from 'lucide-react';
import { Container, Section, Heading, Text } from '@/components/ui';
import { Header, Footer } from '@/components/layout';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-[60vh] items-center">
        <Section background="gradient" padding="lg">
          <Container>
            <div className="text-center">
              <p className="text-7xl font-bold text-primary-600 sm:text-9xl">
                404
              </p>
              <Heading className="mt-6" level="h1">
                Page Not Found
              </Heading>
              <Text className="mx-auto mt-4 max-w-md" color="muted" size="lg">
                Sorry, we couldn&apos;t find the page you&apos;re looking for.
                It might have been moved or doesn&apos;t exist.
              </Text>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
      </main>
      <Footer />
    </>
  );
}
