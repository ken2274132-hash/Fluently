"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { lessons, quizzes, flashcards } from "@/data/lessons";
import { ArrowLeft, Flame, Target, Zap } from "lucide-react";

interface QuizStats {
    bestScore: number;
    totalQuizzesTaken: number;
    lastQuizDate: string;
}

interface FlashcardStats {
    knownCards: string[];
    learningCards: string[];
    lastStudyDate: string;
}

export default function ProgressPage() {
    const [quizStats, setQuizStats] = useState<QuizStats | null>(null);
    const [flashcardStats, setFlashcardStats] = useState<FlashcardStats | null>(null);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        // Load quiz stats
        const savedQuizStats = localStorage.getItem('quizStats');
        if (savedQuizStats) {
            setQuizStats(JSON.parse(savedQuizStats));
        }

        // Load flashcard stats
        const savedFlashcardStats = localStorage.getItem('flashcardStats');
        if (savedFlashcardStats) {
            setFlashcardStats(JSON.parse(savedFlashcardStats));
        }

        // Calculate streak
        const lastActivity = localStorage.getItem('lastActivityDate');
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        if (lastActivity === today) {
            const currentStreak = parseInt(localStorage.getItem('streak') || '1');
            setStreak(currentStreak);
        } else if (lastActivity === yesterday) {
            const currentStreak = parseInt(localStorage.getItem('streak') || '0') + 1;
            setStreak(currentStreak);
            localStorage.setItem('streak', currentStreak.toString());
            localStorage.setItem('lastActivityDate', today);
        } else {
            setStreak(1);
            localStorage.setItem('streak', '1');
            localStorage.setItem('lastActivityDate', today);
        }
    }, []);

    const totalFlashcards = flashcards.length;
    const knownCardsCount = flashcardStats?.knownCards?.length || 0;
    const learningCardsCount = flashcardStats?.learningCards?.length || 0;

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950">
            {/* Simple Header */}
            <header className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
                <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/dashboard" className="p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <span className="font-medium text-zinc-900 dark:text-white">Progress</span>
                    <div className="w-9" />
                </div>
            </header>

            <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
                {/* Streak */}
                <div className="bg-orange-500 rounded-2xl p-5 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm">Daily Streak</p>
                            <p className="text-4xl font-bold">{streak} day{streak !== 1 ? 's' : ''}</p>
                        </div>
                        <Flame className="w-12 h-12 text-orange-200" />
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 text-center border border-zinc-200 dark:border-zinc-800">
                        <div className="text-2xl font-bold text-zinc-900 dark:text-white">{lessons.length}</div>
                        <div className="text-xs text-zinc-500">Lessons</div>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 text-center border border-zinc-200 dark:border-zinc-800">
                        <div className="text-2xl font-bold text-zinc-900 dark:text-white">{quizzes.length}</div>
                        <div className="text-xs text-zinc-500">Questions</div>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 text-center border border-zinc-200 dark:border-zinc-800">
                        <div className="text-2xl font-bold text-zinc-900 dark:text-white">{totalFlashcards}</div>
                        <div className="text-xs text-zinc-500">Cards</div>
                    </div>
                </div>

                {/* Quiz Stats */}
                <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                            <Target className="w-5 h-5 text-indigo-500" />
                        </div>
                        <h2 className="font-semibold text-zinc-900 dark:text-white">Quiz Progress</h2>
                    </div>

                    {quizStats ? (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-zinc-500">Best Score</span>
                                <span className={`font-bold text-lg ${
                                    quizStats.bestScore >= 70 ? "text-emerald-500" : "text-amber-500"
                                }`}>
                                    {quizStats.bestScore}%
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-zinc-500">Quizzes Taken</span>
                                <span className="font-bold text-zinc-900 dark:text-white">{quizStats.totalQuizzesTaken}</span>
                            </div>
                            <Link
                                href="/quiz"
                                className="block w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl font-medium text-center transition-colors"
                            >
                                Take Quiz
                            </Link>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-zinc-500 mb-4">No quizzes taken yet</p>
                            <Link
                                href="/quiz"
                                className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                            >
                                Start First Quiz
                            </Link>
                        </div>
                    )}
                </div>

                {/* Flashcard Stats */}
                <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-purple-500" />
                        </div>
                        <h2 className="font-semibold text-zinc-900 dark:text-white">Flashcard Progress</h2>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-zinc-500">Mastered</span>
                            <span className="font-medium text-zinc-900 dark:text-white">
                                {knownCardsCount} / {totalFlashcards}
                            </span>
                        </div>
                        <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-purple-500 transition-all"
                                style={{ width: `${(knownCardsCount / totalFlashcards) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4 mb-4 text-sm">
                        <div className="flex-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 text-center">
                            <div className="font-bold text-emerald-600 dark:text-emerald-400">{knownCardsCount}</div>
                            <div className="text-emerald-600/70 dark:text-emerald-400/70 text-xs">Know</div>
                        </div>
                        <div className="flex-1 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 text-center">
                            <div className="font-bold text-amber-600 dark:text-amber-400">{learningCardsCount}</div>
                            <div className="text-amber-600/70 dark:text-amber-400/70 text-xs">Learning</div>
                        </div>
                        <div className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3 text-center">
                            <div className="font-bold text-zinc-600 dark:text-zinc-400">
                                {totalFlashcards - knownCardsCount - learningCardsCount}
                            </div>
                            <div className="text-zinc-500 text-xs">New</div>
                        </div>
                    </div>

                    <Link
                        href="/flashcards"
                        className="block w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-xl font-medium text-center transition-colors"
                    >
                        Practice Flashcards
                    </Link>
                </div>

                {/* Quick Actions */}
                <div className="pt-2">
                    <Link
                        href="/lessons"
                        className="block w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 py-3 rounded-xl font-medium text-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                        Browse Lessons
                    </Link>
                </div>
            </main>
        </div>
    );
}
