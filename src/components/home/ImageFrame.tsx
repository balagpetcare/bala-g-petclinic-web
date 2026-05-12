import Image from 'next/image';
import { PawPrint } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageFrameProps {
  alt: string;
  src?: string;
  className?: string;
  priority?: boolean;
  label?: string;
}

export function ImageFrame({
  alt,
  src,
  className,
  priority = false,
  label,
}: ImageFrameProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary-100 via-white to-secondary-100',
        'shadow-soft-lg ring-1 ring-neutral-100',
        'dark:from-primary-950 dark:via-neutral-900 dark:to-secondary-950 dark:ring-neutral-800',
        className
      )}
    >
      {src ? (
        <Image
          fill
          priority={priority}
          sizes="(min-width: 1024px) 50vw, 100vw"
          src={src}
          alt={alt}
          className="object-cover"
        />
      ) : (
        <div aria-label={alt} className="flex h-full min-h-[260px] items-center justify-center p-8">
          <div className="relative">
            <div className="absolute -inset-12 rounded-full bg-primary-300/30 blur-3xl" />
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-white/80 text-primary-600 shadow-soft dark:bg-neutral-900/80 dark:text-primary-400">
              <PawPrint className="h-16 w-16" aria-hidden="true" />
            </div>
          </div>
        </div>
      )}
      {label && (
        <div className="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-neutral-900 shadow-soft backdrop-blur dark:bg-neutral-900/90 dark:text-white">
          {label}
        </div>
      )}
    </div>
  );
}
