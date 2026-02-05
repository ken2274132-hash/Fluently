'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, CheckCircle, Trash2 } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export default function ClearCookiesPage() {
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    // Clear all cookies for this domain
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();

      // Delete the cookie by setting it to expire in the past
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
    }

    // Clear localStorage and sessionStorage too
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // Ignore errors
    }

    setCleared(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-white dark:bg-[#09090b]">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.15), transparent),
            radial-gradient(ellipse 60% 40% at 100% 0%, rgba(139, 92, 246, 0.1), transparent)
          `
        }}
      />

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-semibold text-zinc-900 dark:text-white">{SITE_CONFIG.name}</span>
        </Link>

        <div className="rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 backdrop-blur-xl p-8 shadow-sm text-center">
          {cleared ? (
            <>
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-emerald-500" />
              </div>
              <h1 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">Cookies Cleared!</h1>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6">
                All cookies and cached data have been cleared. You can now continue using the app.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
              >
                Go to Home
              </Link>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} className="text-indigo-500 animate-pulse" />
              </div>
              <h1 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">Clearing Cookies...</h1>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                Please wait while we clear your browser data.
              </p>
            </>
          )}
        </div>

        <p className="text-center text-xs text-zinc-500 mt-6">
          If you keep seeing &quot;HTTP ERROR 431&quot;, visit this page to fix it.
        </p>
      </div>
    </div>
  );
}
