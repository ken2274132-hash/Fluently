'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, CheckCircle, Trash2, Loader2 } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export default function ClearCookiesPage() {
  const [status, setStatus] = useState<'clearing' | 'cleared' | 'error'>('clearing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function clearAllData() {
      try {
        // 1. Clear all cookies for this domain
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqPos = cookie.indexOf('=');
          const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();

          // Try multiple paths and domains
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=localhost`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.localhost`;
        }

        // 2. Clear localStorage and sessionStorage
        try {
          localStorage.clear();
          sessionStorage.clear();
        } catch {
          // Ignore errors
        }

        // 3. Try to clear avatar from server (may fail if not logged in, that's OK)
        try {
          await fetch('/api/clear-avatar', { method: 'POST' });
        } catch {
          // Ignore - user might not be logged in
        }

        // 4. Clear IndexedDB if available
        try {
          const databases = await window.indexedDB.databases();
          for (const db of databases) {
            if (db.name) {
              window.indexedDB.deleteDatabase(db.name);
            }
          }
        } catch {
          // Ignore
        }

        setStatus('cleared');
        setMessage('All data cleared successfully!');
      } catch (error) {
        console.error('Error clearing data:', error);
        setStatus('error');
        setMessage('Some data could not be cleared. Please try manually clearing your browser data.');
      }
    }

    clearAllData();
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
          {status === 'clearing' && (
            <>
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
                <Loader2 size={32} className="text-indigo-500 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">Clearing Data...</h1>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                Please wait while we clear all cached data.
              </p>
            </>
          )}

          {status === 'cleared' && (
            <>
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-emerald-500" />
              </div>
              <h1 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">Data Cleared!</h1>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6">
                {message}
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
              >
                Go to Login
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} className="text-amber-500" />
              </div>
              <h1 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">Partial Clear</h1>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6">
                {message}
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
              >
                Try Again
              </Link>
            </>
          )}
        </div>

        <div className="mt-6 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 text-sm text-zinc-600 dark:text-zinc-400">
          <p className="font-medium mb-2">If error persists, manually clear in Chrome:</p>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>Press F12 to open DevTools</li>
            <li>Go to Application tab</li>
            <li>Click &quot;Clear site data&quot; in Storage section</li>
            <li>Refresh the page</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
