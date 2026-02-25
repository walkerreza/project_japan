import React from 'react';
import { Head } from '@inertiajs/react';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import Card from '@/Components/UI/Card';
import Avatar from '@/Components/UI/Avatar';
import GuestNavbar from '@/Components/Layout/GuestNavbar';
import Footer from '@/Components/Layout/GuestFooter';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BoltIcon from '@mui/icons-material/Bolt';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import HeadsetIcon from '@mui/icons-material/Headset';
import rawTheme from '@/Components/theme/themes';
import FallEffect from '@/Components/theme/FallEffect';

// Map theme keys ke format yang dipakai landingPage
const theme = {
  heroBg: rawTheme.landingHeroBg,
  heroGradText: rawTheme.landingGradText,
  heroBadgeBg: rawTheme.landingBadgeBg,
  heroBadgeDot: rawTheme.landingBadgeDot,
  heroBadgeText: rawTheme.landingBadgeText,
  heroGlow: rawTheme.landingGlow,
  featureCardGlow: rawTheme.landingCardGlow,
  highlightBorder: rawTheme.landingHighlightBorder,
  highlightBadgeBg: rawTheme.landingHighlightBadge,
  highlightBtnBg: rawTheme.landingHighlightBtn,
  highlightLevel: rawTheme.landingHighlightLevel,
  leagueBg: rawTheme.landingLeagueBg,
  ctaBg: rawTheme.landingCtaBg,
  ctaProBg: rawTheme.landingProBg,
};


const steps = [
  { icon: <AssignmentIcon />, title: 'Placement Test', desc: 'Take a quick 5-minute test to find your exact level, or start from scratch with N5.' },
  { icon: <BoltIcon />, title: 'Daily Missions', desc: 'Complete bite-sized lessons, quizzes, and speaking exercises to earn XP and maintain your streak.' },
  { icon: <EmojiEventsIcon />, title: 'Earn Certificates', desc: 'Pass level checks to unlock official Japanlingo certificates and advance to the next JLPT tier.' },
];

const testimonials = [
  { quote: 'I finally passed N3 after struggling with textbooks for years. The gamified approach made studying addictive!', name: 'Sarah Jenkins', role: 'N3 Certified' },
  { quote: 'The audio quality is fantastic. Hearing real native speakers helped my pronunciation immensely.', name: 'Michael Chen', role: 'N4 Student' },
  { quote: 'Best investment for learning Japanese. The structured path keeps me from getting overwhelmed.', name: 'Jessica Lee', role: 'N2 Aspirant' },
];

