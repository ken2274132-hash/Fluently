'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
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

interface QuizStats {
  bestScore: number;
  totalQuizzesTaken: number;
}

interface FlashcardStats {
  knownCards: string[];
  learningCards: string[];
}

interface RecentSession {
  id: string;
  topic: string;
  created_at: string;
  duration_seconds: number;
  messages_count: number;
}

// Cache key for localStorage
const DASHBOARD_CACHE_KEY = 'dashboard_cache';

function getCachedData() {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(DASHBOARD_CACHE_KEY);
    if (cached) {
      const data = JSON.parse(cached);
      // Cache valid for 5 minutes
      if (Date.now() - data.timestamp < 5 * 60 * 1000) {
        return data;
      }
    }
  } catch {
    return null;
  }
  return null;
}

export default function DashboardPage() {
  const cached = getCachedData();
  const [userName, setUserName] = useState(cached?.userName || 'there');
  const [stats, setStats] = useState<UserStats>(cached?.stats || {
    sessionsThisWeek: 0,
    wordsLearned: 0,
    practiceStreak: 0,
    totalPracticeTime: 0
  });
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>(cached?.recentSessions || []);
  const [sessionsLoading, setSessionsLoading] = useState(!cached?.recentSessions);
  const [quizStats, setQuizStats] = useState<QuizStats | null>(null);
  const [flashcardStats, setFlashcardStats] = useState<FlashcardStats | null>(null);
  const supabase = useMemo(() => createClient(), []);

  // Load quiz and flashcard stats from localStorage
  useEffect(() => {
    const savedQuizStats = localStorage.getItem('quizStats');
    if (savedQuizStats) {
      setQuizStats(JSON.parse(savedQuizStats));
    }

    const savedFlashcardStats = localStorage.getItem('flashcardStats');
    if (savedFlashcardStats) {
      setFlashcardStats(JSON.parse(savedFlashcardStats));
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!mounted) return;

        if (user) {
          const firstName = user.user_metadata?.full_name?.split(' ')[0] ||
                           user.email?.split('@')[0] || 'there';
          setUserName(firstName);

          // Fetch recent sessions
          const { data: sessions } = await supabase
            .from('sessions')
            .select('id, topic, created_at, duration_seconds, messages_count')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5);

          if (!mounted) return;

          if (sessions) {
            setRecentSessions(sessions);

            // Calculate stats
            const now = new Date();
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const sessionsThisWeek = sessions.filter(
              s => new Date(s.created_at) >= weekAgo
            ).length;

            const totalTime = sessions.reduce((acc, s) => acc + (s.duration_seconds || 0), 0);

            const newStats = {
              sessionsThisWeek,
              wordsLearned: 50 + sessionsThisWeek * 15,
              practiceStreak: Math.min(sessionsThisWeek, 7),
              totalPracticeTime: Math.round(totalTime / 60)
            };
            setStats(newStats);

            // Cache the data
            try {
              localStorage.setItem(DASHBOARD_CACHE_KEY, JSON.stringify({
                userName: firstName,
                stats: newStats,
                recentSessions: sessions,
                timestamp: Date.now()
              }));
            } catch {
              // Ignore cache errors
            }
          }
        }
      } catch {
        // Silent fail
      } finally {
        if (mounted) setSessionsLoading(false);
      }
    }

    fetchData();

    return () => { mounted = false; };
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
      <div className="mb-8">
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
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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
      </div>

      {/* Learning Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">Learn & Practice</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/lessons"
            className="group rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 p-4 hover:border-blue-500/40 transition-all shadow-sm"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-3">
              <BookOpen size={20} className="text-white" />
            </div>
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-white">Lessons</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Grammar & Tenses</p>
          </Link>

          <Link
            href="/quiz"
            className="group rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 p-4 hover:border-purple-500/40 transition-all shadow-sm"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-3">
              <Target size={20} className="text-white" />
            </div>
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-white">Quiz</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Test Your Knowledge</p>
          </Link>

          <Link
            href="/flashcards"
            className="group rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 p-4 hover:border-orange-500/40 transition-all shadow-sm"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mb-3">
              <Zap size={20} className="text-white" />
            </div>
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-white">Flashcards</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Quick Review</p>
          </Link>

          <Link
            href="/grammar-checker"
            className="group rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 p-4 hover:border-green-500/40 transition-all shadow-sm"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-white">Grammar Check</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Check Your Writing</p>
          </Link>

        </div>
      </div>

      {/* Learning Progress Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Learning Progress</h2>
          <Link
            href="/progress"
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            View details <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Quiz Progress */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Target size={18} className="text-white" />
              </div>
              <div>
                <div className="font-semibold text-zinc-900 dark:text-white">Quiz Score</div>
                <div className="text-xs text-zinc-500">Your best performance</div>
              </div>
            </div>
            {quizStats ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Best Score</span>
                  <span className={`text-2xl font-bold ${quizStats.bestScore >= 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {quizStats.bestScore}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Quizzes Taken</span>
                  <span className="text-lg font-semibold text-zinc-900 dark:text-white">{quizStats.totalQuizzesTaken}</span>
                </div>
                <Link
                  href="/quiz"
                  className="block w-full text-center py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors"
                >
                  Take Quiz
                </Link>
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-sm text-zinc-500 mb-3">No quizzes taken yet</p>
                <Link
                  href="/quiz"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors"
                >
                  Start First Quiz
                </Link>
              </div>
            )}
          </div>

          {/* Flashcard Progress */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Zap size={18} className="text-white" />
              </div>
              <div>
                <div className="font-semibold text-zinc-900 dark:text-white">Flashcards</div>
                <div className="text-xs text-zinc-500">Memory mastery</div>
              </div>
            </div>
            {flashcardStats && (flashcardStats.knownCards?.length > 0 || flashcardStats.learningCards?.length > 0) ? (
              <div className="space-y-3">
                <div className="flex gap-3 text-center">
                  <div className="flex-1 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                    <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{flashcardStats.knownCards?.length || 0}</div>
                    <div className="text-xs text-emerald-600/70 dark:text-emerald-400/70">Mastered</div>
                  </div>
                  <div className="flex-1 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                    <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{flashcardStats.learningCards?.length || 0}</div>
                    <div className="text-xs text-amber-600/70 dark:text-amber-400/70">Learning</div>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                    style={{ width: `${((flashcardStats.knownCards?.length || 0) / 40) * 100}%` }}
                  />
                </div>
                <Link
                  href="/flashcards"
                  className="block w-full text-center py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium transition-colors"
                >
                  Practice Cards
                </Link>
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-sm text-zinc-500 mb-3">Start learning flashcards</p>
                <Link
                  href="/flashcards"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500 text-white text-sm font-medium hover:bg-purple-600 transition-colors"
                >
                  Start Flashcards
                </Link>
              </div>
            )}
          </div>

          {/* Lessons Progress */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <BookOpen size={18} className="text-white" />
              </div>
              <div>
                <div className="font-semibold text-zinc-900 dark:text-white">Lessons</div>
                <div className="text-xs text-zinc-500">Grammar & Tenses</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-center text-sm">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <div className="font-bold text-blue-600 dark:text-blue-400">19</div>
                  <div className="text-xs text-blue-600/70 dark:text-blue-400/70">Lessons</div>
                </div>
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
                  <div className="font-bold text-indigo-600 dark:text-indigo-400">8</div>
                  <div className="text-xs text-indigo-600/70 dark:text-indigo-400/70">Categories</div>
                </div>
              </div>
              <Link
                href="/lessons"
                className="block w-full text-center py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
              >
                Browse Lessons
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.label}
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
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Sessions */}
        <div className="lg:col-span-2">
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
            {sessionsLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded mb-2" />
                      <div className="h-3 w-48 bg-zinc-100 dark:bg-zinc-800/50 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentSessions.length > 0 ? (
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
        </div>

        {/* Quick Practice */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">Quick Practice</h2>
          <div className="space-y-3">
            {TOPICS.map((topic) => (
              <Link
                key={topic.id}
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
        </div>
      </div>
    </div>
  );
}
