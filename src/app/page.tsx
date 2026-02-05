'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Check, Star, Sparkles, Zap, Globe, Mic, LayoutDashboard } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SITE_CONFIG, FEATURES, PRICING_PLANS, TESTIMONIALS, STATS } from '@/lib/constants';
import { useAuth } from '@/components/providers/AuthProvider';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b]" style={{ width: '100%', minWidth: '100vw', margin: 0, padding: 0 }}>
      {/* Background Gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.15), transparent),
            radial-gradient(ellipse 60% 40% at 100% 0%, rgba(139, 92, 246, 0.1), transparent),
            radial-gradient(ellipse 60% 40% at 0% 100%, rgba(34, 211, 238, 0.08), transparent)
          `
        }}
      />

      <Navbar />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 lg:pt-40 pb-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Sparkles size={16} />
                AI-Powered Language Learning
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8"
            >
              <span className="bg-gradient-to-r from-zinc-900 via-indigo-600 to-cyan-600 dark:from-white dark:via-indigo-200 dark:to-cyan-200 bg-clip-text text-transparent">
                Master English
              </span>
              <br />
              <span className="text-zinc-900 dark:text-white">Naturally with AI</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-12"
            >
              Practice speaking English with an AI teacher that feels human.
              Get instant feedback, build confidence, and become fluent faster.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              {isLoading ? (
                <div className="h-14 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
              ) : user ? (
                // Signed in - show dashboard CTA
                <>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
                  >
                    <LayoutDashboard size={20} />
                    Go to Dashboard
                  </Link>
                  <Link
                    href="/voice"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                  >
                    <Mic size={20} />
                    Start Practice
                  </Link>
                </>
              ) : (
                // Not signed in - show signup CTA
                <>
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
                  >
                    Start Practicing Free
                    <ArrowRight size={20} />
                  </Link>
                  <Link
                    href="/features"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                  >
                    <Play size={20} />
                    Watch Demo
                  </Link>
                </>
              )}
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-8 text-sm text-zinc-600 dark:text-zinc-500"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-white dark:border-zinc-900"
                    />
                  ))}
                </div>
                <span className="text-zinc-600 dark:text-zinc-400">50K+ learners</span>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                ))}
                <span className="text-zinc-600 dark:text-zinc-400 ml-1">4.9 rating</span>
              </div>
            </motion.div>
          </div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-5xl mx-auto mt-20"
          >
            <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur shadow-xl dark:shadow-none">
              <div className="aspect-[16/9] p-6 flex gap-6">
                {/* Video Area */}
                <div className="flex-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mx-auto mb-6 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                      <Mic size={48} className="text-white" />
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 text-lg">AI Teacher Ready</p>
                  </div>
                </div>
                {/* Chat Area */}
                <div className="w-[320px] hidden md:flex flex-col bg-zinc-100 dark:bg-zinc-800/30 rounded-xl p-5">
                  <div className="space-y-4 flex-1">
                    <div className="bg-zinc-200 dark:bg-zinc-700/50 rounded-2xl rounded-tl-sm p-4 text-sm text-zinc-800 dark:text-zinc-200">
                      Hello! I&apos;m Alex, your AI English teacher. What would you like to practice today?
                    </div>
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl rounded-tr-sm p-4 text-sm text-white ml-auto max-w-[80%]">
                      I want to practice for a job interview.
                    </div>
                    <div className="bg-zinc-200 dark:bg-zinc-700/50 rounded-2xl rounded-tl-sm p-4 text-sm text-zinc-800 dark:text-zinc-200">
                      Great choice! Let&apos;s start with a common question: Tell me about yourself.
                    </div>
                  </div>
                </div>
              </div>
              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-6 border-y border-zinc-200 dark:border-zinc-800/50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {STATS.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-zinc-600 dark:text-zinc-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-6">
                <Zap size={16} />
                Features
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-zinc-900 dark:text-white">
                Everything you need to{' '}
                <span className="bg-gradient-to-r from-indigo-500 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  become fluent
                </span>
              </h2>
              <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                Our AI-powered platform provides all the tools you need to master English
                through natural conversation practice.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm dark:shadow-none"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                    <span className="text-white">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-white">{feature.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-6 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6">
                <Globe size={16} />
                How it works
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white">
                Start speaking in{' '}
                <span className="bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  3 simple steps
                </span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  step: '01',
                  title: 'Choose a Topic',
                  description: 'Select from job interviews, casual chat, travel, or any topic you want to practice.'
                },
                {
                  step: '02',
                  title: 'Start Talking',
                  description: 'Speak naturally with our AI teacher. Just like a real conversation, no scripts needed.'
                },
                {
                  step: '03',
                  title: 'Get Better',
                  description: 'Receive instant feedback on grammar, vocabulary, and pronunciation to improve faster.'
                }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="text-center"
                >
                  <div className="text-7xl font-bold text-zinc-200 dark:text-zinc-800 mb-4">{item.step}</div>
                  <h3 className="text-2xl font-semibold mb-3 text-zinc-900 dark:text-white">{item.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6">
                <Sparkles size={16} />
                Pricing
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-zinc-900 dark:text-white">
                Simple,{' '}
                <span className="bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  transparent pricing
                </span>
              </h2>
              <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                Start free and upgrade when you&apos;re ready. No hidden fees, cancel anytime.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {PRICING_PLANS.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-8 rounded-2xl border ${
                    plan.popular
                      ? 'bg-indigo-500/5 border-indigo-500/30 relative'
                      : 'bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-semibold mb-2 text-zinc-900 dark:text-white">{plan.name}</h3>
                  <p className="text-zinc-600 dark:text-zinc-500 text-sm mb-6">{plan.description}</p>
                  <div className="mb-8">
                    <span className="text-5xl font-bold text-zinc-900 dark:text-white">{plan.price}</span>
                    <span className="text-zinc-600 dark:text-zinc-500">/{plan.period}</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check size={20} className="text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-zinc-700 dark:text-zinc-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.popular ? '/signup' : '/voice'}
                    className={`block text-center py-3 px-6 rounded-xl font-medium transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 px-6 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-6">
                <Star size={16} />
                Testimonials
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white">
                Loved by{' '}
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                  learners worldwide
                </span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 mb-6 text-lg">&ldquo;{testimonial.content}&rdquo;</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600" />
                    <div>
                      <div className="font-semibold text-zinc-900 dark:text-white">{testimonial.name}</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-500">{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center p-12 rounded-3xl bg-gradient-to-b from-zinc-100 to-zinc-50 dark:from-zinc-800/50 dark:to-zinc-900/50 border border-zinc-200 dark:border-zinc-800 shadow-lg dark:shadow-none"
            >
              {user ? (
                // Signed in user CTA
                <>
                  <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-zinc-900 dark:text-white">
                    Continue your{' '}
                    <span className="bg-gradient-to-r from-indigo-500 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent">
                      journey
                    </span>
                  </h2>
                  <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-xl mx-auto">
                    Welcome back! Ready to continue improving your English skills?
                    Your AI teacher is waiting for you.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
                    >
                      <LayoutDashboard size={20} />
                      Go to Dashboard
                    </Link>
                    <Link
                      href="/voice"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                    >
                      <Mic size={20} />
                      Quick Practice
                    </Link>
                  </div>
                </>
              ) : (
                // Guest user CTA
                <>
                  <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-zinc-900 dark:text-white">
                    Ready to become{' '}
                    <span className="bg-gradient-to-r from-indigo-500 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent">
                      fluent
                    </span>
                    ?
                  </h2>
                  <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-xl mx-auto">
                    Join thousands of learners who are already improving their English
                    with {SITE_CONFIG.name}. Start your free practice session today.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/signup"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
                    >
                      Get Started Free
                      <ArrowRight size={20} />
                    </Link>
                    <Link
                      href="/pricing"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                    >
                      View Pricing
                    </Link>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
