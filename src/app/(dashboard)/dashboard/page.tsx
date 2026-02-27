'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  Mic,
  Video,
  TrendingUp,
  Clock,
  Target,
  ArrowRight,
  Play,
  BookOpen,
  MessageSquare,
  Flame,
  Calendar,
  ChevronRight,
  Zap
} from 'lucide-react';
import { TOPICS } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';

interface UserStats {
  sessionsThisWeek: number;
  wordsLearned: number;
  practiceStreak: number;
  totalPracticeTime: number;
}

interface RecentSession {
  id: string;
  topic: string;
  created_at: string;
  duration_seconds: number;
  messages_count: number;
}

export default function DashboardPage() {
  const [userName, setUserName] = useState('there');
  const [stats, setStats] = useState<UserStats>({
    sessionsThisWeek: 0,
    wordsLearned: 0,
    practiceStreak: 0,
    totalPracticeTime: 0
  });
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const firstName = user.user_metadata?.full_name?.split(' ')[0] ||
                         user.email?.split('@')[0] || 'there';
        setUserName(firstName);

        // Fetch recent sessions
        const { data: sessions } = await supabase
          .from('sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (sessions) {
          setRecentSessions(sessions);

          // Calculate stats
          const now = new Date();
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          const sessionsThisWeek = sessions.filter(
            s => new Date(s.created_at) >= weekAgo
          ).length;

          const totalTime = sessions.reduce((acc, s) => acc + (s.duration_seconds || 0), 0);

          setStats({
            sessionsThisWeek,
            wordsLearned: Math.floor(Math.random() * 200) + 50, // Placeholder
            practiceStreak: Math.floor(Math.random() * 10) + 1, // Placeholder
            totalPracticeTime: Math.round(totalTime / 60)
          });
        }
      }
    }

    fetchData();
  }, [supabase]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  const statCards = [
    {
      label: 'Sessions This Week',
      value: stats.sessionsThisWeek.toString(),
      icon: Mic,
      change: '+2 from last week',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      label: 'Words Learned',
      value: stats.wordsLearned.toString(),
      icon: BookOpen,
      change: '+34 this week',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      label: 'Practice Streak',
      value: `${stats.practiceStreak} days`,
      icon: Flame,
      change: 'Keep it up!',
      gradient: 'from-orange-500 to-amber-500'
    },
    {
      label: 'Total Practice',
      value: `${stats.totalPracticeTime} min`,
      icon: Clock,
      change: 'This month',
      gradient: 'from-cyan-500 to-blue-500'
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 text-zinc-500 text-sm mb-2">
          <Calendar size={14} />
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          })}
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-zinc-900 dark:text-white">
          Welcome back, <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">{userName}</span>!
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">Ready to practice? Here&apos;s your progress overview.</p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
      >
        <Link
          href="/voice"
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-6 hover:border-indigo-500/40 transition-all"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-full blur-3xl" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
              <Mic size={28} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1 text-zinc-900 dark:text-white">Voice Practice</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Start a voice conversation with AI</p>
            </div>
            <ArrowRight className="text-zinc-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        <Link
          href="/voice-avatar"
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 p-6 hover:border-emerald-500/40 transition-all"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-medium">
            FREE
          </div>
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
              <Video size={28} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1 text-zinc-900 dark:text-white">3D Avatar</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Practice with animated 3D teacher</p>
            </div>
            <ArrowRight className="text-zinc-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        <Link
          href="/video"
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 p-6 hover:border-cyan-500/40 transition-all"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-medium">
            IN TESTING
          </div>
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/30">
              <Video size={28} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1 text-zinc-900 dark:text-white">Video Avatar</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Realistic AI video teacher</p>
            </div>
            <ArrowRight className="text-zinc-400 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            className="relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 p-5 hover:border-zinc-300 dark:hover:border-zinc-700/50 transition-colors shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                <stat.icon size={18} className="text-white" />
              </div>
              <TrendingUp size={16} className="text-emerald-500 dark:text-emerald-400" />
            </div>
            <div className="text-3xl font-bold mb-1 text-zinc-900 dark:text-white">{stat.value}</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">{stat.label}</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
              <Zap size={12} />
              {stat.change}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Recent Sessions</h2>
            <Link
              href="/dashboard/sessions"
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              View all <ChevronRight size={16} />
            </Link>
          </div>
          <div className="rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 divide-y divide-zinc-200 dark:divide-zinc-800/50 overflow-hidden shadow-sm">
            {recentSessions.length > 0 ? (
              recentSessions.map((session) => (
                <div key={session.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center">
                      <MessageSquare size={18} className="text-zinc-500 dark:text-zinc-400" />
                    </div>
                    <div>
                      <div className="font-medium text-zinc-900 dark:text-white">{session.topic}</div>
                      <div className="text-sm text-zinc-500">
                        {formatDate(session.created_at)} · {formatDuration(session.duration_seconds)} · {session.messages_count} messages
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/voice?session=${session.id}`}
                    className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
                    title="Continue this session"
                  >
                    <Play size={16} className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white" />
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center mx-auto mb-4">
                  <Mic size={24} className="text-zinc-500" />
                </div>
                <h3 className="font-medium mb-2 text-zinc-900 dark:text-white">No sessions yet</h3>
                <p className="text-sm text-zinc-500 mb-4">Start your first practice session!</p>
                <Link
                  href="/voice"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors"
                >
                  <Mic size={16} />
                  Start Practice
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Practice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">Quick Practice</h2>
          <div className="space-y-3">
            {TOPICS.map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
              >
                <Link
                  href={`/voice?topic=${topic.id}`}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-all group shadow-sm"
                >
                  <div className={`w-10 h-10 rounded-xl ${topic.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                    {topic.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-zinc-900 dark:text-white">{topic.label}</div>
                  </div>
                  <ArrowRight size={16} className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Progress Card */}
          <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Target size={18} className="text-white" />
              </div>
              <div>
                <div className="font-semibold text-zinc-900 dark:text-white">Daily Goal</div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400">15 min practice</div>
              </div>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-zinc-600 dark:text-zinc-400">Progress</span>
                <span className="font-medium text-zinc-900 dark:text-white">67%</span>
              </div>
              <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                <div className="h-full w-[67%] rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
              </div>
            </div>
            <p className="text-xs text-zinc-500">5 min left to reach your goal!</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
