'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Sparkles,
  LayoutDashboard,
  Mic,
  Settings,
  User,
  LogOut,
  Crown,
  ChevronRight,
  Shield,
  BarChart3,
  Users,
  Search,
  Command,
  Sun,
  Moon,
  Activity
} from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';
import { useTheme } from '@/components/providers/ThemeProvider';
import { usePresenceTracking } from '@/hooks/usePresenceTracking';

const sidebarLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/voice', label: 'Practice', icon: Mic },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const adminLinks = [
  { href: '/admin', label: 'Admin Panel', icon: Shield },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/live', label: 'Live Users', icon: Activity },
];

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  subscription_tier: 'free' | 'pro' | 'team';
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const { resolvedTheme, setTheme } = useTheme();

  // Track user presence for admin live dashboard
  usePresenceTracking();

  useEffect(() => {
    async function getUser() {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profile) {
        setUser(profile as UserProfile);
      } else {
        // Create profile if it doesn't exist
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          full_name: authUser.user_metadata?.full_name || null,
          avatar_url: authUser.user_metadata?.avatar_url || null,
          role: 'user',
          subscription_tier: 'free'
        });
      }
      setLoading(false);
    }

    getUser();
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="text-zinc-500 dark:text-zinc-500 text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';

  return (
    <div className="h-screen flex bg-[var(--background)] overflow-hidden">
      {/* Sidebar - Fixed */}
      <aside className="w-72 h-screen border-r border-zinc-200 dark:border-zinc-800/50 bg-zinc-50 dark:bg-zinc-950/50 hidden lg:flex flex-col flex-shrink-0 overflow-y-auto">
        {/* Logo */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800/50">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-semibold text-zinc-900 dark:text-white">{SITE_CONFIG.name}</span>
              <div className="flex items-center gap-1">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                  user?.subscription_tier === 'pro'
                    ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                    : user?.subscription_tier === 'team'
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-500'
                }`}>
                  {user?.subscription_tier?.toUpperCase() || 'FREE'}
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Search & Theme Toggle */}
        <div className="p-4 space-y-3">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 text-zinc-500 text-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
            <Search size={16} />
            <span>Search...</span>
            <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center gap-0.5">
              <Command size={10} />K
            </kbd>
          </button>
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 text-zinc-600 dark:text-zinc-400 text-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          >
            {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span>{resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 space-y-1">
          <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-600 uppercase tracking-wider px-4 mb-2">
            Main
          </div>
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-zinc-900 dark:text-white border border-indigo-500/20'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                }`}
              >
                <link.icon size={18} className={isActive ? 'text-indigo-500 dark:text-indigo-400' : ''} />
                {link.label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                )}
              </Link>
            );
          })}

          {/* Admin Links */}
          {isAdmin && (
            <>
              <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-600 uppercase tracking-wider px-4 mb-2 mt-6">
                Admin
              </div>
              {adminLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-zinc-900 dark:text-white border border-amber-500/20'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    <link.icon size={18} className={isActive ? 'text-amber-500 dark:text-amber-400' : ''} />
                    {link.label}
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {/* Upgrade Card */}
        {user?.subscription_tier === 'free' && (
          <div className="p-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Crown size={18} className="text-amber-500 dark:text-amber-400" />
                  <span className="font-semibold text-sm text-zinc-900 dark:text-white">Upgrade to Pro</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-4">
                  Unlock unlimited voice sessions and AI video avatar.
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
                >
                  View plans <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* User */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800/50">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium shadow-lg shadow-indigo-500/20">
              {user?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-zinc-900 dark:text-white">{user?.full_name || 'User'}</p>
              <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-zinc-900 dark:text-white">{SITE_CONFIG.name}</span>
          </Link>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`p-2 rounded-lg transition-colors ${
                    isActive ? 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400' : 'text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  <link.icon size={18} />
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                href="/admin"
                className={`p-2 rounded-lg transition-colors ${
                  pathname.startsWith('/admin') ? 'bg-amber-500/10 text-amber-500 dark:text-amber-400' : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                <Shield size={18} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <main className="flex-1 lg:pt-0 pt-16 overflow-y-auto bg-[var(--background)]">
        {children}
      </main>
    </div>
  );
}
