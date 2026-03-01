'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debug, setDebug] = useState('');

  // Check if Supabase is configured
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      setDebug('Fehlende Supabase Konfiguration. Bitte Admin kontaktieren.');
      console.error('Missing Supabase env vars:', { url: !!url, key: !!key });
    }
  }, []);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setDebug('');
    setLoading(true);

    try {
      console.log('Attempting login with:', email);
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Login result:', { data: !!data, error: signInError });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (!data.session) {
        setError('Keine Session erstellt. Bitte erneut versuchen.');
        setLoading(false);
        return;
      }

      // Success - redirect
      console.log('Login successful, redirecting...');
      
      // Hard redirect to ensure cookies are set
      window.location.href = '/';
      
      // Fallback: try router navigation
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 100);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.message || 'Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
            🔥
          </div>
          <h1 className="text-2xl font-bold">Sammlung Manager</h1>
          <p className="mt-2 text-sm text-muted-foreground">Melde dich an, um deine Sammlung zu verwalten</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {(error || debug) && (
            <div className={`rounded-md p-3 text-sm ${debug ? 'bg-yellow-100 text-yellow-800' : 'bg-destructive/10 text-destructive'}`}>
              {error || debug}
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              E-Mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              required
              autoFocus
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Passwort
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Anmeldung läuft...' : 'Anmelden'}
          </button>
        </form>
      </div>
    </div>
  );
}
