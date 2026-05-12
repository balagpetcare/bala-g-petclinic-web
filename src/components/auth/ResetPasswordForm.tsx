'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthShell } from '@/components/auth/AuthShell';
import { resetPasswordFormSchema } from '@/lib/auth/schemas';
import * as authApi from '@/services/auth.service';

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get('token') ?? '';

  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const parsed = resetPasswordFormSchema.safeParse({ token, newPassword, confirmPassword });
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        ...(flat.token?.[0] ? { token: flat.token[0] } : {}),
        ...(flat.newPassword?.[0] ? { newPassword: flat.newPassword[0] } : {}),
        ...(flat.confirmPassword?.[0] ? { confirmPassword: flat.confirmPassword[0] } : {}),
      });
      return;
    }

    setBusy(true);
    try {
      const res = await authApi.resetPassword({
        token: parsed.data.token,
        newPassword: parsed.data.newPassword,
      });
      if (!res.success) {
        setFormError(res.error?.message ?? 'Reset failed');
        return;
      }
      setDone(true);
      setTimeout(() => router.replace('/login'), 2000);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <AuthShell subtitle="You can now sign in with your new password." title="Password updated">
        <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">Redirecting to sign in…</p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      subtitle="Choose a strong password. You will be signed out of other devices."
      title="Set new password"
    >
      <form className="space-y-4" noValidate onSubmit={onSubmit}>
        {formError ? (
          <p className="rounded-lg border border-error-200 bg-error-50 px-3 py-2 text-sm text-error-700 dark:border-error-900/50 dark:bg-error-950/40 dark:text-error-200" role="alert">
            {formError}
          </p>
        ) : null}

        <Input
          error={fieldErrors['token']}
          hint="Paste the token from your reset email if it is not filled automatically."
          label="Reset token"
          name="token"
          onChange={(ev) => setToken(ev.target.value)}
          required
          value={token}
        />

        <Input
          autoComplete="new-password"
          error={fieldErrors['newPassword']}
          hint="8+ characters, one uppercase letter, one number."
          label="New password"
          name="newPassword"
          onChange={(ev) => setNewPassword(ev.target.value)}
          required
          type="password"
          value={newPassword}
        />

        <Input
          autoComplete="new-password"
          error={fieldErrors['confirmPassword']}
          label="Confirm new password"
          name="confirmPassword"
          onChange={(ev) => setConfirmPassword(ev.target.value)}
          required
          type="password"
          value={confirmPassword}
        />

        <Button className="w-full" isLoading={busy} size="lg" type="submit">
          Update password
        </Button>
      </form>

      <p className="mt-6 text-center text-sm">
        <Link className="font-medium text-primary-600 hover:underline dark:text-primary-400" href="/login">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
