'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  Users,
  MessageSquare,
  FileText,
  BarChart3
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Session {
  id: string;
  topic: string;
  created_at: string;
  messages_count: number;
  corrections_count: number;
}

interface TopicStats {
  topic: string;
  count: number;
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSessions: 0,
    totalMessages: 0,
    totalCorrections: 0
  });
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [topTopics, setTopTopics] = useState<TopicStats[]>([]);
  const [weeklyData, setWeeklyData] = useState<{ day: string; sessions: number }[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchAnalytics() {
      // Fetch counts
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: sessionCount } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true });

      const { count: messageCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true });

      const { count: correctionsCount } = await supabase
        .from('corrections')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalUsers: userCount || 0,
        totalSessions: sessionCount || 0,
        totalMessages: messageCount || 0,
        totalCorrections: correctionsCount || 0
      });

      // Fetch recent sessions
      const { data: sessions } = await supabase
        .from('sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (sessions) {
        setRecentSessions(sessions);

        // Calculate top topics from sessions
        const topicCounts: Record<string, number> = {};
        sessions.forEach((session) => {
          const topic = session.topic || 'General';
          topicCounts[topic] = (topicCounts[topic] || 0) + 1;
        });

        const sortedTopics = Object.entries(topicCounts)
          .map(([topic, count]) => ({ topic, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setTopTopics(sortedTopics);
      }

      // Calculate weekly sessions data
      const { data: weekSessions } = await supabase
        .from('sessions')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (weekSessions) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayCounts: Record<string, number> = {};

        // Initialize all days with 0
        days.forEach(day => { dayCounts[day] = 0; });

        weekSessions.forEach((session) => {
          const dayName = days[new Date(session.created_at).getDay()];
          dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;
        });

        // Order by day of week starting from Monday
        const orderedDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        setWeeklyData(orderedDays.map(day => ({ day, sessions: dayCounts[day] || 0 })));
      } else {
        // No data, set empty week
        setWeeklyData(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({ day, sessions: 0 })));
      }

      setLoading(false);
    }
    fetchAnalytics();
  }, [supabase]);

  const maxSessions = Math.max(...weeklyData.map(d => d.sessions), 1);
  const maxTopicCount = Math.max(...topTopics.map(t => t.count), 1);

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-medium">Admin</div>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-zinc-900 dark:text-white">Analytics</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Track platform usage and engagement.</p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: Users, gradient: 'from-indigo-500 to-purple-500' },
          { label: 'Total Sessions', value: stats.totalSessions, icon: MessageSquare, gradient: 'from-cyan-500 to-blue-500' },
          { label: 'Total Messages', value: stats.totalMessages, icon: FileText, gradient: 'from-emerald-500 to-teal-500' },
          { label: 'Corrections', value: stats.totalCorrections, icon: FileText, gradient: 'from-amber-500 to-orange-500' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                <stat.icon size={18} className="text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1 text-zinc-900 dark:text-white">{stat.value.toLocaleString()}</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Weekly Sessions</h2>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className="text-zinc-600 dark:text-zinc-400">Sessions</span>
            </div>
          </div>
          <div className="rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 p-6 shadow-sm">
            {weeklyData.some(d => d.sessions > 0) ? (
              <div className="flex items-end justify-between gap-2 h-48">
                {weeklyData.map((day, index) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.sessions / maxSessions) * 100}%` }}
                      transition={{ delay: 0.4 + index * 0.05, duration: 0.5 }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-indigo-500 to-purple-500 min-h-[8px]"
                    />
                    <span className="text-xs text-zinc-500">{day.day}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 size={32} className="mx-auto mb-2 text-zinc-400" />
                  <p className="text-sm text-zinc-500">No sessions this week</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Top Topics */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Popular Topics</h2>
            <BarChart3 size={18} className="text-zinc-500" />
          </div>
          <div className="rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 p-6 shadow-sm min-h-[240px]">
            {topTopics.length > 0 ? (
              <div className="space-y-5">
                {topTopics.map((topic, index) => (
                  <motion.div
                    key={topic.topic}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-zinc-900 dark:text-white">{topic.topic}</span>
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">{topic.count} sessions</span>
                    </div>
                    <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(topic.count / maxTopicCount) * 100}%` }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare size={32} className="mx-auto mb-2 text-zinc-400" />
                  <p className="text-sm text-zinc-500">No topics yet</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Sessions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Recent Sessions</h2>
          </div>
          <div className="rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 overflow-hidden shadow-sm">
            {recentSessions.length > 0 ? (
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
                {recentSessions.map((session) => (
                  <div key={session.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <div>
                      <div className="font-medium text-sm text-zinc-900 dark:text-white">{session.topic || 'General Conversation'}</div>
                      <div className="text-xs text-zinc-500">
                        {new Date(session.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-zinc-900 dark:text-white">{session.messages_count || 0}</div>
                        <div className="text-xs text-zinc-500">messages</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-zinc-900 dark:text-white">{session.corrections_count || 0}</div>
                        <div className="text-xs text-zinc-500">corrections</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <MessageSquare size={32} className="mx-auto mb-2 text-zinc-400" />
                <p className="text-sm text-zinc-500">No sessions yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
