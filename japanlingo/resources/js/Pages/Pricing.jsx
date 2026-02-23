import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import Card from '@/Components/UI/Card';
import GuestNavbar from '@/Components/Layout/GuestNavbar';
import Footer from '@/Components/Layout/GuestFooter';

const plans = [
  {
    name: 'Basic',
    price: 'Free',
    period: '',
    desc: 'Essential tools for beginners starting their journey.',
    cta: 'Start for Free',
    ctaVariant: 'outline',
    features: [
      { text: 'Complete Hiragana & Katakana', included: true },
      { text: 'Daily N5 Vocabulary sets', included: true },
      { text: 'Limited Community Access', included: true },
      { text: 'Grammar explanations', included: false },
    ],
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/mo',
    desc: 'The complete toolkit for serious N3 aspirants.',
    billing: 'Billed $144 yearly',
    cta: 'Get Pro Access',
    ctaVariant: 'primary',
    features: [
      { text: 'Full JLPT N3 Grammar Library', included: true },
      { text: 'Gamified Kanji Practice (WaniKani style)', included: true },
      { text: 'Smart SRS Review System', included: true },
      { text: 'Audio Pronunciation Guide', included: true },
      { text: 'Offline Mode', included: true },
    ],
    highlight: true,
    badge: 'MOST POPULAR',
  },
  {
    name: 'Intensive',
    price: '$29',
    period: '/mo',
    desc: 'For those who want personalized feedback and speed.',
    cta: 'Join Intensive',
    ctaVariant: 'secondary',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Weekly 1-on-1 Tutor Review (30m)', included: true },
      { text: 'Writing Corrections & Feedback', included: true },
      { text: 'Priority Support', included: true },
    ],
    highlight: false,
  },
];

const faqs = [
  { q: 'Can I switch plans at any time?', a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.' },
  { q: 'Is there a free trial for Pro?', a: 'We offer a 14-day money-back guarantee on all paid plans. Try risk-free and see if it works for you.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and Google Pay. All payments are processed securely.' },
  { q: 'Can I cancel anytime?', a: 'Absolutely. No contracts, no hidden fees. Cancel your subscription at any time from your account settings.' },
];

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      <Head title="Pricing - Japanlingo" />
      <GuestNavbar />

      {/* Hero */}
      <section className="px-6 lg:px-20 py-16 lg:py-20 bg-gradient-to-br from-white via-white to-red-50 text-center">
        <Badge color="red" className="mb-4">Pricing Plans</Badge>
        <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
          Master Japanese with the <span className="text-red-600">Right Plan</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Join over 50,000 learners on their path to JLPT N3 mastery. Choose a plan that fits your learning speed.
        </p>
      </section>

      {/* Plans */}
      <section className="px-6 lg:px-20 py-16 lg:py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${plan.highlight
                  ? 'bg-gray-900 text-white border-gray-800 shadow-2xl scale-[1.03]'
                  : 'bg-white border-gray-200'
                }`}
            >
              {plan.badge && (
                <Badge color="yellow" className="absolute -top-3 left-1/2 -translate-x-1/2">{plan.badge}</Badge>
              )}
              <h3 className={`text-xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
              <p className={`text-sm mb-5 ${plan.highlight ? 'text-gray-400' : 'text-gray-500'}`}>{plan.desc}</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className={`text-4xl font-black ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                {plan.period && <span className={`text-sm ${plan.highlight ? 'text-gray-400' : 'text-gray-500'}`}>{plan.period}</span>}
              </div>
              {plan.billing && <p className="text-xs text-gray-400 mb-5">{plan.billing}</p>}
              {!plan.billing && <div className="mb-5" />}

              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className={`flex items-center gap-2.5 text-sm ${plan.highlight
                      ? f.included ? 'text-gray-300' : 'text-gray-600 line-through'
                      : f.included ? 'text-gray-700' : 'text-gray-400 line-through'
                    }`}>
                    <span className={`text-base ${f.included ? (plan.highlight ? 'text-green-400' : 'text-green-500') : 'text-gray-300'}`}>
                      {f.included ? '✓' : '✕'}
                    </span>
                    {f.text}
                  </li>
                ))}
              </ul>

              {plan.highlight ? (
                <Button href="/register" className="w-full !bg-white !text-gray-900 hover:!bg-gray-100">{plan.cta}</Button>
              ) : (
                <Button variant={plan.ctaVariant} href="/register" className="w-full">{plan.cta}</Button>
              )}

              {plan.highlight && (
                <p className="text-xs text-gray-500 text-center mt-3">14-day money-back guarantee</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 lg:px-20 py-16 lg:py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3">Frequently Asked Questions</h2>
            <p className="text-gray-500">Have questions about payments? We've got answers.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <Card key={i} className="!p-0 overflow-hidden cursor-pointer" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="flex items-center justify-between px-6 py-4">
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  <span className={`text-gray-400 text-xl transition-transform duration-200 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </div>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-gray-500 border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-20 py-16 lg:py-20">
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-3xl px-6 lg:px-16 py-14 text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-3">Start learning for free today</h2>
          <p className="text-red-100 max-w-lg mx-auto mb-8">No credit card required. Upgrade anytime when you're ready.</p>
          <Button href="/register" className="!bg-white !text-red-600 hover:!bg-gray-100" size="lg">
            Get Started Free →
          </Button>
        </div>
      </section>

      <Footer />
    </>
  );
}
