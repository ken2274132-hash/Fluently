"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { quizzes, lessons } from "@/data/lessons";
import { ArrowLeft, Trophy, RotateCcw, Check, X } from "lucide-react";

function QuizContent() {
    const searchParams = useSearchParams();
    const lessonId = searchParams.get("lesson");

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [answered, setAnswered] = useState(false);
    const [quizComplete, setQuizComplete] = useState(false);
    const [bestScore, setBestScore] = useState<number | null>(null);
    const [totalQuizzesTaken, setTotalQuizzesTaken] = useState(0);

    // Load stats from localStorage
    useEffect(() => {
        const stats = localStorage.getItem('quizStats');
        if (stats) {
            const parsed = JSON.parse(stats);
            setBestScore(parsed.bestScore || null);
            setTotalQuizzesTaken(parsed.totalQuizzesTaken || 0);
        }
    }, []);

    // Filter quizzes by lesson or get all
    const filteredQuizzes = lessonId
        ? quizzes.filter(q => q.lessonId === lessonId)
        : quizzes;

    // Shuffle and limit to 10 questions
    const [shuffledQuizzes, setShuffledQuizzes] = useState<typeof quizzes>([]);

    useEffect(() => {
        const shuffled = [...filteredQuizzes].sort(() => Math.random() - 0.5).slice(0, 10);
        setShuffledQuizzes(shuffled);
    }, [lessonId]);

    // Save stats when quiz completes
    const saveStats = useCallback((finalScore: number, total: number) => {
        const percentage = Math.round((finalScore / total) * 100);
        const currentStats = localStorage.getItem('quizStats');
        const parsed = currentStats ? JSON.parse(currentStats) : {};

        const newBestScore = Math.max(parsed.bestScore || 0, percentage);
        const newTotalQuizzes = (parsed.totalQuizzesTaken || 0) + 1;

        localStorage.setItem('quizStats', JSON.stringify({
            bestScore: newBestScore,
            totalQuizzesTaken: newTotalQuizzes,
            lastQuizDate: new Date().toISOString()
        }));

        setBestScore(newBestScore);
        setTotalQuizzesTaken(newTotalQuizzes);
    }, []);

    const currentQuestion = shuffledQuizzes[currentQuestionIndex];
    const lesson = currentQuestion ? lessons.find(l => l.id === currentQuestion.lessonId) : null;

    const handleAnswerSelect = (index: number) => {
        if (answered) return;
        setSelectedAnswer(index);
    };

    const handleSubmit = () => {
        if (selectedAnswer === null) return;
        setAnswered(true);
        if (selectedAnswer === currentQuestion.correctAnswer) {
            setScore(score + 1);
        }
        setShowResult(true);
    };

    const handleNext = () => {
        if (currentQuestionIndex < shuffledQuizzes.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
            setShowResult(false);
            setAnswered(false);
        } else {
            // Calculate final score including current answer
            const finalScore = selectedAnswer === currentQuestion.correctAnswer ? score + 1 : score;
            saveStats(finalScore, shuffledQuizzes.length);
            setQuizComplete(true);
        }
    };

    const handleRestart = () => {
        const shuffled = [...filteredQuizzes].sort(() => Math.random() - 0.5).slice(0, 10);
        setShuffledQuizzes(shuffled);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setAnswered(false);
        setScore(0);
        setQuizComplete(false);
    };

    if (shuffledQuizzes.length === 0) {
        // Check if no questions exist for this lesson
        if (filteredQuizzes.length === 0) {
            return (
                <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center p-4">
                    <div className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-8 text-center max-w-sm">
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">No Quiz Available</h2>
                        <p className="text-zinc-500 mb-6">
                            {lessonId ? "No questions for this lesson yet." : "Loading..."}
                        </p>
                        <div className="space-y-3">
                            <Link href="/quiz" className="block w-full bg-indigo-500 text-white py-3 rounded-xl font-medium">
                                Take General Quiz
                            </Link>
                            <Link href="/lessons" className="block w-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 py-3 rounded-xl font-medium">
                                Back to Lessons
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
                    <p className="text-zinc-500">Loading quiz...</p>
                </div>
            </div>
        );
    }

    // Quiz Complete Screen
    if (quizComplete) {
        const percentage = Math.round((score / shuffledQuizzes.length) * 100);
        const isGood = percentage >= 70;

        return (
            <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center p-4">
                <div className="w-full max-w-sm text-center">
                    {/* Score Circle */}
                    <div className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center ${
                        isGood ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-amber-100 dark:bg-amber-900/30"
                    }`}>
                        <div>
                            <div className={`text-4xl font-bold ${isGood ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                                {percentage}%
                            </div>
                            <div className="text-sm text-zinc-500">{score}/{shuffledQuizzes.length}</div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                        {isGood ? "Great job!" : "Keep practicing!"}
                    </h2>
                    <p className="text-zinc-500 mb-8">
                        {isGood ? "You're doing well!" : "Review the lessons and try again."}
                    </p>

                    {/* Stats Row */}
                    <div className="flex justify-center gap-6 mb-8 text-sm">
                        <div>
                            <div className="font-bold text-zinc-900 dark:text-white">{bestScore || percentage}%</div>
                            <div className="text-zinc-500">Best</div>
                        </div>
                        <div className="w-px bg-zinc-200 dark:bg-zinc-800" />
                        <div>
                            <div className="font-bold text-zinc-900 dark:text-white">{totalQuizzesTaken}</div>
                            <div className="text-zinc-500">Quizzes</div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <button
                            onClick={handleRestart}
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                        >
                            <RotateCcw className="w-5 h-5" />
                            Try Again
                        </button>
                        <Link
                            href="/dashboard"
                            className="block w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 py-4 rounded-xl font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950">
            {/* Simple Header */}
            <header className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
                <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/dashboard" className="p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <span className="font-medium text-zinc-900 dark:text-white">
                        {currentQuestionIndex + 1} / {shuffledQuizzes.length}
                    </span>
                    <div className="w-9" />
                </div>
                {/* Progress Bar */}
                <div className="h-1 bg-zinc-100 dark:bg-zinc-800">
                    <div
                        className="h-full bg-indigo-500 transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / shuffledQuizzes.length) * 100}%` }}
                    />
                </div>
            </header>

            <main className="max-w-lg mx-auto px-4 py-6">
                {/* Question */}
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-6 leading-relaxed">
                    {currentQuestion.question}
                </h2>

                {/* Options - Simple buttons */}
                <div className="space-y-3 mb-6">
                    {currentQuestion.options.map((option, index) => {
                        const isCorrect = index === currentQuestion.correctAnswer;
                        const isSelected = selectedAnswer === index;

                        let buttonClass = "w-full p-4 rounded-xl text-left transition-all border-2 ";

                        if (answered) {
                            if (isCorrect) {
                                buttonClass += "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-300";
                            } else if (isSelected) {
                                buttonClass += "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-300";
                            } else {
                                buttonClass += "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400";
                            }
                        } else {
                            if (isSelected) {
                                buttonClass += "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 text-indigo-700 dark:text-indigo-300";
                            } else {
                                buttonClass += "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600";
                            }
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(index)}
                                disabled={answered}
                                className={buttonClass}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">{option}</span>
                                    {answered && isCorrect && <Check className="w-5 h-5 text-emerald-500" />}
                                    {answered && isSelected && !isCorrect && <X className="w-5 h-5 text-red-500" />}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Explanation - Simple text */}
                {showResult && (
                    <div className={`p-4 rounded-xl mb-6 ${
                        selectedAnswer === currentQuestion.correctAnswer
                            ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                            : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                    }`}>
                        <p className="font-medium mb-1">
                            {selectedAnswer === currentQuestion.correctAnswer ? "Correct!" : "Not quite right"}
                        </p>
                        <p className="text-sm opacity-90">{currentQuestion.explanation}</p>
                    </div>
                )}

                {/* Action Button */}
                {!answered ? (
                    <button
                        onClick={handleSubmit}
                        disabled={selectedAnswer === null}
                        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                            selectedAnswer !== null
                                ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                        }`}
                    >
                        Check Answer
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="w-full py-4 rounded-xl font-semibold text-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
                    >
                        {currentQuestionIndex < shuffledQuizzes.length - 1 ? "Next" : "See Results"}
                    </button>
                )}
            </main>
        </div>
    );
}

export default function QuizPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
            </div>
        }>
            <QuizContent />
        </Suspense>
    );
}
