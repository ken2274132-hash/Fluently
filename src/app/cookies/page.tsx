'use client';

import { motion } from 'framer-motion';
import { Cookie } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SITE_CONFIG } from '@/lib/constants';

export default function CookiesPage() {
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
                <Cookie size={16} />
                Cookie Policy
              </div>
              <h1 className="text-4xl font-bold mb-4 text-zinc-900 dark:text-white">Cookie Policy</h1>
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
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">What Are Cookies?</h2>
                  <p>
                    Cookies are small text files that are stored on your device when you visit a website. They help websites remember your preferences and improve your browsing experience.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">How We Use Cookies</h2>
                  <p className="mb-3">{SITE_CONFIG.name} uses cookies for the following purposes:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Essential Cookies:</strong> Required for the website to function properly, including authentication and security.</li>
                    <li><strong>Preference Cookies:</strong> Remember your settings and preferences (e.g., language, theme).</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website so we can improve it.</li>
                    <li><strong>Performance Cookies:</strong> Monitor and improve the performance of our service.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">Types of Cookies We Use</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-200 dark:border-zinc-700">
                          <th className="text-left py-3 pr-4 text-zinc-900 dark:text-white">Cookie Name</th>
                          <th className="text-left py-3 pr-4 text-zinc-900 dark:text-white">Purpose</th>
                          <th className="text-left py-3 text-zinc-900 dark:text-white">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-zinc-200 dark:border-zinc-700">
                          <td className="py-3 pr-4">session_token</td>
                          <td className="py-3 pr-4">Authentication</td>
                          <td className="py-3">Session</td>
                        </tr>
                        <tr className="border-b border-zinc-200 dark:border-zinc-700">
                          <td className="py-3 pr-4">preferences</td>
                          <td className="py-3 pr-4">User settings</td>
                          <td className="py-3">1 year</td>
                        </tr>
                        <tr className="border-b border-zinc-200 dark:border-zinc-700">
                          <td className="py-3 pr-4">analytics_id</td>
                          <td className="py-3 pr-4">Analytics</td>
                          <td className="py-3">2 years</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">Third-Party Cookies</h2>
                  <p>
                    We may use third-party services that set their own cookies, such as analytics providers. These cookies are governed by the respective third party&apos;s privacy policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">Managing Cookies</h2>
                  <p className="mb-3">
                    You can control and manage cookies in several ways:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Browser Settings:</strong> Most browsers allow you to refuse or delete cookies through their settings.</li>
                    <li><strong>Our Cookie Settings:</strong> You can adjust your cookie preferences in your account settings.</li>
                    <li><strong>Opt-Out Links:</strong> For analytics cookies, you can use opt-out tools provided by the analytics services.</li>
                  </ul>
                  <p className="mt-3">
                    Note that disabling certain cookies may affect the functionality of our service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">Updates to This Policy</h2>
                  <p>
                    We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">Contact Us</h2>
                  <p>
                    If you have questions about our use of cookies, please contact us at{' '}
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
