import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import theme from '@/Components/theme/themes';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShieldIcon from '@mui/icons-material/Shield';

export default function QuizLobby({ quizzes = [] }) {
    // Memberikan ketegasan gaya per kartu kuis
    const getCardStyle = (index, status) => {
        if (status === 'locked') return { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-500', shadow: 'none', hint: 'from-slate-300 to-slate-400', badge: 'bg-slate-200 text-slate-500' };
        const styles = [
            { bg: 'bg-white', border: 'border-orange-100', text: 'text-gray-900', shadow: 'shadow-[0_15px_40px_-15px_rgba(249,115,22,0.3)]', hint: 'from-orange-500 to-amber-600', badge: 'bg-orange-100 text-orange-700' },
            { bg: 'white', border: 'border-red-100', text: 'text-gray-900', shadow: 'shadow-[0_15px_40px_-15px_rgba(220,38,38,0.3)]', hint: 'from-red-500 to-rose-600', badge: 'bg-red-100 text-red-700' },
            { bg: 'white', border: 'border-purple-100', text: 'text-gray-900', shadow: 'shadow-[0_15px_40px_-15px_rgba(147,51,234,0.3)]', hint: 'from-purple-500 to-violet-600', badge: 'bg-purple-100 text-purple-700' },
        ];
        return styles[index % styles.length];
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-extrabold text-2xl text-gray-900 leading-tight tracking-tight">Lobi Kuis Utama</h2>}
        >
            <Head title="Lobi Kuis" />

            <div className="py-12 min-h-screen" style={{ backgroundColor: theme.landingHeroBg }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header Banner */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-900 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 py-8 sm:py-10 mb-12 overflow-hidden relative"
                    >
                        {/* Motif Latar Belakang */}
                        <div className="absolute -top-16 -right-16 opacity-10 pointer-events-none">
                             <ShieldIcon sx={{ fontSize: 300, color: 'white' }} />
                        </div>

                        <div className="relative z-10 max-w-2xl">
                            <span className="inline-block py-1.5 px-4 rounded-full text-xs font-black tracking-widest uppercase mb-4 text-white bg-white/20 backdrop-blur-md">
                                ARENA EVALUASI
                            </span>
                            <h3 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight leading-none">
                                Uji Ketangkasan Bahasa Jepangnya!
                            </h3>
                            <p className="text-gray-300 font-medium text-base sm:text-lg leading-relaxed">
                                Selesaikan kuis untuk menambang Experience Points (XP) dan tingkatkan Level karaktermu. Jangan lupa bahwa rekor tanpa cacat memberikan bonus tambahan!
                            </p>
                        </div>
                    </motion.div>

                    {/* Katagog Kuis */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {quizzes.length === 0 && (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500 font-bold text-lg">Belum ada Kuis yang tersedia.</p>
                            </div>
                        )}
                        {quizzes.map((quiz, idx) => {
                            const style = getCardStyle(idx, quiz.status);
                            return (
                            <motion.div 
                                key={quiz.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`relative rounded-[2rem] p-8 border-2 transition-all duration-300 ${style.bg} ${style.border} ${quiz.status !== 'locked' ? 'hover:-translate-y-3' : ''}`}
                                style={{ boxShadow: style.shadow }}
                            >
                                {/* Kunci / Tersedia Badge */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${style.hint} text-white shadow-xl`}>
                                        <WorkspacePremiumIcon sx={{ fontSize: 28 }} />
                                    </div>
                                    <span className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase tracking-widest ${style.badge}`}>
                                        {quiz.status === 'locked' ? 'Terkunci' : 'Tersedia'}
                                    </span>
                                </div>

                                <h4 className={`text-2xl font-black mb-3 leading-tight ${style.text}`}>
                                    {quiz.title}
                                </h4>
                                <p className="text-gray-500 font-medium text-sm mb-8 min-h-[3rem] leading-relaxed">
                                    {quiz.description}
                                </p>

                                <div className="flex flex-wrap items-center gap-5 mb-8 text-sm font-bold text-gray-400 border-t border-gray-100 pt-6">
                                    <span className="flex items-center gap-1.5"><AccessTimeIcon sx={{ fontSize: 18 }} /> {quiz.durationEstimate}</span>
                                    <span className="flex items-center gap-1.5">★ {quiz.totalQuestions} Soal</span>
                                    <span className="flex items-center gap-1.5 text-green-500 font-black px-2 py-1 bg-green-50 rounded-lg">+{quiz.xpReward} XP</span>
                                </div>

                                {/* Tombol Aksi */}
                                {quiz.status === 'locked' ? (
                                    <button disabled className="w-full py-4 bg-slate-100 text-slate-400 font-black tracking-wide rounded-2xl cursor-not-allowed uppercase border border-slate-200">
                                        MASIH TERKUNCI
                                    </button>
                                ) : (
                                    <Link 
                                        href={`/user/quizzes/${quiz.id}`} 
                                        className={`w-full flex items-center justify-center gap-2 py-4 text-white font-black text-base md:text-lg tracking-wide rounded-2xl transition-all hover:brightness-110 active:translate-y-1 bg-gradient-to-br ${theme.ctaBg}`}
                                        style={{ boxShadow: `0 6px 0 0 ${theme.activeShadow}` }}
                                    >
                                        <PlayArrowIcon /> MULAI TANTANGAN
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
