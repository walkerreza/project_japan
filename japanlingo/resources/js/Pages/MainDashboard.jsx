import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/UI/Card';
import Badge from '@/Components/UI/Badge';
import Button from '@/Components/UI/Button';

const modules = [
  {
    type: 'Grammar',
    level: 'JLPT N5',
    title: 'Basic Particles (Wa, Ga, O)',
    color: 'blue',
    icon: '📝',
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
    label: 'Grammar Guide',
    time: '3 jam lalu',
  },
  {
    type: 'Kanji',
    level: 'JLPT N5',
    title: 'Daily Kanji: Self & Family',
    color: 'red',
    icon: '私',
    bg: 'bg-gradient-to-br from-red-50 to-red-100',
    label: 'Kanji Practice',
    time: '5 jam lalu',
    isKanji: true,
  },
  {
    type: 'Listening',
    level: 'JLPT N4',
    title: 'N4 Listening: Shopping',
    color: 'yellow',
    icon: '🎧',
    bg: 'bg-gradient-to-br from-amber-50 to-amber-100',
    label: 'Listening Practice',
    time: '1 hari lalu',
  },
  {
    type: 'Vocab',
    level: 'JLPT N4',
    title: 'Week 2: Travel Vocabulary',
    color: 'green',
    icon: '📚',
    bg: 'bg-gradient-to-br from-green-50 to-green-100',
    label: 'Vocabulary',
    time: '2 hari lalu',
  },
];

const news = [
  {
    category: 'Teknologi',
    categoryColor: 'blue',
    title: 'Inovasi Robot Pelayan Baru di Kafe Tokyo Menarik Perhatian Dunia',
    desc: 'Sebuah kafe di distrik Shibuya memperkenalkan robot pelayan AI yang mampu berinteraksi dengan pelanggan dalam 10 bahasa berbeda.',
    source: 'Tokyo Times',
    time: '2 jam lalu',
    emoji: '🤖',
    bg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
  },
  {
    category: 'Budaya',
    categoryColor: 'red',
    title: 'Festival Musim Gugur Kyoto Kembali Digelar dengan Meriah',
    desc: 'Setelah dua tahun pembatasan, ribuan turis memadati kuil Kiyomizu-dera untuk menikmati pemandangan daun musim gugur yang spektakuler.',
    source: 'Kyoto News',
    time: '5 jam lalu',
    emoji: '⛩️',
    bg: 'bg-gradient-to-br from-red-500 to-rose-600',
  },
  {
    category: 'Kuliner',
    categoryColor: 'yellow',
    title: 'Ramen Terpedas di Jepang: Tantangan Baru bagi Pecinta Kuliner',
    desc: 'Sebuah kedai ramen legendaris di Osaka meluncurkan menu \'Level Neraka\' yang menggunakan cabai terpedas di dunia, berani coba?',
    source: 'Osaka Eats',
    time: '1 hari lalu',
    emoji: '🍜',
    bg: 'bg-gradient-to-br from-amber-500 to-orange-600',
  },
];

const socials = [
  { icon: '📷', label: 'Instagram', handle: '@Japanlingo', bg: 'bg-gradient-to-r from-pink-500 to-rose-500' },
  { icon: '🎵', label: 'TikTok', handle: '@Japanlingo', bg: 'bg-gray-900' },
  { icon: '▶️', label: 'YouTube', handle: '@Japanlingo', bg: 'bg-red-600' },
  { icon: '𝕏', label: 'Twitter', handle: '@Japanlingo', bg: 'bg-gray-800' },
];

const dotColors = {
  Grammar: 'bg-blue-500',
  Kanji: 'bg-red-500',
  Listening: 'bg-amber-500',
  Vocab: 'bg-green-500',
};

export default function MainDashboard() {
  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
      }
    >
      <Head title="Dashboard - Japanlingo" />

      {/* Hero Search */}
      <section className="bg-gradient-to-br from-gray-50 to-red-50/30 rounded-2xl p-8 lg:p-12 mb-8">
        <h1 className="text-3xl lg:text-4xl font-black text-gray-900 text-center mb-6">
          Mau belajar apa hari ini?
        </h1>
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Cari grammar, kanji, atau kosakata..."
              className="w-full pl-12 pr-12 py-4 rounded-full border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 shadow-sm"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors text-lg">
              ⚙️
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          {socials.map((s, i) => (
            <a key={i} href="#" className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-xs font-medium ${s.bg} hover:opacity-90 transition-opacity no-underline`}>
              <span>{s.icon}</span>
              <span>{s.label} {s.handle}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Modul Terbaru */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-extrabold text-gray-900">Modul Terbaru</h2>
          <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-red-600/20">
            <option>Semua jenis</option>
            <option>Grammar</option>
            <option>Kanji</option>
            <option>Listening</option>
            <option>Vocabulary</option>
          </select>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {modules.map((m, i) => (
            <Card key={i} hover className="!p-0 overflow-hidden cursor-pointer">
              <div className={`${m.bg} h-36 flex items-center justify-center relative`}>
                {m.isKanji ? (
                  <span className="text-6xl font-black text-red-600/80">{m.icon}</span>
                ) : (
                  <span className="text-5xl">{m.icon}</span>
                )}
                <Badge color={m.color} className="absolute top-3 left-3 !text-[10px]">{m.label}</Badge>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`w-2 h-2 rounded-full ${dotColors[m.type]}`} />
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{m.level}</span>
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-2 leading-snug">{m.title}</h4>
                <span className="text-xs text-gray-400">{m.time}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Berita Terkini Jepang */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-extrabold text-gray-900">Berita Terkini Jepang</h2>
          <Link href="#" className="text-sm text-red-600 font-semibold hover:underline no-underline">
            Lihat semua berita →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {news.map((n, i) => (
            <Card key={i} hover className="!p-0 overflow-hidden cursor-pointer group">
              <div className={`${n.bg} h-48 flex items-center justify-center relative`}>
                <span className="text-6xl opacity-80 group-hover:scale-110 transition-transform duration-300">{n.emoji}</span>
                <Badge color={n.categoryColor} className="absolute top-3 left-3">{n.category}</Badge>
              </div>
              <div className="p-5">
                <h4 className="font-bold text-gray-900 mb-2 leading-snug group-hover:text-red-600 transition-colors">{n.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{n.desc}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">{n.source} · {n.time}</span>
                  <span className="text-red-600 font-semibold group-hover:underline">Baca selengkapnya →</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 pt-5 pb-2 flex flex-col sm:flex-row justify-between text-xs text-gray-400">
        <span>Japanlingo © 2026</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-red-600 transition-colors no-underline">Privacy</a>
          <a href="#" className="hover:text-red-600 transition-colors no-underline">Terms</a>
          <a href="#" className="hover:text-red-600 transition-colors no-underline">Support</a>
        </div>
      </footer>
    </AuthenticatedLayout>
  );
}