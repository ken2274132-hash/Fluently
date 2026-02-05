import { Coffee, Briefcase, Plane, BookOpen, Mic, Video, Brain, Zap, Shield, Globe, Clock, Star } from 'lucide-react';
import { createElement } from 'react';

export interface Topic {
    id: string;
    label: string;
    icon: React.ReactNode;
    prompt: string;
    color: string;
    gradient: string;
}

export const TOPICS: Topic[] = [
    {
        id: 'casual',
        label: 'Casual Chat',
        icon: createElement(Coffee, { size: 18 }),
        prompt: "Hello teacher! I'm starting a new session. Please introduce yourself and let's have a casual conversation.",
        color: 'bg-orange-500/20 text-orange-400',
        gradient: 'from-orange-500 to-amber-500'
    },
    {
        id: 'work',
        label: 'Job Interview',
        icon: createElement(Briefcase, { size: 18 }),
        prompt: "Hello teacher! I'm starting a new session. Please introduce yourself and help me practice for a job interview.",
        color: 'bg-blue-500/20 text-blue-400',
        gradient: 'from-blue-500 to-indigo-500'
    },
    {
        id: 'travel',
        label: 'Travel Planning',
        icon: createElement(Plane, { size: 18 }),
        prompt: "Hello teacher! I'm starting a new session. Please introduce yourself and help me practice travel conversations.",
        color: 'bg-emerald-500/20 text-emerald-400',
        gradient: 'from-emerald-500 to-teal-500'
    },
    {
        id: 'grammar',
        label: 'Grammar Pro',
        icon: createElement(BookOpen, { size: 18 }),
        prompt: "Hello teacher! I'm starting a new session. Please introduce yourself and help me practice my grammar.",
        color: 'bg-purple-500/20 text-purple-400',
        gradient: 'from-purple-500 to-pink-500'
    },
];

export const SITE_CONFIG = {
    name: 'Fluently',
    tagline: 'Master English Naturally with AI',
    description: 'Practice English with an AI teacher that feels human. Get instant feedback, improve fluency, and build confidence through immersive conversations.',
    url: 'https://fluently.ai',
    colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#22d3ee',
    }
};

export const FEATURES = [
    {
        icon: createElement(Mic, { size: 24 }),
        title: 'Voice Conversations',
        description: 'Practice speaking naturally with real-time voice interaction and instant pronunciation feedback.',
        gradient: 'from-violet-500 to-purple-500'
    },
    {
        icon: createElement(Video, { size: 24 }),
        title: 'AI Video Avatar',
        description: 'Learn with a lifelike AI teacher that responds with natural expressions and body language.',
        gradient: 'from-blue-500 to-cyan-500'
    },
    {
        icon: createElement(Brain, { size: 24 }),
        title: 'Smart Corrections',
        description: 'Get intelligent grammar and vocabulary corrections that help you learn from mistakes.',
        gradient: 'from-pink-500 to-rose-500'
    },
    {
        icon: createElement(Zap, { size: 24 }),
        title: 'Instant Response',
        description: 'No waiting around. Get immediate responses for a fluid, natural conversation flow.',
        gradient: 'from-amber-500 to-orange-500'
    },
    {
        icon: createElement(Shield, { size: 24 }),
        title: 'Safe Environment',
        description: 'Practice without judgment. Make mistakes freely in a supportive learning space.',
        gradient: 'from-emerald-500 to-teal-500'
    },
    {
        icon: createElement(Globe, { size: 24 }),
        title: 'Any Topic',
        description: 'From job interviews to casual chat, practice the conversations that matter to you.',
        gradient: 'from-indigo-500 to-blue-500'
    },
];

export const PRICING_PLANS = [
    {
        name: 'Free',
        price: '$0',
        period: 'forever',
        description: 'Perfect for trying out Fluently',
        features: [
            '5 voice sessions per month',
            'Basic grammar corrections',
            'Text chat unlimited',
            'Community support',
        ],
        cta: 'Get Started',
        popular: false,
    },
    {
        name: 'Pro',
        price: '$19',
        period: 'per month',
        description: 'For serious language learners',
        features: [
            'Unlimited voice sessions',
            'AI video avatar access',
            'Advanced corrections & feedback',
            'Progress tracking',
            'Priority support',
            'Custom topics',
        ],
        cta: 'Start Pro Trial',
        popular: true,
    },
    {
        name: 'Team',
        price: '$49',
        period: 'per month',
        description: 'For teams and organizations',
        features: [
            'Everything in Pro',
            'Up to 10 team members',
            'Admin dashboard',
            'Team analytics',
            'API access',
            'Dedicated support',
        ],
        cta: 'Contact Sales',
        popular: false,
    },
];

export const TESTIMONIALS = [
    {
        name: 'Sarah Chen',
        role: 'Software Engineer',
        image: '/testimonials/sarah.jpg',
        content: 'Fluently helped me ace my English interview at Google. The job interview practice mode is incredibly realistic.',
        rating: 5,
    },
    {
        name: 'Marco Silva',
        role: 'Business Analyst',
        image: '/testimonials/marco.jpg',
        content: 'I went from broken English to confident presentations in 3 months. The instant feedback is a game-changer.',
        rating: 5,
    },
    {
        name: 'Yuki Tanaka',
        role: 'Student',
        image: '/testimonials/yuki.jpg',
        content: 'No more anxiety about speaking English. The AI teacher is patient and never makes me feel embarrassed.',
        rating: 5,
    },
];

export const STATS = [
    { value: '50K+', label: 'Active Learners' },
    { value: '2M+', label: 'Conversations' },
    { value: '4.9', label: 'App Rating' },
    { value: '95%', label: 'Improvement Rate' },
];

export const NAV_LINKS = [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/voice', label: 'Try Free' },
];
