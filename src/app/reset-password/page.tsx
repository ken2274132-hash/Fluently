'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Lock, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isReady, setIsReady] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    // Exchange the code for a session
    const handleCodeExchange = async () => {
      const code = searchParams.get('code');

      // Add timeout to prevent infinite loading
      timeoutId = setTimeout(() => {
        if (isMounted) {
          setError('Verification timed out. Please request a new reset link.');
        }
      }, 10000); // 10 second timeout

      if (code) {
        try {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (!isMounted) return;
          clearTimeout(timeoutId);

          if (exchangeError) {
            console.error('Code exchange error:', exchangeError);
            setError('Invalid or expired reset link. Please request a new one.');
          } else if (data?.session) {
            setIsReady(true);
          } else {
            setError('Could not verify reset link. Please try again.');
          }
        } catch (err) {
          if (!isMounted) return;
          clearTimeout(timeoutId);
          console.error('Code exchange exception:', err);
          setError('Failed to verify reset link. Please try again.');
        }
      } else {
        // No code, check if we have an existing session from hash fragment
        clearTimeout(timeoutId);
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
          if (session) {
            setIsReady(true);
          } else {
            setError('Invalid or expired reset link. Please request a new one.');
          }
        }
      }
    };

    handleCodeExchange();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [supabase, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message);
      } else {
        setIsSuccess(true);
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 backdrop-blur-xl p-8 shadow-sm">
      {isSuccess ? (
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">Password updated!</h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6">
            Your password has been successfully reset. Redirecting to dashboard...
          </p>
        </div>
      ) : !isReady && !error ? (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-4" />
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">Verifying reset link...</p>
        </div>
      ) : error && !isReady ? (
        <div className="text-center">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-sm mb-6">
            {error}
          </div>
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
          >
            Request new link
          </Link>
        </div>
      ) : (
        <>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">Set new password</h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">Enter your new password below.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 text-zinc-900 dark:text-white placeholder-zinc-500 focus:border-indigo-500/50 focus:outline-none transition-colors"
                  placeholder="Enter new password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 text-zinc-900 dark:text-white placeholder-zinc-500 focus:border-indigo-500/50 focus:outline-none transition-colors"
                  placeholder="Confirm new password"
                  required
                  minLength={6}
                />
              </div>
              <p className="text-xs text-zinc-500 mt-1">Must be at least 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Reset Password</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Back to login
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 backdrop-blur-xl p-8 shadow-sm">
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-4" />
        <p className="text-zinc-600 dark:text-zinc-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-white dark:bg-[#09090b]">
      {/* Background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.15), transparent),
            radial-gradient(ellipse 60% 40% at 100% 0%, rgba(139, 92, 246, 0.1), transparent)
          `
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-semibold text-zinc-900 dark:text-white">{SITE_CONFIG.name}</span>
        </Link>

        {/* Card with Suspense */}
        <Suspense fallback={<LoadingCard />}>
          <ResetPasswordForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
