'use client';

import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SITE_CONFIG } from '@/lib/constants';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b]">
      <Navbar />

      <main className="pt-24 pb-16">
        <section className="px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6">
                <Shield size={16} />
                Privacy Policy
              </div>
              <h1 className="text-4xl font-bold mb-4 text-zinc-900 dark:text-white">Privacy Policy</h1>
              <p className="text-zinc-500">Last updated: January 2024</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="prose prose-zinc dark:prose-invert max-w-none"
            >
              <div className="space-y-8 text-zinc-600 dark:text-zinc-400">
                <section>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">1. Introduction</h2>
                  <p>
                    Welcome to {SITE_CONFIG.name}. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">2. Information We Collect</h2>
                  <p className="mb-3">We collect information you provide directly to us, including:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Account information (name, email address)</li>
                    <li>Voice recordings during practice sessions (processed in real-time, not stored)</li>
                    <li>Learning progress and session history</li>
                    <li>Communication preferences</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">3. How We Use Your Information</h2>
                  <p className="mb-3">We use the information we collect to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Personalize your learning experience</li>
                    <li>Track your progress and provide feedback</li>
                    <li>Send you updates and promotional communications (with your consent)</li>
                    <li>Respond to your questions and support requests</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">4. Voice Data</h2>
                  <p>
                    Your voice recordings are processed in real-time to provide speech-to-text functionality. We do not permanently store your voice recordings. Audio data is processed and immediately discarded after transcription.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">5. Data Security</h2>
                  <p>
                    We implement appropriate security measures to protect your personal information. This includes encryption of data in transit and at rest, regular security assessments, and access controls.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">6. Data Sharing</h2>
                  <p>
                    We do not sell your personal information. We may share your data with trusted service providers who help us operate our platform, subject to confidentiality agreements.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">7. Your Rights</h2>
                  <p className="mb-3">You have the right to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access your personal data</li>
                    <li>Correct inaccurate data</li>
                    <li>Request deletion of your data</li>
                    <li>Export your data</li>
                    <li>Opt out of marketing communications</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">8. Contact Us</h2>
                  <p>
                    If you have questions about this privacy policy or our data practices, please contact us at{' '}
                    <a href="mailto:privacy@fluently.ai" className="text-indigo-500 hover:underline">privacy@fluently.ai</a>
                  </p>
                </section>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
