import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, hint, leftAddon, rightAddon, id, ...props },
    ref
  ) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            htmlFor={inputId}
          >
            {label}
            {props.required && (
              <span className="ml-1 text-error-500">*</span>
            )}
          </label>
        )}
        <div className="relative">
          {leftAddon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
              {leftAddon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'input-base',
              leftAddon && 'pl-10',
              rightAddon && 'pr-10',
              error &&
                'border-error-500 focus:border-error-500 focus:ring-error-500/20',
              className
            )}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />
          {rightAddon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400">
              {rightAddon}
            </div>
          )}
        </div>
        {error && (
          <p
            className="mt-1.5 text-sm text-error-500"
            id={`${inputId}-error`}
            role="alert"
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p
            className="mt-1.5 text-sm text-neutral-500"
            id={`${inputId}-hint`}
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
