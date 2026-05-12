import { fetchPublicReviews } from '@/services/public-data';
import { StarRatingDisplay } from './StarRatingDisplay';
import { ReviewForm } from './ReviewForm';
import { Card } from '@/components/ui';

export interface PublicReviewSectionProps {
  targetType: 'DOCTOR' | 'BRANCH';
  targetId: string;
}

export async function PublicReviewSection({ targetType, targetId }: PublicReviewSectionProps) {
  const data = await fetchPublicReviews({ targetType, targetId, page: 1, limit: 20 });
  const reviews = data?.reviews ?? [];
  const avg = data?.averageRating ?? 0;
  const count = data?.reviewCount ?? 0;

  return (
    <section aria-labelledby="reviews-heading" className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl font-bold text-neutral-950 dark:text-white" id="reviews-heading">
          Reviews
        </h2>
        {count > 0 ? (
          <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <StarRatingDisplay rating={avg} />
            <span>
              {avg.toFixed(1)} average · {count} verified published {count === 1 ? 'review' : 'reviews'}
            </span>
          </p>
        ) : (
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            No published reviews yet — be the first to share feedback.
          </p>
        )}
      </div>

      {reviews.length > 0 && (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r.id}>
              <Card padding="md">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-neutral-950 dark:text-white">{r.author}</p>
                  <StarRatingDisplay rating={r.rating} />
                </div>
                {r.title && <p className="mt-1 text-sm font-semibold text-neutral-800 dark:text-neutral-200">{r.title}</p>}
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{r.body}</p>
                <p className="mt-2 text-xs text-neutral-400">
                  {new Date(r.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Card padding="lg">
        <ReviewForm targetId={targetId} targetType={targetType} />
      </Card>
    </section>
  );
}
