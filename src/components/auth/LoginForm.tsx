'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthShell } from '@/components/auth/AuthShell';
import { loginFormSchema } from '@/lib/auth/schemas';
import { useAuth } from '@/hooks/use-auth';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isInitialized, loginWithPassword, isBusy } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const callbackUrl = searchParams.get('callbackUrl') || '/account';

  useEffect(() => {
    if (!isInitialized || !user) return;
    router.replace(callbackUrl.startsWith('/') ? callbackUrl : '/account');
  }, [isInitialized, user, router, callbackUrl]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const parsed = loginFormSchema.safeParse({ email, password });
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        ...(flat.email?.[0] ? { email: flat.email[0] } : {}),
        ...(flat.password?.[0] ? { password: flat.password[0] } : {}),
      });
      return;
    }

    const result = await loginWithPassword(parsed.data.email, parsed.data.password);
    if (!result.ok) {
      setFormError(result.message);
      return;
    }
    router.replace(callbackUrl.startsWith('/') ? callbackUrl : '/account');
  }

  return (
    <AuthShell
      subtitle="Welcome back — manage appointments, orders, and your pet profile."
      title="Sign in"
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

        <Input
          autoComplete="current-password"
          error={fieldErrors['password']}
          label="Password"
          name="password"
          onChange={(ev) => setPassword(ev.target.value)}
          required
          type="password"
          value={password}
        />

        <div className="flex items-center justify-between text-sm">
          <Link className="text-primary-600 hover:underline dark:text-primary-400" href="/forgot-password">
            Forgot password?
          </Link>
        </div>

        <Button className="w-full" isLoading={isBusy} size="lg" type="submit">
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
        New to the clinic?{' '}
        <Link className="font-medium text-primary-600 hover:underline dark:text-primary-400" href="/register">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
