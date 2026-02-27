'use client';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SITE_CONFIG } from '@/lib/constants';

export default function TermsPage() {
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
                <FileText size={16} />
                Terms of Service
              </div>
              <h1 className="text-4xl font-bold mb-4 text-zinc-900 dark:text-white">Terms of Service</h1>
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
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
                  <p>
                    By accessing or using {SITE_CONFIG.name}, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">2. Description of Service</h2>
                  <p>
                    {SITE_CONFIG.name} is an AI-powered English learning platform that provides conversational practice through voice interactions with an AI teacher. Our service is designed to help users improve their English speaking skills.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">3. User Accounts</h2>
                  <p className="mb-3">When creating an account, you agree to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide accurate and complete information</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Notify us immediately of any unauthorized access</li>
                    <li>Be responsible for all activities under your account</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">4. Acceptable Use</h2>
                  <p className="mb-3">You agree not to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Use the service for any illegal purpose</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Interfere with or disrupt the service</li>
                    <li>Upload malicious content or spam</li>
                    <li>Impersonate others or misrepresent your identity</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">5. Intellectual Property</h2>
                  <p>
                    All content, features, and functionality of {SITE_CONFIG.name} are owned by us and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, or distribute our content without permission.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">6. AI-Generated Content</h2>
                  <p>
                    Our AI teacher generates responses based on machine learning models. While we strive for accuracy, AI-generated content may occasionally contain errors. The service is intended for educational purposes and should not be relied upon as the sole source of language instruction.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">7. Limitation of Liability</h2>
                  <p>
                    {SITE_CONFIG.name} is provided &quot;as is&quot; without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">8. Termination</h2>
                  <p>
                    We reserve the right to suspend or terminate your account at any time for violation of these terms. You may also delete your account at any time through your account settings.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">9. Changes to Terms</h2>
                  <p>
                    We may update these terms from time to time. We will notify you of significant changes by email or through the service. Continued use after changes constitutes acceptance of the new terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">10. Contact</h2>
                  <p>
                    For questions about these Terms of Service, please contact us at{' '}
                    <a href="mailto:legal@fluently.ai" className="text-indigo-500 hover:underline">legal@fluently.ai</a>
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
