import { Container, Section, Skeleton } from '@/components/ui';

export default function BranchLocationLoading() {
  return (
    <Section padding="lg">
      <Container>
        <Skeleton className="h-10 w-2/3 max-w-md" />
        <Skeleton className="mt-4 h-5 w-full max-w-xl" />
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </Container>
    </Section>
  );
}
