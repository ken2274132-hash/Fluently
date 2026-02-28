"use client";

import { useState, useEffect, Suspense, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { flashcards } from "@/data/lessons";
import { ArrowLeft, RotateCcw, ChevronLeft, ChevronRight, X, Check } from "lucide-react";

function FlashcardsContent() {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get("category");

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
    const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
    const [learningCards, setLearningCards] = useState<Set<string>>(new Set());
    const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

    // Touch handling for swipe
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);

    const categories = [...new Set(flashcards.map(f => f.category))];

    const filteredCards = selectedCategory
        ? flashcards.filter(f => f.category === selectedCategory)
        : flashcards;

    // Shuffle cards
    const [shuffledCards, setShuffledCards] = useState<typeof flashcards>([]);

    // Load saved progress from localStorage
    useEffect(() => {
        const savedProgress = localStorage.getItem('flashcardStats');
        if (savedProgress) {
            const parsed = JSON.parse(savedProgress);
            setKnownCards(new Set(parsed.knownCards || []));
            setLearningCards(new Set(parsed.learningCards || []));
        }
    }, []);

    // Save progress to localStorage
    const saveProgress = useCallback(() => {
        localStorage.setItem('flashcardStats', JSON.stringify({
            knownCards: Array.from(knownCards),
            learningCards: Array.from(learningCards),
            lastStudyDate: new Date().toISOString()
        }));
    }, [knownCards, learningCards]);

    useEffect(() => {
        if (knownCards.size > 0 || learningCards.size > 0) {
            saveProgress();
        }
    }, [knownCards, learningCards, saveProgress]);

    useEffect(() => {
        const shuffled = [...filteredCards].sort(() => Math.random() - 0.5);
        setShuffledCards(shuffled);
        setCurrentIndex(0);
        setIsFlipped(false);
    }, [selectedCategory]);

    // Touch handlers for swipe gestures
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const diff = touchStartX.current - touchEndX.current;
        const threshold = 75;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swiped left - Still Learning
                handleSwipeLeft();
            } else {
                // Swiped right - Got It
                handleSwipeRight();
            }
        }
    };

    const handleSwipeLeft = () => {
        setSwipeDirection('left');
        setTimeout(() => {
            handleLearning();
            setSwipeDirection(null);
        }, 300);
    };

    const handleSwipeRight = () => {
        setSwipeDirection('right');
        setTimeout(() => {
            handleKnown();
            setSwipeDirection(null);
        }, 300);
    };

    const currentCard = shuffledCards[currentIndex];

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleNext = () => {
        if (currentIndex < shuffledCards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsFlipped(false);
        }
    };

    const handleKnown = () => {
        if (currentCard) {
            setKnownCards(new Set([...knownCards, currentCard.id]));
            learningCards.delete(currentCard.id);
            setLearningCards(new Set(learningCards));
        }
        handleNext();
    };

    const handleLearning = () => {
        if (currentCard) {
            setLearningCards(new Set([...learningCards, currentCard.id]));
            knownCards.delete(currentCard.id);
            setKnownCards(new Set(knownCards));
        }
        handleNext();
    };

    const handleShuffle = () => {
        const shuffled = [...filteredCards].sort(() => Math.random() - 0.5);
        setShuffledCards(shuffled);
        setCurrentIndex(0);
        setIsFlipped(false);
    };

    if (shuffledCards.length === 0) {
        return (
            <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
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
                        {currentIndex + 1} / {shuffledCards.length}
                    </span>
                    <button onClick={handleShuffle} className="p-2 -mr-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                        <RotateCcw className="w-5 h-5" />
                    </button>
                </div>
                {/* Progress */}
                <div className="h-1 bg-zinc-100 dark:bg-zinc-800">
                    <div
                        className="h-full bg-purple-500 transition-all duration-300"
                        style={{ width: `${((currentIndex + 1) / shuffledCards.length) * 100}%` }}
                    />
                </div>
            </header>

            <main className="max-w-lg mx-auto px-4 py-6">
                {/* Category Pills - Scrollable */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                            !selectedCategory
                                ? "bg-purple-500 text-white"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        }`}
                    >
                        All
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                selectedCategory === cat
                                    ? "bg-purple-500 text-white"
                                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Flashcard - Simpler design */}
                <div
                    className="mb-6"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        onClick={handleFlip}
                        className={`relative w-full aspect-[4/3] cursor-pointer transition-all duration-500 ${
                            swipeDirection === 'left' ? 'animate-swipe-left' :
                            swipeDirection === 'right' ? 'animate-swipe-right' : ''
                        }`}
                        style={{
                            transformStyle: "preserve-3d",
                            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
                        }}
                    >
                        {/* Front */}
                        <div
                            className="absolute inset-0 rounded-2xl p-6 flex flex-col items-center justify-center bg-purple-500"
                            style={{ backfaceVisibility: "hidden" }}
                        >
                            <span className="text-sm text-purple-200 mb-2">{currentCard?.category}</span>
                            <h2 className="text-2xl font-bold text-white text-center">
                                {currentCard?.front}
                            </h2>
                            <p className="absolute bottom-4 text-purple-200 text-sm">Tap to see answer</p>
                        </div>

                        {/* Back */}
                        <div
                            className="absolute inset-0 bg-white dark:bg-zinc-900 rounded-2xl p-6 flex flex-col items-center justify-center border-2 border-zinc-200 dark:border-zinc-700"
                            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                        >
                            <span className="text-sm text-purple-500 mb-2">Answer</span>
                            <p className="text-xl text-zinc-900 dark:text-white text-center font-medium">
                                {currentCard?.back}
                            </p>
                            <p className="absolute bottom-4 text-zinc-400 text-sm">Tap to flip back</p>
                        </div>
                    </div>
                </div>

                {/* Simple Action Buttons */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={handleLearning}
                        className="flex-1 py-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold flex items-center justify-center gap-2 border-2 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                        <X className="w-5 h-5" />
                        Learning
                    </button>
                    <button
                        onClick={handleKnown}
                        className="flex-1 py-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center gap-2 border-2 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                    >
                        <Check className="w-5 h-5" />
                        Got it
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className={`p-3 rounded-xl transition-colors ${
                            currentIndex === 0
                                ? "text-zinc-300 dark:text-zinc-700"
                                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        }`}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={currentIndex === shuffledCards.length - 1}
                        className={`p-3 rounded-xl transition-colors ${
                            currentIndex === shuffledCards.length - 1
                                ? "text-zinc-300 dark:text-zinc-700"
                                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        }`}
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                {/* Simple Stats */}
                <div className="flex justify-center gap-8 text-sm">
                    <div className="text-center">
                        <div className="font-bold text-emerald-500">{knownCards.size}</div>
                        <div className="text-zinc-500">Know</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-red-500">{learningCards.size}</div>
                        <div className="text-zinc-500">Learning</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-zinc-600 dark:text-zinc-400">{shuffledCards.length - knownCards.size - learningCards.size}</div>
                        <div className="text-zinc-500">Left</div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function FlashcardsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
            </div>
        }>
            <FlashcardsContent />
        </Suspense>
    );
}
