import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import Card from '@/Components/UI/Card';
import GuestNavbar from '@/Components/Layout/GuestNavbar';
import Footer from '@/Components/Layout/GuestFooter';

const plans = [
  {
    name: 'Dasar',
    price: 'Gratis',
    period: '',
    desc: 'Alat penting bagi pemula untuk memulai perjalanan mereka.',
    cta: 'Mulai Gratis',
    ctaVariant: 'outline',
    features: [
      { text: 'Materi Lengkap Hiragana & Katakana', included: true },
      { text: 'Kumpulan Kosakata N5 Harian', included: true },
      { text: 'Akses Komunitas Terbatas', included: true },
      { text: 'Penjelasan Tata Bahasa', included: false },
    ],
    highlight: false,
  },
  {
    name: 'Premium',
    price: '$5',
    period: '/bln',
    desc: 'Peralatan lengkap untuk pejuang JLPT N3 yang serius.',
    billing: 'Ditagih secara tahunan',
    cta: 'Dapatkan Akses Pro',
    ctaVariant: 'primary',
    features: [
      { text: 'Perpustakaan Lengkap Tata Bahasa JLPT N3', included: true },
      { text: 'Latihan Kanji Tergamifikasi (Gaya WaniKani)', included: true },
      { text: 'Sistem Tinjauan SRS Cerdas', included: true },
      { text: 'Panduan Pengucapan Audio', included: true },
    ],
    highlight: true,
    badge: 'PALING POPULER',
  },
];

const freq = [
  {
    name: "Apakah saya bisa berganti paket kapan saja?",
    desc: "Ya! Anda dapat meningkatkan atau menurunkan paket Anda kapan saja. Perubahan akan berlaku pada awal siklus penagihan berikutnya.",
  },
  {
    name: "Apakah ada uji coba gratis untuk Pro?",
    desc: "Kami menawarkan jaminan uang kembali 14 hari untuk semua paket berbayar. Coba tanpa risiko dan buktikan sendiri manfaatnya.",
  },
  {
    name: "Metode pembayaran apa saja yang diterima?",
    desc: "Kami menerima semua kartu kredit utama, PayPal, dan Google Pay. Semua pembayaran diproses dengan aman.",
  },
  {
    name: "Apakah saya bisa membatalkan langganan kapan saja?",
    desc: "Tentu saja. Tanpa kontrak, tanpa biaya tersembunyi. Batalkan langganan Anda kapan saja melalui pengaturan akun Anda.",
  },
];

const faqs = [
  { q: 'Apakah saya bisa berganti paket kapan saja?', a: 'Ya! Anda dapat meningkatkan atau menurunkan paket Anda kapan saja. Perubahan akan berlaku pada awal siklus penagihan berikutnya.' },
  { q: 'Apakah ada uji coba gratis untuk Pro?', a: 'Kami menawarkan jaminan uang kembali 14 hari untuk semua paket berbayar. Coba tanpa risiko dan buktikan sendiri manfaatnya.' },
  { q: 'Metode pembayaran apa saja yang diterima?', a: 'Kami menerima semua kartu kredit utama, PayPal, dan Google Pay. Semua pembayaran diproses dengan aman.' },
  { q: 'Apakah saya bisa membatalkan langganan kapan saja?', a: 'Tentu saja. Tanpa kontrak, tanpa biaya tersembunyi. Batalkan langganan Anda kapan saja melalui pengaturan akun Anda.' },
];

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      <Head title="Harga - Japanlingo" />
      <GuestNavbar />

      {/* Hero */}
      <section className="px-6 lg:px-20 py-16 lg:py-20 bg-gradient-to-br from-white via-white to-red-50 text-center">
        <Badge color="red" className="mb-4">Paket Harga</Badge>
        <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
          Kuasai Bahasa Jepang dengan <span className="text-red-600">Paket yang Tepat</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Bergabunglah dengan lebih dari 50.000 pembelajar dalam perjalanan menguasai JLPT N3. Pilih paket yang sesuai dengan kecepatan belajar Anda.
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
                <p className="text-xs text-gray-500 text-center mt-3">Jaminan uang kembali 14 hari</p>
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
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-gray-500">Punya pertanyaan tentang paket kami? Temukan jawabannya di sini.</p>
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
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-3">Mulai belajar secara gratis hari ini</h2>
          <p className="text-red-100 max-w-lg mx-auto mb-8">Tidak perlu kartu kredit. Tingkatkan paket kapan saja saat Anda siap.</p>
          <Button href="/register" className="!bg-white !text-red-600 hover:!bg-gray-100" size="lg">
            Mulai Gratis →
          </Button>
        </div>
      </section>

      <Footer />
    </>
  );
}
