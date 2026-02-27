'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Mic,
  Video,
  Brain,
  Zap,
  Shield,
  Globe,
  MessageSquare,
  BarChart3,
  Users,
  Headphones,
  Check,
  Play,
  Volume2,
  User
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SITE_CONFIG } from '@/lib/constants';

const mainFeatures = [
  {
    icon: Mic,
    title: 'Voice Conversations',
    description: 'Speak naturally and get instant AI responses. Practice real conversations without scripts - just talk like you would with a friend.',
    gradient: 'from-indigo-500 to-purple-500',
    image: '🎙️',
    features: [
      'Real-time speech recognition',
      'Natural conversation flow',
      'Works with any accent',
      'Instant AI responses'
    ]
  },
  {
    icon: User,
    title: '3D Avatar Teacher',
    description: 'Meet Sara, your animated 3D English teacher. Watch her respond with realistic lip-sync, expressions, and natural movements.',
    gradient: 'from-emerald-500 to-teal-500',
    image: '👩‍🏫',
    features: [
      'Animated 3D character',
      'Real-time lip sync',
      'Natural head movements',
      'Eye contact & blinking'
    ]
  },
  {
    icon: Brain,
    title: 'Smart Corrections',
    description: 'Get gentle, encouraging feedback on your grammar and vocabulary. Learn from mistakes without feeling embarrassed.',
    gradient: 'from-pink-500 to-rose-500',
    image: '🧠',
    features: [
      'Grammar corrections',
      'Vocabulary suggestions',
      'Contextual feedback',
      'Encouraging tone'
    ]
  },
];

const additionalFeatures = [
  {
    icon: Zap,
    title: 'Instant Response',
    description: 'No waiting. Get immediate AI responses for smooth, natural conversations.',
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    icon: Shield,
    title: 'Safe Space',
    description: 'Practice without judgment. Make mistakes freely and learn at your own pace.',
    gradient: 'from-emerald-500 to-green-500'
  },
  {
    icon: Globe,
    title: 'Multiple Topics',
    description: 'Job interviews, casual chat, travel, grammar - practice what matters to you.',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: MessageSquare,
    title: 'Text & Voice',
    description: 'Switch between typing and speaking whenever you feel comfortable.',
    gradient: 'from-violet-500 to-purple-500'
  },
  {
    icon: Volume2,
    title: 'Natural Voice',
    description: 'High-quality AI voice that sounds natural and clear.',
    gradient: 'from-pink-500 to-rose-500'
  },
  {
    icon: Headphones,
    title: 'Always Available',
    description: 'Practice anytime, anywhere. Your AI teacher never sleeps.',
    gradient: 'from-indigo-500 to-blue-500'
  },
];

const howItWorks = [
  {
    step: '1',
    title: 'Choose Your Topic',
    description: 'Select from casual chat, job interview prep, travel, or grammar practice.'
  },
  {
    step: '2',
    title: 'Start Talking',
    description: 'Press and hold the mic button to speak. Just talk naturally!'
  },
  {
    step: '3',
    title: 'Get Feedback',
    description: 'Sara responds with helpful feedback and keeps the conversation going.'
  },
  {
    step: '4',
    title: 'Improve Daily',
    description: 'Practice regularly and watch your confidence grow.'
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b]">
      <Navbar />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6">
                <Sparkles size={16} />
                Features
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-zinc-900 dark:text-white">
                Everything you need to{' '}
                <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  speak confidently
                </span>
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
                {SITE_CONFIG.name} combines AI technology with natural conversation practice
                to help you become fluent faster.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
                >
                  <Play size={18} />
                  Start Free
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                >
                  View Pricing
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Features */}
        <section className="px-6 py-16">
          <div className="max-w-6xl mx-auto space-y-24">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                    <feature.icon size={28} className="text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-zinc-900 dark:text-white">
                    {feature.title}
                  </h2>
                  <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.features.map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center`}>
                          <Check size={12} className="text-white" />
                        </div>
                        <span className="text-zinc-700 dark:text-zinc-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-20 blur-3xl rounded-3xl`} />
                    <div className="relative aspect-video bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center overflow-hidden">
                      <span className="text-8xl">{feature.image}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="px-6 py-16 bg-zinc-50 dark:bg-zinc-900/30">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-zinc-900 dark:text-white">
                How It Works
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
                Getting started is easy. Just four simple steps to better English.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-6">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                    {step.step}
                  </div>
                  <h3 className="font-semibold mb-2 text-zinc-900 dark:text-white">{step.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Features Grid */}
        <section className="px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-zinc-900 dark:text-white">
                And much more...
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
                Every feature designed to make your learning effective and enjoyable.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                    <feature.icon size={24} className="text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 text-zinc-900 dark:text-white">{feature.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-12 text-center"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  Ready to start speaking?
                </h2>
                <p className="text-indigo-100 mb-8 max-w-xl mx-auto">
                  Join learners improving their English with {SITE_CONFIG.name}.
                  It&apos;s completely free during beta!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-indigo-600 font-medium hover:bg-zinc-100 transition-all"
                  >
                    <Play size={18} />
                    Get Started Free
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-all border border-white/20"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
