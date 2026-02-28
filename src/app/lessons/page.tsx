"use client";

import { useState } from "react";
import Link from "next/link";
import { lessons } from "@/data/lessons";
import { ArrowLeft, X, ChevronRight } from "lucide-react";

// Simple markdown renderer for lesson content
function renderContent(content: string) {
    const lines = content.split('\n');

    return lines.map((line, i) => {
        // Bold text: **text**
        const parts = line.split(/(\*\*[^*]+\*\*)/g);

        const rendered = parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j} className="font-semibold text-zinc-900 dark:text-white">{part.slice(2, -2)}</strong>;
            }
            return part;
        });

        // Check if it's a list item
        if (line.trim().match(/^[\d]+\./)) {
            return <p key={i} className="ml-4 my-1">{rendered}</p>;
        }
        if (line.trim().startsWith('-')) {
            return <p key={i} className="ml-4 my-1">{rendered}</p>;
        }

        // Empty line = paragraph break
        if (line.trim() === '') {
            return <div key={i} className="h-3" />;
        }

        return <p key={i} className="my-1">{rendered}</p>;
    });
}

export default function LessonsPage() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedLesson, setSelectedLesson] = useState<typeof lessons[0] | null>(null);

    const filteredLessons = selectedCategory
        ? lessons.filter(l => l.category.toLowerCase().includes(selectedCategory.toLowerCase()))
        : lessons;

    const categoryColors: Record<string, string> = {
        "Tenses": "bg-blue-500",
        "Grammar": "bg-emerald-500",
        "Sentence Structure": "bg-purple-500",
        "Writing Skills": "bg-orange-500"
    };

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950">
            {/* Simple Header */}
            <header className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
                <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/dashboard" className="p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <span className="font-medium text-zinc-900 dark:text-white">Lessons</span>
                    <div className="w-9" />
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-6">
                {/* Category Pills */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                            !selectedCategory
                                ? "bg-indigo-500 text-white"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        }`}
                    >
                        All
                    </button>
                    {["Tenses", "Grammar", "Sentence Structure", "Writing Skills"].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                selectedCategory === cat
                                    ? "bg-indigo-500 text-white"
                                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Lesson Modal */}
                {selectedLesson && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                        <div className="bg-white dark:bg-zinc-900 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-xl max-h-[90vh] overflow-y-auto">
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-white dark:bg-zinc-900 px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between z-10">
                                <div className="flex items-center gap-2">
                                    <span className={`w-3 h-3 rounded-full ${categoryColors[selectedLesson.category]}`} />
                                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{selectedLesson.category}</span>
                                </div>
                                <button
                                    onClick={() => setSelectedLesson(null)}
                                    className="p-2 -mr-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-5 space-y-6">
                                {/* Title */}
                                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                                    {selectedLesson.title}
                                </h2>

                                {/* Content - Properly formatted */}
                                <div className="text-zinc-600 dark:text-zinc-400 text-[15px] leading-relaxed">
                                    {renderContent(selectedLesson.content)}
                                </div>

                                {/* Examples */}
                                <div>
                                    <h3 className="font-semibold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        Examples
                                    </h3>
                                    <div className="space-y-2">
                                        {selectedLesson.examples.map((ex, i) => (
                                            <div
                                                key={i}
                                                className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-3 rounded-xl text-emerald-800 dark:text-emerald-300 text-sm"
                                            >
                                                {ex}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Tips */}
                                {selectedLesson.tips && selectedLesson.tips.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                            Tips
                                        </h3>
                                        <div className="space-y-2">
                                            {selectedLesson.tips.map((tip, i) => (
                                                <div
                                                    key={i}
                                                    className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 rounded-xl text-amber-800 dark:text-amber-300 text-sm"
                                                >
                                                    {tip}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Action Button */}
                                <Link
                                    href={`/quiz?lesson=${selectedLesson.id}`}
                                    className="block w-full bg-indigo-500 hover:bg-indigo-600 text-white py-4 rounded-xl font-semibold text-center transition-colors"
                                >
                                    Take Quiz
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Lessons List */}
                <div className="space-y-3">
                    {filteredLessons.map((lesson) => (
                        <button
                            key={lesson.id}
                            onClick={() => setSelectedLesson(lesson)}
                            className="w-full bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-800"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`w-2 h-2 rounded-full ${categoryColors[lesson.category]}`} />
                                        <span className="text-xs text-zinc-500">{lesson.category}</span>
                                    </div>
                                    <h3 className="font-medium text-zinc-900 dark:text-white">
                                        {lesson.title}
                                    </h3>
                                    <p className="text-sm text-zinc-500 mt-1">
                                        {lesson.examples.length} examples
                                    </p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-zinc-400 flex-shrink-0 ml-3" />
                            </div>
                        </button>
                    ))}
                </div>

                {/* Count */}
                <p className="text-center text-sm text-zinc-500 mt-6">
                    {filteredLessons.length} lesson{filteredLessons.length !== 1 ? 's' : ''}
                </p>
            </main>
        </div>
    );
}
