'use client';

import { motion } from 'framer-motion';
import { Sparkles, Target, Heart, Users, Globe, Zap } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SITE_CONFIG } from '@/lib/constants';

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Student-First',
      description: 'Every feature we build starts with one question: how does this help learners succeed?'
    },
    {
      icon: Globe,
      title: 'Accessible Learning',
      description: 'Quality English education should be available to everyone, everywhere.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We leverage cutting-edge AI to create learning experiences that were impossible before.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Learning is better together. We foster a supportive community of learners.'
    }
  ];

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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6"
            >
              <Sparkles size={16} />
              About {SITE_CONFIG.name}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-6 text-zinc-900 dark:text-white"
            >
              Making English Learning{' '}
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Natural & Fun
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
            >
              {SITE_CONFIG.name} was born from a simple idea: learning a language should feel like having a conversation with a friend, not studying from a textbook.
            </motion.p>
          </div>
        </section>

        {/* Mission */}
        <section className="px-6 py-16 bg-zinc-50 dark:bg-zinc-900/30">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
                <Target size={32} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-white">Our Mission</h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                To empower millions of people around the world to communicate confidently in English through personalized, AI-powered conversation practice.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="px-6 py-16">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-white">Our Values</h2>
              <p className="text-zinc-600 dark:text-zinc-400">The principles that guide everything we do</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center mb-4">
                    <value.icon size={24} className="text-indigo-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">{value.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="px-6 py-16 bg-zinc-50 dark:bg-zinc-900/30">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6 text-zinc-900 dark:text-white text-center">Our Story</h2>
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed mb-4">
                  {SITE_CONFIG.name} started with a frustration many language learners know too well: despite years of studying English in school, speaking with native speakers still felt intimidating.
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed mb-4">
                  Traditional learning methods focus on grammar rules and vocabulary lists, but real fluency comes from practice - lots of it. The problem? Finding patient conversation partners who can help you improve is hard.
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
                  That&apos;s why we built {SITE_CONFIG.name}. Using the latest AI technology, we created an English teacher that&apos;s always available, infinitely patient, and adapts to your level. Whether you&apos;re preparing for a job interview or just want to chat, {SITE_CONFIG.name} is here to help you build confidence one conversation at a time.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
