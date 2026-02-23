import React from 'react';
import { Head } from '@inertiajs/react';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import Card from '@/Components/UI/Card';
import Avatar from '@/Components/UI/Avatar';
import GuestNavbar from '@/Components/Layout/GuestNavbar';
import Footer from '@/Components/Layout/GuestFooter';

const stats = [
  { value: '12k+', label: 'Active Learners' },
  { value: '94%', label: 'JLPT Pass Rate' },
  { value: 'N5-N3', label: 'Levels Covered' },
];

const gamified = [
  { icon: '⚡', title: 'Daily Streaks', desc: 'Maintain daily streaks to boost retention multipliers.' },
  { icon: '⭐', title: 'Earn XP', desc: 'Earn XP to unlock new story chapters and cultural notes.' },
  { icon: '🏆', title: 'Leaderboard', desc: 'Compete in friendly leagues with fellow N3 aspirants.' },
];

const curriculum = [
  { icon: '📚', title: '1,800 Words', desc: 'Complete coverage of all 1,800 N3 vocabulary words.' },
  { icon: '🧠', title: 'SRS Kanji', desc: 'Spaced Repetition System (SRS) for Kanji mastery.' },
  { icon: '🎧', title: 'Native Audio', desc: 'Native audio listening drills for natural comprehension.' },
];

const team = [
  { name: 'Sarah Tanaka', role: 'Founder & Lead Linguist', word: '改善 (Kaizen)', meaning: 'Continuous Improvement' },
  { name: 'Kenji Sato', role: 'Head of Gamification', word: '木漏れ日 (Komorebi)', meaning: 'Sunlight through trees' },
  { name: 'Elena Rodriguez', role: 'Senior Developer', word: '一期一会 (Ichi-go Ichi-e)', meaning: 'Once in a lifetime' },
  { name: 'David Kim', role: 'Community Manager', word: '努力 (Doryoku)', meaning: 'Effort / Hard Work' },
];

export default function About() {
  return (
    <>
      <Head title="About - Japanlingo" />
      <GuestNavbar />

      {/* Hero */}
      <section className="px-6 lg:px-20 py-16 lg:py-24 bg-gradient-to-br from-white via-white to-red-50">
        <div className="max-w-4xl mx-auto text-center">
          <Badge color="red" className="mb-4">About Us</Badge>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-5">
            Master N3 <span className="text-red-600">without the boredom.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed">
            We bridge the gap between textbook rigidity and real-world fluency. Japanlingo combines RPG mechanics with the official JLPT curriculum to keep you motivated.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Button size="lg" href="/register">Start Learning</Button>
            <Button size="lg" variant="outline" href="#method">How it works</Button>
          </div>
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl lg:text-3xl font-black text-red-600">{s.value}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="px-6 lg:px-20 py-16 lg:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge color="red" className="mb-3">Our Vision</Badge>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                Traditional textbooks are great for reference, but terrible for retention.
              </h2>
              <p className="text-gray-500 leading-relaxed">
                You memorize a grammar point on Tuesday and forget it by Friday. At Japanlingo, we looked at how video games keep players engaged for hundreds of hours and applied those same principles to the JLPT N3 curriculum. By turning grammar drills into quests and vocabulary into unlockable content, we create a feedback loop that builds actual fluency.
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-amber-50 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🎮</div>
              <div className="text-xl font-black text-gray-900 mb-1">Game × Study</div>
              <p className="text-sm text-gray-500">Where RPG mechanics meet JLPT rigor</p>
            </div>
          </div>
        </div>
      </section>

      {/* Method */}
      <section id="method" className="px-6 lg:px-20 py-16 lg:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge color="red">The Japanlingo Method</Badge>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mt-2 mb-3">
              We blend rigorous academic structure with modern gamification.
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Gamified */}
            <Card className="!p-0 overflow-hidden">
              <div className="bg-red-600 px-6 py-4">
                <h3 className="text-lg font-bold text-white">🎮 Gamified Engagement</h3>
              </div>
              <div className="p-6 space-y-5">
                {gamified.map((g, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 text-xl">{g.icon}</div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-0.5">{g.title}</h4>
                      <p className="text-sm text-gray-500">{g.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Structured */}
            <Card className="!p-0 overflow-hidden">
              <div className="bg-gray-900 px-6 py-4">
                <h3 className="text-lg font-bold text-white">📚 Structured Curriculum</h3>
              </div>
              <div className="p-6 space-y-5">
                {curriculum.map((c, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-xl">{c.icon}</div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-0.5">{c.title}</h4>
                      <p className="text-sm text-gray-500">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="px-6 lg:px-20 py-16 lg:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge color="red">Meet the Sensei & Makers</Badge>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mt-2 mb-3">
              The team dedicated to your fluency.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((t, i) => (
              <Card key={i} hover className="text-center">
                <Avatar name={t.name} size="xl" className="mx-auto mb-4" />
                <h4 className="font-bold text-gray-900">{t.name}</h4>
                <p className="text-xs text-gray-500 mb-4">{t.role}</p>
                <div className="bg-red-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Favorite Word</p>
                  <p className="text-sm font-bold text-red-600">{t.word}</p>
                  <p className="text-xs text-gray-500">{t.meaning}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-20 py-16 lg:py-20 bg-gray-50">
        <div className="bg-gray-900 rounded-3xl px-6 lg:px-16 py-14 text-center text-white max-w-4xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-3">Ready to crush the JLPT?</h2>
          <p className="text-gray-400 max-w-lg mx-auto mb-8">
            Join 10,000+ learners who have switched from boring textbooks to the Japanlingo method.
          </p>
          <Button href="/register" className="!bg-red-600 !text-white hover:!bg-red-700" size="lg">
            Start Learning Free →
          </Button>
        </div>
      </section>

      <Footer />
    </>
  );
}