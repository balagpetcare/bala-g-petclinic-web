import { CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FormState } from '@/types';

interface FormStatusMessageProps {
  state: FormState;
  className?: string;
}

export function FormStatusMessage({ state, className }: FormStatusMessageProps) {
  if (state.status === 'idle' || state.status === 'submitting' || !state.message) {
    return null;
  }

  const isSuccess = state.status === 'success';

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4',
        isSuccess
          ? 'border-success-500/30 bg-success-50 text-success-600 dark:bg-success-500/10'
          : 'border-error-500/30 bg-error-50 text-error-600 dark:bg-error-500/10',
        className
      )}
      role="alert"
    >
      {isSuccess ? (
        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      ) : (
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      )}
      <p className="text-sm font-medium">{state.message}</p>
    </div>
  );
}
