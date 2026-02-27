'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Users,
  Activity,
  Clock,
  Globe,
  RefreshCw,
  Circle,
  ArrowRight,
  Wifi,
  WifiOff
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface ActiveUser {
  id: string;
  user_id: string;
  page_path: string;
  started_at: string;
  is_active: boolean;
  user_agent: string | null;
  profile: {
    email: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface VisitHistory {
  id: string;
  user_id: string;
  page_path: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
  profile: {
    email: string;
    full_name: string | null;
  } | null;
}

export default function AdminLivePage() {
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [recentVisits, setRecentVisits] = useState<VisitHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isConnected, setIsConnected] = useState(true);
  const supabase = createClient();

  const fetchActiveUsers = useCallback(async () => {
    try {
      // Cleanup stale visits first
      await supabase.rpc('cleanup_stale_visits');

      // Fetch active users
      const { data: active, error: activeError } = await supabase
        .from('user_visits')
        .select(`
          id,
          user_id,
          page_path,
          started_at,
          is_active,
          user_agent,
          profile:profiles!user_id (
            email,
            full_name,
            avatar_url
          )
        `)
        .eq('is_active', true)
        .order('started_at', { ascending: false });

      if (!activeError && active) {
        setActiveUsers(active as unknown as ActiveUser[]);
      }

      // Fetch recent visit history
      const { data: history, error: historyError } = await supabase
        .from('user_visits')
        .select(`
          id,
          user_id,
          page_path,
          started_at,
          ended_at,
          duration_seconds,
          profile:profiles!user_id (
            email,
            full_name
          )
        `)
        .order('started_at', { ascending: false })
        .limit(20);

      if (!historyError && history) {
        setRecentVisits(history as unknown as VisitHistory[]);
      }

      setLastUpdated(new Date());
      setIsConnected(true);
    } catch {
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchActiveUsers();

    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchActiveUsers, 10000);

    // Subscribe to real-time changes
    const channel = supabase
      .channel('admin-live-users')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_visits'
        },
        () => {
          fetchActiveUsers();
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchActiveUsers]);

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '-';
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins < 60) return `${mins}m ${secs}s`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ${mins % 60}m`;
  };

  const getActiveTime = (startedAt: string) => {
    const start = new Date(startedAt);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - start.getTime()) / 1000);
    return formatDuration(diffSeconds);
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getPageName = (path: string) => {
    const pathMap: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/voice': 'Voice Practice',
      '/voice-avatar': '3D Avatar',
      '/video': 'Video Avatar',
      '/settings': 'Settings',
      '/profile': 'Profile',
      '/admin': 'Admin Panel',
      '/admin/users': 'Admin - Users',
      '/admin/analytics': 'Admin - Analytics',
      '/admin/live': 'Admin - Live'
    };
    return pathMap[path] || path;
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-medium">
              Admin
            </div>
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${
              isConnected
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : 'bg-red-500/20 text-red-600 dark:text-red-400'
            }`}>
              {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
              {isConnected ? 'Live' : 'Disconnected'}
            </div>
          </div>
          <button
            onClick={fetchActiveUsers}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-zinc-900 dark:text-white">
          Live Users
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Real-time view of active users on your platform.
          <span className="text-xs text-zinc-500 ml-2">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Activity size={18} className="text-white" />
            </div>
            <div className="flex items-center gap-1">
              <Circle size={8} className="text-emerald-500 fill-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-600 dark:text-emerald-400">Live</span>
            </div>
          </div>
          <div className="text-3xl font-bold mb-1 text-zinc-900 dark:text-white">
            {activeUsers.length}
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Active Users Now</div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Users size={18} className="text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1 text-zinc-900 dark:text-white">
            {recentVisits.length}
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Recent Sessions</div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <Globe size={18} className="text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1 text-zinc-900 dark:text-white">
            {new Set(activeUsers.map(u => u.page_path)).size}
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Active Pages</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active Users List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
              <Circle size={8} className="text-emerald-500 fill-emerald-500 animate-pulse" />
              Currently Online
            </h2>
          </div>
          <div className="rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 overflow-hidden shadow-sm">
            {activeUsers.length > 0 ? (
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
                {activeUsers.map((user) => (
                  <div key={user.id} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                            {user.profile?.full_name?.[0]?.toUpperCase() || user.profile?.email?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900" />
                        </div>
                        <div>
                          <div className="font-medium text-sm text-zinc-900 dark:text-white">
                            {user.profile?.full_name || 'Anonymous'}
                          </div>
                          <div className="text-xs text-zinc-500">{user.profile?.email}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                          {getPageName(user.page_path)}
                        </div>
                        <div className="text-xs text-zinc-500 flex items-center gap-1 justify-end">
                          <Clock size={10} />
                          {getActiveTime(user.started_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center mx-auto mb-3">
                  <Users size={20} className="text-zinc-500" />
                </div>
                <p className="text-sm text-zinc-500">No users online right now</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Visit History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Recent Activity
            </h2>
            <Link
              href="/admin/analytics"
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 overflow-hidden shadow-sm max-h-[500px] overflow-y-auto">
            {recentVisits.length > 0 ? (
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
                {recentVisits.map((visit) => (
                  <div key={visit.id} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          !visit.ended_at ? 'bg-emerald-500' : 'bg-zinc-400'
                        }`} />
                        <div>
                          <div className="font-medium text-sm text-zinc-900 dark:text-white">
                            {visit.profile?.full_name || visit.profile?.email?.split('@')[0] || 'User'}
                          </div>
                          <div className="text-xs text-zinc-500">
                            {getPageName(visit.page_path)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-zinc-500">
                          {visit.ended_at ? 'Ended' : 'Active'}: {formatTime(visit.started_at)}
                        </div>
                        <div className="text-xs text-zinc-400">
                          Duration: {visit.ended_at
                            ? formatDuration(visit.duration_seconds)
                            : getActiveTime(visit.started_at)
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center mx-auto mb-3">
                  <Activity size={20} className="text-zinc-500" />
                </div>
                <p className="text-sm text-zinc-500">No visit history yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
