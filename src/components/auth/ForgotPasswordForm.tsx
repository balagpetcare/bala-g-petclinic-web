'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthShell } from '@/components/auth/AuthShell';
import { forgotPasswordFormSchema } from '@/lib/auth/schemas';
import * as authApi from '@/services/auth.service';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const parsed = forgotPasswordFormSchema.safeParse({ email });
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        ...(flat.email?.[0] ? { email: flat.email[0] } : {}),
      });
      return;
    }

    setBusy(true);
    try {
      const res = await authApi.forgotPassword(parsed.data);
      if (!res.success) {
        setFormError(res.error?.message ?? 'Request failed');
        return;
      }
      setDone(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <AuthShell
        subtitle="If an account exists for that email, you will receive reset instructions shortly."
        title="Check your inbox"
      >
        <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
          For security, we always show this message — even when the email is not registered.
        </p>
        <div className="mt-6 text-center">
          <Link className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-400" href="/login">
            Back to sign in
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      subtitle="We will email you a secure link to reset your password."
      title="Forgot password"
    >
      <form className="space-y-4" noValidate onSubmit={onSubmit}>
        {formError ? (
          <p className="rounded-lg border border-error-200 bg-error-50 px-3 py-2 text-sm text-error-700 dark:border-error-900/50 dark:bg-error-950/40 dark:text-error-200" role="alert">
            {formError}
          </p>
        ) : null}

        <Input
          autoComplete="email"
          error={fieldErrors['email']}
          label="Email"
          name="email"
          onChange={(ev) => setEmail(ev.target.value)}
          required
          type="email"
          value={email}
        />

        <Button className="w-full" isLoading={busy} size="lg" type="submit">
          Send reset link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
        <Link className="font-medium text-primary-600 hover:underline dark:text-primary-400" href="/login">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
