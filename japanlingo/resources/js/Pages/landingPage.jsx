import React from 'react';
import { Head } from '@inertiajs/react';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import Card from '@/Components/UI/Card';
import Avatar from '@/Components/UI/Avatar';
import ProgressBar from '@/Components/UI/ProgressBar';
import LevelBadge from '@/Components/Learning/LevelBadge';
import GuestNavbar from '@/Components/Layout/GuestNavbar';
import Footer from '@/Components/Layout/GuestFooter';

const steps = [
  { icon: '📝', title: 'Placement Test', desc: 'Take a quick 5-minute test to find your exact level, or start from scratch with N5.' },
  { icon: '⚡', title: 'Daily Missions', desc: 'Complete bite-sized lessons, quizzes, and speaking exercises to earn XP and maintain your streak.' },
  { icon: '🏅', title: 'Earn Certificates', desc: 'Pass level checks to unlock official Japanlingo certificates and advance to the next JLPT tier.' },
];

const testimonials = [
  { quote: 'I finally passed N3 after struggling with textbooks for years. The gamified approach made studying addictive!', name: 'Sarah Jenkins', role: 'N3 Certified' },
  { quote: 'The audio quality is fantastic. Hearing real native speakers helped my pronunciation immensely.', name: 'Michael Chen', role: 'N4 Student' },
  { quote: 'Best investment for learning Japanese. The structured path keeps me from getting overwhelmed.', name: 'Jessica Lee', role: 'N2 Aspirant' },
];

const LandingPage = () => {

  return (
    <>
      <Head title="Japanlingo - Gamified Japanese Learning" />

      <GuestNavbar />

      {/* Hero */}
      <section className="flex flex-col lg:flex-row items-center justify-between px-6 lg:px-20 py-16 lg:py-20 bg-gradient-to-br from-white via-white to-red-50 gap-12 lg:gap-16 overflow-hidden">
        <div className="max-w-xl lg:max-w-lg">
          <Badge color="red" className="mb-5">🎌 #1 Japanese Learning Platform</Badge>
          <h1 className="text-4xl lg:text-5xl font-black leading-tight mb-5 text-gray-900">
            Belajar Bahasa Jepang <span className="text-red-600">Terstruktur & Gamified</span>
          </h1>
          <p className="text-base lg:text-lg text-gray-500 mb-8 leading-relaxed">
            Master the Japanese language from N5 to N1 with our structured curriculum designed for busy learners. Fun, effective, and free to start.
          </p>
          <div className="flex flex-wrap gap-4 mb-6">
            <Button size="lg" href="/register">Mulai Sekarang →</Button>
            <Button size="lg" variant="outline">▶ Coba Demo</Button>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex -space-x-2">
              {['🧑', '👩', '👨', '👩‍🦰'].map((e, i) => (
                <span key={i} className="w-8 h-8 rounded-full bg-red-50 border-2 border-white flex items-center justify-center text-xs">{e}</span>
              ))}
            </div>
            <span>Join <strong className="text-gray-800">10,000+</strong> active learners</span>
          </div>
        </div>

        <div className="w-full max-w-md lg:max-w-lg flex-shrink-0">
          <Card className="shadow-xl">
            <Card.Header>
              <h4 className="text-sm font-semibold flex items-center gap-2">🎯 Daily Goal</h4>
              <p className="text-xs text-gray-400 mt-1">Keep your streak alive!</p>
            </Card.Header>
            <Card.Body>
              <ProgressBar value={75} max={100} color="red" size="md" className="mb-4" />
              <div className="flex justify-between gap-6">
                <div className="text-center">
                  <div className="text-xl font-extrabold text-gray-900">98%</div>
                  <div className="text-xs text-gray-400">Accuracy</div>
                </div>
                <div className="text-center">
                  <LevelBadge level="N3" size="lg" />
                  <div className="text-xs text-gray-400 mt-1">Current Level</div>
                </div>
              </div>
            </Card.Body>
            <Card.Footer className="!border-0 !pt-0">
              <div className="bg-gray-900 rounded-xl px-5 py-4 flex items-center justify-between text-white">
                <div>
                  <div className="text-xs font-medium opacity-70">Current Level</div>
                  <div className="font-bold">Intermediate</div>
                </div>
                <LevelBadge level="N3" size="md" className="!bg-red-600 !text-white !border-red-600" />
              </div>
            </Card.Footer>
          </Card>
        </div>
      </section>

      {/* Path to Fluency */}
      <section className="px-6 lg:px-20 py-16 lg:py-20 bg-gray-50">
        <div className="text-center mb-12">
          <Badge color="red">3 Steps</Badge>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mt-2 mb-3">Your Path to Fluency</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((s, i) => (
            <Card key={i} className="text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5 text-2xl">{s.icon}</div>
              <h3 className="text-lg font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 lg:px-20 py-16 lg:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">Trusted by 10,000+ Learners</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Card key={i} hover>
              <div className="text-amber-400 text-base mb-4 tracking-wider">★★★★★</div>
              <blockquote className="text-sm text-gray-700 leading-relaxed mb-5 italic">"{t.quote}"</blockquote>
              <div className="flex items-center gap-3">
                <Avatar name={t.name} size="md" />
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-gray-400">{t.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA + Pricing */}
      <section className="px-6 lg:px-20 py-16 lg:py-20">
        <div className="bg-gray-900 rounded-3xl px-6 lg:px-16 py-14 text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-3">Ready to start your journey?</h2>
          <p className="text-gray-400 max-w-lg mx-auto mb-10">Join for free today. Upgrade to Premium anytime for offline access, unlimited quizzes, and personal coaching.</p>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-gray-800/50 border border-white/10 rounded-2xl p-8 text-left">
              <h3 className="text-lg font-bold text-white mb-2">Free Starter</h3>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-sm text-white/50">$</span>
                <span className="text-4xl font-black text-white">0</span>
                <span className="text-sm text-white/40">/mo</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm text-white/80"><span className="text-green-400">✓</span> 5 Lessons/day</li>
                <li className="flex items-center gap-2 text-sm text-white/80"><span className="text-green-400">✓</span> Basic Quizzes</li>
                <li className="flex items-center gap-2 text-sm text-white/80"><span className="text-green-400">✓</span> Community Access</li>
              </ul>
              <Button variant="outline" href="/register" className="w-full !border-white/20 !text-white hover:!bg-white/20">
                Get Started
              </Button>
            </div>
            <div className="bg-red-600 rounded-2xl p-8 text-left relative">
              <Badge color="yellow" className="absolute -top-3 right-5">POPULAR</Badge>
              <h3 className="text-lg font-bold text-white mb-2">Pro Scholar</h3>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-sm text-white/60">$</span>
                <span className="text-4xl font-black text-white">12</span>
                <span className="text-sm text-white/50">/mo</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm text-white/90"><span className="text-white">✓</span> Unlimited Lessons</li>
                <li className="flex items-center gap-2 text-sm text-white/90"><span className="text-white">✓</span> Offline Mode</li>
                <li className="flex items-center gap-2 text-sm text-white/90"><span className="text-white">✓</span> Advanced Stats</li>
                <li className="flex items-center gap-2 text-sm text-white/90"><span className="text-white">✓</span> Personal Coaching</li>
              </ul>
              <Button href="/register" className="w-full !bg-white !text-red-600 hover:!bg-gray-100">
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      </section>


      <Footer />
    </>
  );
};

export default LandingPage;