const LandingPage = () => {
  return (
    <>
      <FallEffect />
      <Head title="Japanlingo - Gamified Japanese Learning" />
      <GuestNavbar />

      {/* Hero */}
      <section className={`relative flex flex-col lg:flex-row items-center justify-between px-6 lg:px-24 py-16 lg:py-32 ${theme.heroBg} gap-12 lg:gap-16 overflow-hidden`}>
        <div className="absolute inset-x-0 top-0 h-full w-full opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
        </div>

        <div className="max-w-xl lg:max-w-xl relative z-10">
          <div className={`inline-flex items-center gap-2 px-3 py-1 ${theme.heroBadgeBg} rounded-full mb-6 border`}>
            <span className={`w-2 h-2 rounded-full ${theme.heroBadgeDot} animate-pulse`}></span>
            <span className={`text-xs font-bold ${theme.heroBadgeText} uppercase tracking-wider`}>#1 Platform for JLPT N3</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] mb-6 text-[#1A1A1A] tracking-tight">
            Belajar Bahasa <br />
            <span className={`bg-gradient-to-r ${theme.heroGradText} bg-clip-text text-transparent`}>
              Jepang Terstruktur &amp; Gamified
            </span>
          </h1>

          <p className="text-lg lg:text-xl text-gray-500 mb-10 leading-relaxed max-w-lg">
            Master the Japanese language from N5 to N1 with our structured curriculum designed for busy learners. Fun, effective, and free to start.
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <Button size="lg" href="/register" className="!rounded-full !px-8 !py-4 shadow-lg">
              Start Learning Free ➔
            </Button>
            <Button size="lg" variant="outline" className="!rounded-full !px-8 !py-4 !bg-white">
              <PlayCircleIcon className="mr-2" sx={{ fontSize: 24 }} />
              View Demo
            </Button>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="user" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <span>Join <strong className="text-gray-900 font-bold">10,000+</strong> active learners</span>
          </div>
        </div>

        {/* Floating Card UI */}
        <div className="w-full max-w-lg relative lg:mr-10">
          <div className={`absolute -inset-4 bg-gradient-to-tr ${theme.heroGlow} blur-3xl rounded-full opacity-50`}></div>

          <div className="relative animate-float">
            <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 border border-gray-100 overflow-hidden">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 leading-none flex items-center gap-2">
                    <VideogameAssetIcon className="text-red-600" sx={{ fontSize: 20 }} />
                    Daily Goal
                  </h4>
                  <p className="text-sm text-gray-400 mt-1.5 font-medium">Keep your streak alive!</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-lg">
                  <LocalFireDepartmentIcon className="text-orange-500" />
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
                        <span className="font-bold">あ</span>
                      </div>
                      <span className="font-bold text-gray-800">Kanji Practice</span>
                    </div>
                    <span className="font-bold text-red-600">80%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 rounded-full w-[80%]"></div>
                  </div>
                </div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <HeadsetIcon sx={{ fontSize: 18 }} />
                      </div>
                      <span className="font-bold text-gray-800">Listening N3</span>
                    </div>
                    <span className="font-bold text-blue-600">45%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full w-[45%]"></div>
                  </div>
                </div>
              </div>

              <Button className="w-full !rounded-2xl !py-5 !bg-[#1A1A1A] !text-white !font-bold text-lg hover:!bg-black transition-colors">
                Continue Lesson
              </Button>
            </div>

            <div className="absolute -left-12 -bottom-6 animate-float-delayed">
              <div className="bg-[#E4E2D5] rounded-3xl p-4 shadow-xl border border-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/50 border border-white flex items-center justify-center overflow-hidden">
                  <div className="w-6 h-6 bg-[#C4C1B1] rounded-sm"></div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-tighter text-gray-500 font-bold">Current Level</div>
                  <div className="text-sm font-black text-red-700">JLPT N3</div>
                </div>
              </div>
            </div>

            <div className="absolute -right-8 -top-8 animate-float-fast">
              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-white flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px]">✔</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="px-6 lg:px-20 py-24 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <Badge color="red" className="mb-4">YOUR ROADMAP</Badge>
          <h2 className="text-4xl font-black text-gray-900 mb-4">Choose Your Starting Point</h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-16">
            From absolute beginner to advanced fluency. Our curriculum is aligned with official JLPT standards.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { level: 'N5', title: 'Beginner', desc: 'Basic greetings, hiragana, katakana, and simple sentence structures.', color: 'bg-green-500', label: 'Baby Level' },
              { level: 'N4', title: 'Elementary', desc: 'Daily conversations, basic kanji, and reading simple passages.', color: 'bg-blue-500', label: 'Foundation' },
              { level: 'N3', title: 'Intermediate', desc: 'Bridge to fluency. Complex grammar and casual conversations.', color: 'bg-red-600', label: 'Most Popular', highlight: true },
              { level: 'N2', title: 'Pre-Advanced', desc: 'Business Japanese, news comprehension, and abstract topics.', color: 'bg-purple-500', label: 'Business Level' },
              { level: 'N1', title: 'Advanced', desc: 'Native-like fluency. Complex writing and academic discussions.', color: 'bg-gray-800', label: 'Mastery' },
            ].map((item, i) => (
              <div
                key={i}
                className={`relative p-6 rounded-[2rem] text-left transition-all duration-300 flex flex-col h-full ${item.highlight
                  ? theme.highlightBorder
                  : 'bg-gray-50/50 border border-gray-100 hover:border-gray-200'
                  }`}
              >
                {item.highlight && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 ${theme.highlightBadgeBg} text-[10px] font-black text-white rounded-full whitespace-nowrap tracking-wider`}>
                    MOST POPULAR
                  </div>
                )}

                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black mb-4 ${item.highlight ? theme.highlightLevel : 'bg-gray-100 text-gray-400'}`}>
                  {item.level}
                </div>

                <h3 className="text-lg font-black text-gray-900 mb-2">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-6 flex-grow">{item.desc}</p>

                <div className="mt-auto">
                  <div className={`h-1.5 w-full rounded-full mb-4 ${item.color} opacity-80`}></div>
                  {item.highlight ? (
                    <Button className={`w-full !rounded-xl !py-2 ${theme.highlightBtnBg} !text-white !text-xs !font-bold`}>
                      Start {item.level}
                    </Button>
                  ) : (
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Japanlingo Section */}
      <section className="px-6 lg:px-20 py-24 bg-gray-50/50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <Badge color="red" className="mb-4">WHY JAPANLINGO?</Badge>
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-[1.2]">
                Learning Japanese shouldn't feel like a chore.
              </h2>
              <p className="text-gray-500 mb-10 leading-relaxed italic">
                We've combined scientifically proven learning methods with game mechanics to keep you motivated every single day.
              </p>

              <div className="space-y-8">
                {[
                  { icon: <VideogameAssetIcon />, title: 'Gamified Quizzes', desc: 'Earn XP, unlock badges, and compete on leaderboards while mastering grammar and vocabulary.', color: 'bg-red-100 text-red-600' },
                  { icon: <AutoAwesomeIcon />, title: 'Native Audio', desc: 'Listen to over 10,000 phrases recorded by professional Japanese voice actors, not robots.', color: 'bg-orange-100 text-orange-600' },
                  { icon: <ListAltIcon />, title: 'Structured Curriculum', desc: 'No more random learning. Follow a clear path designed to help you pass the JLPT.', color: 'bg-blue-100 text-blue-600' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 group">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-110 ${item.color}`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full ${theme.featureCardGlow} blur-[120px] rounded-full`}></div>

              <div className="grid grid-cols-2 gap-4">
                <div className="animate-float">
                  <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 translate-y-10">
                    <div className="text-red-500 mb-2">
                      <AutoAwesomeIcon sx={{ fontSize: 24 }} />
                    </div>
                    <div className="text-sm font-bold text-gray-900">Streak: 42 Days</div>
                    <div className="text-[10px] text-gray-400 mt-1">You're on fire! 🔥</div>
                  </div>
                </div>

                <div className="animate-float-fast">
                  <div className={`${theme.leagueBg} rounded-3xl p-6 shadow-2xl text-white relative h-full`}>
                    <div className="absolute top-4 right-4 text-[8px] font-bold bg-black/20 px-2 py-0.5 rounded-full">TOP 1%</div>
                    <div className="text-2xl mb-8">
                      <EmojiEventsIcon sx={{ fontSize: 32 }} />
                    </div>
                    <div className="text-lg font-black">Gold League</div>
                    <div className="text-xs opacity-80 mt-1">Keep learning to stay in the lead.</div>
                  </div>
                </div>

                <div className="col-span-1 animate-float-delayed">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                    <img src="https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400&h=300&fit=crop" className="w-full h-24 object-cover" alt="Context" />
                    <div className="p-4">
                      <div className="text-xs font-bold text-gray-900">Real-world Context</div>
                    </div>
                  </div>
                </div>

                <div className="animate-float">
                  <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 shadow-xl flex flex-col gap-3 -translate-y-10 border border-white">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden">
                        <img src="https://i.pravatar.cc/100?u=ken" className="w-full h-full object-cover" alt="Ken" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold leading-none">Sensei Ken</div>
                        <div className="text-[8px] text-green-500">Online Now</div>
                      </div>
                    </div>
                    <div className="bg-gray-100 rounded-2xl p-3 text-[9px] text-gray-600 leading-relaxed">
                      Don't forget the particle 'wa' marks the topic!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
        <div className={`${theme.ctaBg} rounded-3xl px-6 lg:px-16 py-14 text-center text-white`}>
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
              <Button variant="outline" href="/register" className="w-full !border-white/20 !text-white hover:!bg-black/20 hover:!text-white">
                Get Started
              </Button>
            </div>
            <div className={`${theme.ctaProBg} rounded-2xl p-8 text-left relative`}>
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
              <Button href="/register" className="w-full !bg-white !text-gray-900 hover:!bg-gray-100">
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