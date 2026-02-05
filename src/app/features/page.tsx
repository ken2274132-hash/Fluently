'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Mic, Video, Brain, Zap, Shield, Globe, MessageSquare, BarChart3, Users, Headphones } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SITE_CONFIG } from '@/lib/constants';

const mainFeatures = [
  {
    icon: Mic,
    title: 'Natural Voice Conversations',
    description: 'Speak naturally and get instant responses. Our AI understands context, accents, and even hesitations - just like a real conversation partner.',
    gradient: 'from-violet-500 to-purple-500',
    features: ['Real-time speech recognition', 'Natural conversation flow', 'Works with any accent', 'No scripts required']
  },
  {
    icon: Video,
    title: 'Lifelike AI Avatar',
    description: 'Practice with a photorealistic AI teacher that responds with natural facial expressions, gestures, and body language.',
    gradient: 'from-blue-500 to-cyan-500',
    features: ['Photorealistic video', 'Natural expressions', 'Lip-sync technology', 'Professional appearance']
  },
  {
    icon: Brain,
    title: 'Intelligent Feedback',
    description: 'Get detailed corrections on grammar, vocabulary, and pronunciation. Learn not just what was wrong, but why and how to improve.',
    gradient: 'from-pink-500 to-rose-500',
    features: ['Grammar analysis', 'Vocabulary suggestions', 'Pronunciation tips', 'Contextual explanations']
  },
];

const additionalFeatures = [
  {
    icon: Zap,
    title: 'Instant Response',
    description: 'No awkward pauses. Our AI responds in milliseconds for a fluid, natural conversation experience.'
  },
  {
    icon: Shield,
    title: 'Safe Learning Space',
    description: 'Make mistakes without embarrassment. Practice freely in a supportive, judgment-free environment.'
  },
  {
    icon: Globe,
    title: 'Any Topic',
    description: 'From job interviews to casual chat, travel to business - practice the conversations that matter to you.'
  },
  {
    icon: MessageSquare,
    title: 'Text & Voice',
    description: 'Switch between text chat and voice seamlessly. Use whatever feels comfortable in the moment.'
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description: 'See your improvement over time with detailed analytics on fluency, accuracy, and vocabulary growth.'
  },
  {
    icon: Users,
    title: 'Multiple Scenarios',
    description: 'Role-play different situations with various personas - from friendly chat to formal business meetings.'
  },
  {
    icon: Headphones,
    title: '24/7 Availability',
    description: 'Practice anytime, anywhere. Your AI teacher is always ready when you are, with no scheduling needed.'
  },
];

export default function FeaturesPage() {
  return (
    <>
      <Navbar />

      <main className="relative z-10 pt-32 pb-20">
        {/* Header */}
        <section className="px-6 mb-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="badge badge-accent mb-4">
                <Sparkles size={14} />
                Features
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Everything you need to <span className="gradient-text">speak confidently</span>
              </h1>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-8">
                {SITE_CONFIG.name} combines cutting-edge AI with proven language learning
                methods to help you become fluent faster.
              </p>
              <Link href="/voice" className="btn-primary px-8 py-4">
                <span>Try It Free</span>
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Main Features */}
        <section className="px-6 mb-24">
          <div className="max-w-7xl mx-auto space-y-24">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}>
                    <feature.icon size={28} className="text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">{feature.title}</h2>
                  <p className="text-lg text-zinc-400 mb-6">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.features.map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.gradient}`} />
                        <span className="text-zinc-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="gradient-border p-1 rounded-2xl">
                    <div className="aspect-video bg-zinc-900 rounded-xl flex items-center justify-center">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                        <feature.icon size={40} className="text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Additional Features Grid */}
        <section className="px-6 py-24 bg-zinc-900/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">And so much more...</h2>
              <p className="text-zinc-400 max-w-xl mx-auto">
                Every feature designed to make your learning experience effective and enjoyable.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {additionalFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="feature-card"
                >
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center mb-4">
                    <feature.icon size={20} className="text-indigo-400" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-zinc-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="gradient-border p-12 rounded-2xl"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to start speaking?
              </h2>
              <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
                Join thousands of learners improving their English with {SITE_CONFIG.name}.
                Your first session is free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/voice" className="btn-primary px-8 py-4">
                  <span>Start Free Practice</span>
                  <ArrowRight size={18} />
                </Link>
                <Link href="/pricing" className="btn-secondary px-8 py-4">
                  View Pricing
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
