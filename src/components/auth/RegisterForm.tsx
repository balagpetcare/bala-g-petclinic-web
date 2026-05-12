'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthShell } from '@/components/auth/AuthShell';
import { registerFormSchema } from '@/lib/auth/schemas';
import { useAuth } from '@/hooks/use-auth';

export function RegisterForm() {
  const router = useRouter();
  const { registerAccount, isBusy } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const parsed = registerFormSchema.safeParse({
      firstName,
      lastName,
      email,
      phone: phone.trim() || undefined,
      password,
      confirmPassword,
    });
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        ...(flat.firstName?.[0] ? { firstName: flat.firstName[0] } : {}),
        ...(flat.lastName?.[0] ? { lastName: flat.lastName[0] } : {}),
        ...(flat.email?.[0] ? { email: flat.email[0] } : {}),
        ...(flat.phone?.[0] ? { phone: flat.phone[0] } : {}),
        ...(flat.password?.[0] ? { password: flat.password[0] } : {}),
        ...(flat.confirmPassword?.[0] ? { confirmPassword: flat.confirmPassword[0] } : {}),
      });
      return;
    }

    const result = await registerAccount({
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      password: parsed.data.password,
      ...(parsed.data.phone && parsed.data.phone.trim()
        ? { phone: parsed.data.phone.trim() }
        : {}),
    });
    if (!result.ok) {
      setFormError(result.message);
      return;
    }
    router.replace('/account');
  }

  return (
    <AuthShell
      subtitle="Create a patient portal account for appointments, shop orders, and updates."
      title="Create account"
    >
      <form className="space-y-4" noValidate onSubmit={onSubmit}>
        {formError ? (
          <p className="rounded-lg border border-error-200 bg-error-50 px-3 py-2 text-sm text-error-700 dark:border-error-900/50 dark:bg-error-950/40 dark:text-error-200" role="alert">
            {formError}
          </p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            autoComplete="given-name"
            error={fieldErrors['firstName']}
            label="First name"
            name="firstName"
            onChange={(ev) => setFirstName(ev.target.value)}
            required
            value={firstName}
          />
          <Input
            autoComplete="family-name"
            error={fieldErrors['lastName']}
            label="Last name"
            name="lastName"
            onChange={(ev) => setLastName(ev.target.value)}
            required
            value={lastName}
          />
        </div>

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
          autoComplete="tel"
          error={fieldErrors['phone']}
          hint="Optional — we may use this for appointment reminders."
          label="Phone"
          name="phone"
          onChange={(ev) => setPhone(ev.target.value)}
          type="tel"
          value={phone}
        />

        <Input
          autoComplete="new-password"
          error={fieldErrors['password']}
          hint="8+ characters, one uppercase letter, one number."
          label="Password"
          name="password"
          onChange={(ev) => setPassword(ev.target.value)}
          required
          type="password"
          value={password}
        />

        <Input
          autoComplete="new-password"
          error={fieldErrors['confirmPassword']}
          label="Confirm password"
          name="confirmPassword"
          onChange={(ev) => setConfirmPassword(ev.target.value)}
          required
          type="password"
          value={confirmPassword}
        />

        <Button className="w-full" isLoading={isBusy} size="lg" type="submit">
          Register
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
        Already have an account?{' '}
        <Link className="font-medium text-primary-600 hover:underline dark:text-primary-400" href="/login">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
