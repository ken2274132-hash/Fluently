'use client';

import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, ArrowRight, Heart, Zap, Users } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SITE_CONFIG } from '@/lib/constants';

const openPositions = [
  {
    id: 1,
    title: 'Senior Full Stack Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time'
  },
  {
    id: 2,
    title: 'AI/ML Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time'
  },
  {
    id: 3,
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time'
  },
  {
    id: 4,
    title: 'Content Writer (ESL)',
    department: 'Content',
    location: 'Remote',
    type: 'Part-time'
  }
];

const benefits = [
  {
    icon: Heart,
    title: 'Health & Wellness',
    description: 'Comprehensive health coverage and wellness programs'
  },
  {
    icon: Zap,
    title: 'Flexible Work',
    description: '100% remote with flexible hours'
  },
  {
    icon: Users,
    title: 'Learning Budget',
    description: 'Annual budget for courses and conferences'
  }
];

export default function CareersPage() {
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
              <Briefcase size={16} />
              Join Our Team
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-6 text-zinc-900 dark:text-white"
            >
              Help Us Build the Future of{' '}
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Language Learning
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
            >
              We&apos;re looking for passionate people who want to make education accessible to everyone. Join us in our mission to help millions learn English.
            </motion.p>
          </div>
        </section>

        {/* Benefits */}
        <section className="px-6 py-12 bg-zinc-50 dark:bg-zinc-900/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8 text-zinc-900 dark:text-white">Why Work at {SITE_CONFIG.name}?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="p-6 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon size={24} className="text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 text-zinc-900 dark:text-white">{benefit.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-center mb-8 text-zinc-900 dark:text-white"
            >
              Open Positions
            </motion.h2>

            <div className="space-y-4">
              {openPositions.map((position, index) => (
                <motion.div
                  key={position.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-6 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                        {position.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Briefcase size={14} />
                          {position.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {position.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {position.type}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="text-zinc-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* No positions message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 text-center p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800"
            >
              <p className="text-zinc-600 dark:text-zinc-400 mb-2">
                Don&apos;t see a role that fits? We&apos;re always looking for talented people.
              </p>
              <p className="text-sm text-zinc-500">
                Send your resume to <span className="text-indigo-500">careers@fluently.ai</span>
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
