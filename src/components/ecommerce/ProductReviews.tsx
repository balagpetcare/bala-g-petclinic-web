import { Star } from 'lucide-react';
import type { ProductReview } from '@/types';
import { formatDate } from '@/lib/utils';

interface ProductReviewsProps {
  reviews: ProductReview[];
}

export function ProductReviews({ reviews }: ProductReviewsProps) {
  if (reviews.length === 0) {
    return <p className="text-sm text-neutral-500">No reviews yet.</p>;
  }

  return (
    <div className="space-y-5">
      {reviews.map((review) => (
        <article
          key={review.id}
          className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800"
        >
          <div className="mb-2 flex items-center justify-between gap-3">
            <h3 className="font-medium text-neutral-900 dark:text-white">{review.title}</h3>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-4 w-4 fill-current" aria-hidden="true" />
              <span className="text-sm font-medium">{review.rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{review.comment}</p>
          <p className="mt-2 text-xs text-neutral-400">
            {review.author} • {formatDate(review.createdAt)}
          </p>
        </article>
      ))}
    </div>
  );
}
