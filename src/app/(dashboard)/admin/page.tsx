'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  MessageSquare,
  FileText,
  UserPlus,
  ArrowRight
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface AdminStats {
  totalUsers: number;
  totalSessions: number;
  totalMessages: number;
  totalCorrections: number;
}

interface RecentUser {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  subscription_tier: string;
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalSessions: 0,
    totalMessages: 0,
    totalCorrections: 0
  });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchStats() {
      // Fetch user count
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch session count
      const { count: sessionCount } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true });

      // Fetch message count
      const { count: messageCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true });

      // Fetch corrections count
      const { count: correctionsCount } = await supabase
        .from('corrections')
        .select('*', { count: 'exact', head: true });

      // Fetch recent users
      const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalUsers: userCount || 0,
        totalSessions: sessionCount || 0,
        totalMessages: messageCount || 0,
        totalCorrections: correctionsCount || 0
      });

      if (users) {
        setRecentUsers(users);
      }

      setLoading(false);
    }

    fetchStats();
  }, [supabase]);

  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      gradient: 'from-indigo-500 to-purple-500',
      href: '/admin/users'
    },
    {
      label: 'Total Sessions',
      value: stats.totalSessions,
      icon: MessageSquare,
      gradient: 'from-cyan-500 to-blue-500',
      href: '/admin/analytics'
    },
    {
      label: 'Total Messages',
      value: stats.totalMessages,
      icon: FileText,
      gradient: 'from-emerald-500 to-teal-500',
      href: '/admin/analytics'
    },
    {
      label: 'Corrections Made',
      value: stats.totalCorrections,
      icon: FileText,
      gradient: 'from-amber-500 to-orange-500',
      href: '/admin/analytics'
    },
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-36 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-medium">
            Admin
          </div>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-zinc-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Monitor your platform&apos;s data and users.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <Link
              href={stat.href}
              className="block relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 p-5 hover:border-zinc-300 dark:hover:border-zinc-700/50 transition-colors shadow-sm group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                  <stat.icon size={18} className="text-white" />
                </div>
                <ArrowRight size={16} className="text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
              </div>
              <div className="text-3xl font-bold mb-1 text-zinc-900 dark:text-white">{stat.value.toLocaleString()}</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">{stat.label}</div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Users */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Recent Users</h2>
          <Link
            href="/admin/users"
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center gap-1"
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 overflow-hidden shadow-sm">
          {recentUsers.length > 0 ? (
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
              {recentUsers.map((user) => (
                <div key={user.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                      {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-zinc-900 dark:text-white">{user.full_name || 'No name'}</div>
                      <div className="text-xs text-zinc-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                      user.subscription_tier === 'pro'
                        ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                        : user.subscription_tier === 'team'
                        ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-500'
                    }`}>
                      {user.subscription_tier?.toUpperCase() || 'FREE'}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">{formatDate(user.created_at)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center mx-auto mb-3">
                <UserPlus size={20} className="text-zinc-500" />
              </div>
              <p className="text-sm text-zinc-500">No users yet</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
