import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import theme from '@/Components/theme/themes';

import MenuBookIcon from '@mui/icons-material/MenuBook';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TranslateIcon from '@mui/icons-material/Translate';

export default function DaftarMateri({ lessons = [] }) {
    // Memberikan warna dinamis agar tegas dan variatif
    const getCardStyle = (index, status) => {
        if (status === 'locked') return { bg: 'bg-slate-50 dark:bg-gray-800/50', border: 'border-slate-200 dark:border-gray-700', text: 'text-slate-500 dark:text-gray-400', shadow: 'none', hint: 'from-slate-300 to-slate-400 dark:from-gray-600 dark:to-gray-700', badge: 'bg-slate-200 text-slate-500 dark:bg-gray-700 dark:text-gray-300' };
        const styles = [
            { bg: 'bg-white dark:bg-gray-900', border: 'border-blue-100 dark:border-blue-900/30', text: 'text-gray-900 dark:text-white', shadow: 'shadow-[0_15px_40px_-15px_rgba(37,99,235,0.3)] dark:shadow-none', hint: 'from-blue-500 to-indigo-600', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
            { bg: 'bg-white dark:bg-gray-900', border: 'border-red-100 dark:border-red-900/30', text: 'text-gray-900 dark:text-white', shadow: 'shadow-[0_15px_40px_-15px_rgba(220,38,38,0.3)] dark:shadow-none', hint: 'from-red-500 to-rose-600', badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
            { bg: 'bg-white dark:bg-gray-900', border: 'border-green-100 dark:border-green-900/30', text: 'text-gray-900 dark:text-white', shadow: 'shadow-[0_15px_40px_-15px_rgba(22,163,74,0.3)] dark:shadow-none', hint: 'from-emerald-500 to-green-600', badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
        ];
        return styles[index % styles.length];
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-extrabold text-2xl text-gray-900 leading-tight tracking-tight">Lobi Pelajaran</h2>}
        >
            <Head title="Lobi Pelajaran" />

            <div className="py-12 min-h-screen transition-colors duration-300 bg-[var(--landing-hero-bg)] dark:bg-gray-950" style={{ '--landing-hero-bg': theme.landingHeroBg }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header Banner */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-900 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 py-8 sm:py-10 mb-12 overflow-hidden relative"
                    >
                        {/* Motif Latar Belakang */}
                        <div className="absolute -top-16 -right-16 opacity-10 pointer-events-none">
                             <TranslateIcon sx={{ fontSize: 300, color: 'white' }} />
                        </div>

                        <div className="relative z-10 max-w-2xl">
                            <span className="inline-block py-1.5 px-4 rounded-full text-xs font-black tracking-widest uppercase mb-4 text-white bg-white/20 backdrop-blur-md">
                                RUANG LITERASI
                            </span>
                            <h3 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight leading-none">
                                Mulai Perjalanan Membacamu
                            </h3>
                            <p className="text-gray-300 font-medium text-base sm:text-lg leading-relaxed">
                                Baca dengan seksama, catat kosa kata baru, dan pahami tata nahunya sebelum kamu melaju ke Arena Kuis. Semakin banyak membaca, semakin kuat fondasimu!
                            </p>
                        </div>
                    </motion.div>

                    {/* Katagog Pelajaran */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {lessons.length === 0 && (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500 font-bold text-lg">Belum ada materi pelajaran yang dipublikasikan.</p>
                            </div>
                        )}
                        {lessons.map((lesson, idx) => {
                            const style = getCardStyle(idx, lesson.status);
                            return (
                            <motion.div 
                                key={lesson.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`relative rounded-[2rem] p-8 border-2 transition-all duration-300 ${style.bg} ${style.border} ${lesson.status !== 'locked' ? 'hover:-translate-y-3' : ''}`}
                                style={{ boxShadow: style.shadow }}
                            >
                                {/* Kunci / Tersedia Badge */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${style.hint} text-white shadow-xl`}>
                                        <AutoStoriesIcon sx={{ fontSize: 28 }} />
                                    </div>
                                    <span className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase tracking-widest ${style.badge}`}>
                                        {lesson.status === 'locked' ? (lesson.lockReason === 'premium' ? '🔒 Premium' : '🔒 Terkunci') : 'Tersedia'}
                                    </span>
                                </div>

                                <h4 className={`text-2xl font-black mb-3 leading-tight ${style.text}`}>
                                    {lesson.title}
                                </h4>
                                <div className="mb-2">
                                    <span className="bg-gray-800 text-white text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider">{lesson.level}</span>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mb-8 min-h-[3rem] leading-relaxed line-clamp-2">
                                    {lesson.description}
                                </p>

                                <div className="flex flex-wrap items-center gap-5 mb-8 text-sm font-bold text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800 pt-6 transition-colors">
                                    <span className="flex items-center gap-1.5"><AccessTimeIcon sx={{ fontSize: 18 }} /> {lesson.durationEstimate}</span>
                                    <span className="flex items-center gap-1.5"><MenuBookIcon sx={{ fontSize: 18 }} /> {lesson.totalPages} Lembar</span>
                                </div>

                                {/* Tombol Aksi */}
                                {lesson.status === 'locked' ? (
                                    lesson.lockReason === 'premium' ? (
                                        <Link href={route('pricing')} className="block text-center w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-black tracking-wide rounded-2xl uppercase shadow-md hover:shadow-lg transition-all">
                                            👑 UPGRADE PREMIUM
                                        </Link>
                                    ) : (
                                        <button disabled className="w-full py-4 bg-slate-100 dark:bg-gray-800 text-slate-400 dark:text-gray-500 font-black tracking-wide rounded-2xl cursor-not-allowed uppercase border border-slate-200 dark:border-gray-700 transition-colors">
                                            BELUM BISA DIAKSES
                                        </button>
                                    )
                                ) : (
                                    <Link 
                                        href={`/user/lessons/${lesson.id}`} 
                                        className={`w-full flex items-center justify-center gap-2 py-4 text-white font-black text-base md:text-lg tracking-wide rounded-2xl transition-all hover:brightness-110 active:translate-y-1 bg-gradient-to-br ${theme.ctaBg}`}
                                        style={{ boxShadow: `0 6px 0 0 ${theme.activeShadow}` }}
                                    >
                                        <MenuBookIcon /> BUKA MATERI
                                    </Link>
                                )}
                            </motion.div>
                        )})}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
