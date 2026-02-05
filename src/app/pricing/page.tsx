'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Sparkles, HelpCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { PRICING_PLANS } from '@/lib/constants';

const faqs = [
  {
    question: 'Can I try Fluently for free?',
    answer: 'Yes! Our Free plan includes 5 voice sessions per month with basic grammar corrections. No credit card required.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and support payments in multiple currencies.'
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Absolutely. You can cancel your subscription at any time with no questions asked. Your access will continue until the end of your billing period.'
  },
  {
    question: 'Is there a discount for annual billing?',
    answer: 'Yes! When you choose annual billing, you save 20% compared to monthly payments. That\'s like getting 2+ months free.'
  },
  {
    question: 'What\'s included in the AI video avatar?',
    answer: 'Pro and Team plans include access to our lifelike AI teacher avatar that responds with natural facial expressions and body language, making your practice feel like a real conversation.'
  },
  {
    question: 'Can I switch plans later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. If you upgrade, you\'ll be charged the prorated difference. If you downgrade, the change takes effect at your next billing cycle.'
  },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />

      <main className="relative z-10 pt-32 pb-20">
        {/* Header */}
        <section className="px-6 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="badge mb-4">
                <Sparkles size={14} />
                Pricing
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Choose your path to <span className="gradient-text">fluency</span>
              </h1>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                Start free and upgrade when you&apos;re ready. All plans include our core
                AI conversation technology.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="px-6 mb-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {PRICING_PLANS.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`pricing-card ${plan.popular ? 'popular' : ''}`}
                >
                  <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                  <p className="text-zinc-500 text-sm mb-6">{plan.description}</p>
                  <div className="mb-8">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-zinc-500">/{plan.period}</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-zinc-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.name === 'Team' ? '/contact' : '/signup'}
                    className={`w-full ${plan.popular ? 'btn-primary' : 'btn-secondary'} justify-center py-4`}
                  >
                    <span>{plan.cta}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Compare plans</h2>
              <p className="text-zinc-400">See what&apos;s included in each plan</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card overflow-hidden"
            >
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left p-4 font-medium">Feature</th>
                    <th className="p-4 font-medium text-center">Free</th>
                    <th className="p-4 font-medium text-center text-indigo-400">Pro</th>
                    <th className="p-4 font-medium text-center">Team</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { feature: 'Voice sessions', free: '5/month', pro: 'Unlimited', team: 'Unlimited' },
                    { feature: 'Text chat', free: 'Unlimited', pro: 'Unlimited', team: 'Unlimited' },
                    { feature: 'AI video avatar', free: false, pro: true, team: true },
                    { feature: 'Grammar corrections', free: 'Basic', pro: 'Advanced', team: 'Advanced' },
                    { feature: 'Progress tracking', free: false, pro: true, team: true },
                    { feature: 'Custom topics', free: false, pro: true, team: true },
                    { feature: 'Team members', free: '1', pro: '1', team: 'Up to 10' },
                    { feature: 'Admin dashboard', free: false, pro: false, team: true },
                    { feature: 'API access', free: false, pro: false, team: true },
                    { feature: 'Priority support', free: false, pro: true, team: 'Dedicated' },
                  ].map((row, i) => (
                    <tr key={row.feature} className={i !== 0 ? 'border-t border-zinc-800/50' : ''}>
                      <td className="p-4 text-zinc-300">{row.feature}</td>
                      <td className="p-4 text-center">
                        {typeof row.free === 'boolean' ? (
                          row.free ? <Check size={18} className="text-emerald-400 mx-auto" /> : <span className="text-zinc-600">-</span>
                        ) : (
                          <span className="text-zinc-400">{row.free}</span>
                        )}
                      </td>
                      <td className="p-4 text-center bg-indigo-500/5">
                        {typeof row.pro === 'boolean' ? (
                          row.pro ? <Check size={18} className="text-emerald-400 mx-auto" /> : <span className="text-zinc-600">-</span>
                        ) : (
                          <span className="text-zinc-300">{row.pro}</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {typeof row.team === 'boolean' ? (
                          row.team ? <Check size={18} className="text-emerald-400 mx-auto" /> : <span className="text-zinc-600">-</span>
                        ) : (
                          <span className="text-zinc-400">{row.team}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="badge mb-4">
                <HelpCircle size={14} />
                FAQ
              </span>
              <h2 className="text-3xl font-bold mb-4">Frequently asked questions</h2>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.details
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card group"
                >
                  <summary className="p-4 cursor-pointer flex items-center justify-between font-medium hover:text-indigo-400 transition-colors">
                    {faq.question}
                    <span className="text-zinc-500 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="px-4 pb-4 text-zinc-400 text-sm">
                    {faq.answer}
                  </div>
                </motion.details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
