'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SITE_CONFIG } from '@/lib/constants';

const blogPosts = [
  {
    id: 1,
    title: '5 Tips to Improve Your English Speaking Confidence',
    excerpt: 'Speaking a new language can be intimidating. Here are practical tips to help you speak more confidently.',
    category: 'Learning Tips',
    date: '2024-01-15',
    readTime: '5 min read',
    image: '/blog/speaking-tips.jpg'
  },
  {
    id: 2,
    title: 'How AI is Transforming Language Learning',
    excerpt: 'Discover how artificial intelligence is making personalized language education accessible to everyone.',
    category: 'Technology',
    date: '2024-01-10',
    readTime: '7 min read',
    image: '/blog/ai-learning.jpg'
  },
  {
    id: 3,
    title: 'Common English Mistakes and How to Avoid Them',
    excerpt: 'Learn about the most frequent errors language learners make and get tips to overcome them.',
    category: 'Grammar',
    date: '2024-01-05',
    readTime: '6 min read',
    image: '/blog/common-mistakes.jpg'
  },
  {
    id: 4,
    title: 'The Best Ways to Practice English Daily',
    excerpt: 'Consistency is key to language learning. Here are easy ways to incorporate English into your daily routine.',
    category: 'Learning Tips',
    date: '2024-01-01',
    readTime: '4 min read',
    image: '/blog/daily-practice.jpg'
  }
];

export default function BlogPage() {
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
              <BookOpen size={16} />
              {SITE_CONFIG.name} Blog
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-6 text-zinc-900 dark:text-white"
            >
              Tips & Insights for{' '}
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Language Learners
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
            >
              Explore our articles on language learning tips, grammar guides, and insights on how to improve your English skills.
            </motion.p>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="px-6 pb-16">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {blogPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="group rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-indigo-500/50 transition-all"
                >
                  <div className="aspect-video bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                    <BookOpen size={48} className="text-indigo-500/50" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-medium">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-zinc-500">
                        <Clock size={12} />
                        {post.readTime}
                      </div>
                    </div>
                    <h2 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-zinc-500">
                        <Calendar size={12} />
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <span className="text-indigo-500 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read more <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Coming Soon */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 text-center p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800"
            >
              <p className="text-zinc-600 dark:text-zinc-400">
                More articles coming soon! Subscribe to stay updated.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
