const MAPS_EMBED = 'https://www.google.com/maps/embed/v1/place';

export interface BranchMapEmbedProps {
  /** Human-readable address for the map query */
  address: string;
  title?: string;
}

/**
 * Lazy-friendly iframe embed when `NEXT_PUBLIC_GOOGLE_MAPS_KEY` is set.
 * Without a key, renders a subtle fallback link to Google Maps search.
 */
export function BranchMapEmbed({ address, title = 'Clinic location map' }: BranchMapEmbedProps) {
  const key = process.env['NEXT_PUBLIC_GOOGLE_MAPS_KEY']?.trim();
  const q = encodeURIComponent(address);

  if (!key) {
    return (
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        <a
          className="font-medium text-primary-600 underline-offset-4 hover:underline"
          href={`https://www.google.com/maps/search/?api=1&query=${q}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          Open directions in Google Maps
        </a>
      </p>
    );
  }

  const src = `${MAPS_EMBED}?key=${encodeURIComponent(key)}&q=${q}&zoom=15`;

  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
      <iframe
        className="h-full w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={src}
        title={title}
      />
    </div>
  );
}
