import { Spinner } from '@/components/ui';

export default function PublicLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
          Loading...
        </p>
      </div>
    </div>
  );
}
