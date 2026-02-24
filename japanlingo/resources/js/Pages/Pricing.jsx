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
    name: 'Premium',
    price: '$5',
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
    ],
    highlight: true,
    badge: 'MOST POPULAR',
  },
];

const freq = [
  {
    name: "Can I switch plans at any time?",
    desc: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.",
  },
  {
    name: "Is there a free trial for Pro?",
    desc: "We offer a 14-day money-back guarantee on all paid plans. Try risk-free and see if it works for you.",
  },
  {
    name: "What payment methods do you accept?",
    desc: "We accept all major credit cards, PayPal, and Google Pay. All payments are processed securely.",
  },
  {
    name: "Can I cancel anytime?",
    desc: "Absolutely. No contracts, no hidden fees. Cancel your subscription at any time from your account settings.",
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
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-3xl p-8 border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex-1 max-w-sm ${plan.highlight
                ? 'bg-gray-900 text-white border-gray-800 shadow-2xl z-10 scale-[1.05]'
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
      <section className="px-6 lg:px-20 py-20 lg:py-32 bg-[#F9FAFB]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <Badge color="red" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500">Have questions about our plans? We've got you covered.</p>
          </div>

          <div className="space-y-4">
            {freq.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className={`group bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-red-500 shadow-lg shadow-red-500/5' : 'border-gray-100 hover:border-gray-300'
                    }`}
                >
                  <button
                    className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                  >
                    <span className={`font-bold transition-colors ${isOpen ? 'text-red-600' : 'text-gray-900'}`}>
                      {faq.name}
                    </span>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-red-600 text-white rotate-[135deg]' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                      }`}>
                      <span className="text-xl font-light leading-none">+</span>
                    </div>
                  </button>

                  <div
                    className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                  >
                    <div className="px-6 pb-6 pt-2 text-gray-500 leading-relaxed border-t border-gray-50 mx-6">
                      {faq.desc}
                    </div>
                  </div>
                </div>
              );
            })}
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
