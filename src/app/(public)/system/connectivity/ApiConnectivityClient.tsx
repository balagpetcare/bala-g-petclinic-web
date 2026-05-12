'use client';

import { useCallback, useState, type FormEvent } from 'react';
import { useApiHealth } from '@/hooks/useApiHealth';
import { login, fetchCurrentUser } from '@/services/auth.service';
import { Button, Input, Text } from '@/components/ui';

export function ApiConnectivityClient() {
  const { result, loading, reload } = useApiHealth();

  return (
    <div className="mt-10 space-y-10">
      <section aria-labelledby="browser-health-heading" className="space-y-3">
        <h2 id="browser-health-heading" className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Browser request (CORS + credentials)
        </h2>
        <Text className="text-sm text-neutral-600 dark:text-neutral-400">
          This call runs in the client so it exercises CORS, cookies (when enabled), and the same service layer as
          server code.
        </Text>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="outline" size="sm" onClick={() => void reload()} disabled={loading}>
            {loading ? 'Checking…' : 'Re-run browser health'}
          </Button>
        </div>
        <pre className="max-h-64 overflow-auto rounded-lg bg-neutral-100 p-4 text-xs dark:bg-neutral-900">
          {loading ? '…' : JSON.stringify(result, null, 2)}
        </pre>
      </section>

      <AuthIntegrationDemo onLoggedIn={reload} />
    </div>
  );
}

function AuthIntegrationDemo({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setBusy(true);
      setMessage(null);
      const res = await login({ email, password }, { retryOnUnauthorized: false });
      if (!res.success) {
        setMessage(res.error?.message ?? 'Login failed');
        setBusy(false);
        return;
      }
      const access = res.data?.tokens.accessToken;
      if (!access) {
        setMessage('Login succeeded but no access token was returned (check refresh-cookie mode on the API).');
        setPassword('');
        setBusy(false);
        return;
      }
      const me = await fetchCurrentUser(access);
      setMessage(
        me.success
          ? `Protected GET /auth/me OK — ${me.data?.email ?? me.data?.id}`
          : (me.error?.message ?? 'Protected request failed')
      );
      setPassword('');
      setBusy(false);
      void onLoggedIn();
    },
    [email, password, onLoggedIn]
  );

  return (
    <section aria-labelledby="auth-demo-heading" className="space-y-3">
      <h2 id="auth-demo-heading" className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        Auth smoke test (optional)
      </h2>
      <Text className="text-sm text-neutral-600 dark:text-neutral-400">
        Uses centralized `auth.service` → `http` → `backendFetch`. After login, performs a sample protected request
        with the returned access token (Bearer). Remove this section from public routes when the real auth UI ships.
      </Text>
      <form onSubmit={onSubmit} className="max-w-md space-y-3">
        <Input
          type="email"
          name="email"
          autoComplete="username"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={busy}>
          {busy ? 'Working…' : 'Login then call /auth/me'}
        </Button>
      </form>
      {message ? (
        <p className="text-sm text-neutral-800 dark:text-neutral-200" role="status">
          {message}
        </p>
      ) : null}
    </section>
  );
}
