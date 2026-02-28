"use client";

import { useState } from "react";
import Link from "next/link";

export default function GrammarCheckerPage() {
    const [text, setText] = useState("");
    const [result, setResult] = useState<{
        corrected: string;
        suggestions: { original: string; correction: string; rule: string }[];
        score: number;
    } | null>(null);
    const [loading, setLoading] = useState(false);

    const checkGrammar = async () => {
        if (!text.trim()) return;

        setLoading(true);
        try {
            const response = await fetch("/api/grammar-check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });

            if (response.ok) {
                const data = await response.json();
                setResult(data);
            } else {
                setResult({
                    corrected: text,
                    suggestions: [],
                    score: 100,
                });
            }
        } catch (error) {
            console.error("Grammar check error:", error);
        } finally {
            setLoading(false);
        }
    };

    const sampleTexts = [
        "He go to school everyday.",
        "She have been working since 5 hours.",
        "I am living here since 2010.",
        "The childrens are playing in park.",
        "He don't like pizza, don't he?"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900">Grammar Checker</h1>
                    <div className="w-16"></div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6">
                {/* Info Card */}
                <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-6 text-white mb-6">
                    <h2 className="text-xl font-bold mb-2">Check Your Grammar</h2>
                    <p className="opacity-90">
                        Write or paste your text below and Sara will check it for grammar errors based on English rules.
                    </p>
                </div>

                {/* Input Area */}
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter your text
                    </label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type or paste your English text here..."
                        rows={6}
                        className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-gray-900"
                    />

                    <div className="flex flex-wrap gap-2 mt-4 mb-4">
                        <span className="text-sm text-gray-500">Try:</span>
                        {sampleTexts.map((sample, i) => (
                            <button
                                key={i}
                                onClick={() => setText(sample)}
                                className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
                            >
                                {sample.substring(0, 25)}...
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={checkGrammar}
                        disabled={!text.trim() || loading}
                        className={`w-full py-3 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                            text.trim() && !loading
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        {loading ? (
                            <>
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Checking...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Check Grammar
                            </>
                        )}
                    </button>
                </div>

                {/* Results */}
                {result && (
                    <div className="space-y-6">
                        {/* Score */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900">Grammar Score</h3>
                                <span className={`text-3xl font-bold ${
                                    result.score >= 80 ? "text-green-600" :
                                    result.score >= 60 ? "text-yellow-600" :
                                    "text-red-600"
                                }`}>
                                    {result.score}%
                                </span>
                            </div>
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${
                                        result.score >= 80 ? "bg-green-500" :
                                        result.score >= 60 ? "bg-yellow-500" :
                                        "bg-red-500"
                                    }`}
                                    style={{ width: `${result.score}%` }}
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                {result.score >= 80 ? "Excellent! Your grammar is great." :
                                 result.score >= 60 ? "Good effort! A few corrections needed." :
                                 "Keep practicing! Review the suggestions below."}
                            </p>
                        </div>

                        {/* Corrected Text */}
                        {result.corrected !== text && (
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Corrected Text
                                </h3>
                                <div className="bg-green-50 p-4 rounded-lg text-gray-800 border border-green-200">
                                    {result.corrected}
                                </div>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(result.corrected);
                                    }}
                                    className="mt-3 text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                    </svg>
                                    Copy corrected text
                                </button>
                            </div>
                        )}

                        {/* Suggestions */}
                        {result.suggestions.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                    Grammar Suggestions ({result.suggestions.length})
                                </h3>
                                <div className="space-y-4">
                                    {result.suggestions.map((suggestion, i) => (
                                        <div key={i} className="border rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-medium">
                                                    {i + 1}
                                                </span>
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded line-through text-sm">
                                                            {suggestion.original}
                                                        </span>
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                        </svg>
                                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
                                                            {suggestion.correction}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                                        <strong>Rule:</strong> {suggestion.rule}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* No Errors */}
                        {result.suggestions.length === 0 && result.score === 100 && (
                            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                                <div className="text-5xl mb-4">🎉</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Perfect Grammar!</h3>
                                <p className="text-gray-600">No grammar errors found. Great job!</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Quick Links */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <Link
                        href="/lessons"
                        className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex items-center gap-3"
                    >
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-medium text-gray-900">Study Lessons</div>
                            <div className="text-sm text-gray-500">Learn grammar rules</div>
                        </div>
                    </Link>
                    <Link
                        href="/voice"
                        className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex items-center gap-3"
                    >
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-medium text-gray-900">Practice Speaking</div>
                            <div className="text-sm text-gray-500">Talk with Sara</div>
                        </div>
                    </Link>
                </div>
            </main>
        </div>
    );
}
