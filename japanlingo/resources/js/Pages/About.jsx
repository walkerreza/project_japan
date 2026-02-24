import React from 'react';
import { Head } from '@inertiajs/react';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import Card from '@/Components/UI/Card';
import Avatar from '@/Components/UI/Avatar';
import GuestNavbar from '@/Components/Layout/GuestNavbar';
import Footer from '@/Components/Layout/GuestFooter';
import studentImg from '@/../../resources/Images/japannese_student.jpg';
import guru1 from '@/../../resources/Images/bahasa-jepang-guru-1.jpg';
import guru2 from '@/../../resources/Images/bahasa-jepangnya-guru.jpg';

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

const teamMembers = [
  { name: 'Sarah Tanaka', role: 'Founder & Lead Linguist', image: guru1 },
  { name: 'Kenji Sato', role: 'Head of Gamification', image: guru2 },
  { name: 'Elena Rodriguez', role: 'Senior Developer', image: guru1 },
  { name: 'David Kim', role: 'Community Manager', image: guru2 },
];

export default function About() {
  return (
    <>
      <Head title="About - Japanlingo" />
      <GuestNavbar />

      {/* Hero */}
      <section className="px-6 lg:px-20 py-16 lg:pt-24 lg:pb-32 bg-gradient-to-br from-white via-white to-red-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Badge color="red" className="mb-4">OUR MISSION</Badge>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-5 tracking-tight">
            Master <span className="text-red-600 relative">N3<span className="absolute bottom-1 left-0 w-full h-1 bg-red-100 -z-10"></span></span> without the boredom.
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed">
            We bridge the gap between textbook rigidity and real-world fluency. Japanlingo combines RPG mechanics with the official JLPT curriculum to keep you motivated.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <Button size="lg" href="/register">Start Learning</Button>
            <Button size="lg" variant="outline" href="#method">How it works</Button>
          </div>
        </div>

        {/* Stats Image Container - Now Wider and Larger */}
        <div className="relative max-w-6xl mx-auto px-4 mt-6 rounded-[2.5rem] overflow-hidden shadow-2xl group z-10">
          <div className="aspect-[16/7] md:aspect-[21/8] w-full relative">
            <img
              src={studentImg}
              className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105"
              alt="Japanese Student"
            />
            {/* Fade Overlays */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/40 to-transparent opacity-90" />
            <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-white/30 via-transparent to-transparent" />
          </div>

          {/* Stats Floating Card */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[92%] md:w-[85%] max-w-4xl">
            <div className="bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[1.5rem] p-8 md:p-10 flex items-center justify-around">
              {stats.map((s, i) => (
                <React.Fragment key={i}>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-black text-red-600 tracking-tight">{s.value}</div>
                    <div className="text-[10px] md:text-xs text-gray-400 font-extrabold uppercase tracking-[0.2em] mt-2">{s.label}</div>
                  </div>
                  {i < stats.length - 1 && <div className="h-12 w-px bg-gray-100" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="px-6 lg:px-20 py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Left Column: Stylized Quote */}
            <div className="relative">
              {/* Decorative Quote Mark */}
              <div className="absolute -top-10 -left-6 text-[120px] font-serif text-red-500/10 leading-none select-none">“</div>
              <div className="relative z-10">
                <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-[1.3] mb-8 font-serif italic">
                  Language learning shouldn't feel like a chore. We believe in the power of <span className="relative inline-block px-2">
                    <span className="relative z-10 text-red-600">habit-forming design</span>
                    <span className="absolute inset-0 bg-red-50 rounded-lg -rotate-1"></span>
                  </span> to make consistency effortless.
                </h2>

                <div className="flex items-center gap-4">
                  <div className="h-px w-12 bg-gray-200"></div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Our Vision</span>
                </div>
              </div>
              {/* Decorative Quote Mark Bottom */}
              <div className="absolute -bottom-16 right-0 text-[120px] font-serif text-red-500/10 leading-none select-none rotate-180">“</div>
            </div>

            {/* Right Column: Content */}
            <div className="space-y-6 text-gray-500 leading-relaxed text-lg">
              <p>
                Traditional textbooks are great for reference, but terrible for retention. You memorize a grammar point on Tuesday and forget it by Friday.
              </p>
              <p>
                At Japanlingo, we looked at how video games keep players engaged for hundreds of hours and applied those same principles to the JLPT N3 curriculum. By turning grammar drills into quests and vocabulary into unlockable content, we create a feedback loop that builds actual fluency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scientific Method */}
      <section id="method" className="px-6 lg:px-20 py-16 lg:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">How we make learning stick.</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Proven cognitive methods combined with immersive game loops.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Gamified Card */}
            <Card className="!p-0 overflow-hidden border-0 shadow-xl">
              <div className="bg-red-600 px-6 py-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">🕹️ Gamified Progress</h3>
              </div>
              <div className="p-6 space-y-5">
                {gamified.map((g, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 text-xl group-hover:scale-110 transition-transform">{g.icon}</div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-0.5">{g.title}</h4>
                      <p className="text-sm text-gray-500">{g.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Structured Card */}
            <Card className="!p-0 overflow-hidden border-0 shadow-xl">
              <div className="bg-gray-900 px-6 py-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">📚 Structured Curriculum</h3>
              </div>
              <div className="p-6 space-y-5">
                {curriculum.map((c, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 text-xl group-hover:scale-110 transition-transform">{c.icon}</div>
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

      {/* Team Section - Updated to meet Screenshot style */}
      <section className="px-6 lg:px-20 py-20 lg:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-2">Meet the Sensei & Makers</h2>
            <p className="text-gray-500">The team dedicated to your fluency.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
            {teamMembers.map((member, i) => (
              <div key={i} className="text-center group">
                <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-lg mb-6 relative">
                  <img
                    src={member.image}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={member.name}
                  />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h4>
                <p className="text-sm text-red-600 font-bold tracking-tight">{member.role}</p>
              </div>
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