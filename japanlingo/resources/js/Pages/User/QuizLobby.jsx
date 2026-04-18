import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import theme from '@/Components/theme/themes';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShieldIcon from '@mui/icons-material/Shield';

export default function QuizLobby() {
    // Data tiruan kuis yang tersedia (biasanya dipicu dari Inertia props Backend)
    const availableQuizzes = [
        {
            id: 1,
            title: "Kanji Dasar N5",
            description: "Uji pengetahuanmu tentang Kanji N5 level pengenalan.",
            xpReward: 50,
            durationEstimate: "5 Menit",
            totalQuestions: 10,
            status: "available",
            colorHint: "from-orange-400 to-orange-500",
            shadowHint: "shadow-orange-200"
        },
        {
            id: 2,
            title: "Sistem Menulis Kana",
            description: "Kuasai bentuk Hiragana & Katakana dengan cepat.",
            xpReward: 100,
            durationEstimate: "10 Menit",
            totalQuestions: 20,
            status: "locked",
            colorHint: "from-gray-300 to-gray-400",
            shadowHint: "shadow-gray-200"
        }
    ];

    return (
        <AuthenticatedLayout
            header={<h2 className="font-bold text-xl text-gray-800 leading-tight">Lobi Kuis Utama</h2>}
        >
            <Head title="Lobi Kuis" />

            <div className="py-12" style={{ backgroundColor: theme.landingHeroBg }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header Banner */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border-2 border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 py-8 sm:py-10 mb-10 overflow-hidden relative"
                    >
                        {/* Motif Latar Belakang */}
                        <div className="absolute -top-24 -right-16 opacity-20 sm:opacity-30 pointer-events-none">
                             <ShieldIcon sx={{ fontSize: 240, color: theme.activeColor }} />
                        </div>

                        <div className="relative z-10 max-w-lg">
                            <span className="inline-block py-1 px-3 rounded-full text-sm font-bold tracking-wider uppercase mb-3" style={{ backgroundColor: theme.heroBlob1, color: theme.activeShadow }}>
                                ARENA EVALUASI
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 tracking-tight">
                                Uji Ketangkasan Bahasa Jepangnya!
                            </h3>
                            <p className="text-gray-500 font-medium text-base sm:text-lg leading-relaxed">
                                Selesaikan kuis untuk menambang Experience Points (XP) dan tingkatkan Level karaktermu. Jangan lupa bahwa kesalahan dapat menghabiskan Nyawamu.
                            </p>
                        </div>
                    </motion.div>

                    {/* Katagog Kuis */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {availableQuizzes.map((quiz, idx) => (
                            <motion.div 
                                key={quiz.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`relative rounded-3xl p-6 border-2 transition-all ${
                                    quiz.status === 'locked' 
                                    ? 'bg-gray-50 border-gray-200' 
                                    : 'bg-white border-gray-100 shadow-xl hover:-translate-y-2'
                                }`}
                                style={{
                                    boxShadow: quiz.status !== 'locked' ? `0 10px 30px -10px ${theme.activeColor}40` : 'none'
                                }}
                            >
                                {/* Kunci / Tersedia Badge */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${quiz.colorHint} text-white shadow-lg ${quiz.shadowHint}`}>
                                        <WorkspacePremiumIcon />
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-widest ${quiz.status === 'locked' ? 'bg-gray-200 text-gray-500' : 'bg-green-100 text-green-700'}`}>
                                        {quiz.status === 'locked' ? 'Terkunci' : 'Tersedia'}
                                    </span>
                                </div>

                                <h4 className={`text-xl font-black mb-2 ${quiz.status === 'locked' ? 'text-gray-500' : 'text-gray-900'}`}>
                                    {quiz.title}
                                </h4>
                                <p className="text-gray-500 font-medium text-sm mb-6 min-h-[3rem]">
                                    {quiz.description}
                                </p>

                                <div className="flex flex-wrap items-center gap-4 mb-8 text-sm font-bold text-gray-400">
                                    <span className="flex items-center gap-1.5"><AccessTimeIcon sx={{ fontSize: 18 }} /> {quiz.durationEstimate}</span>
                                    <span className="flex items-center gap-1.5">★ {quiz.totalQuestions} Soal</span>
                                </div>

                                {/* Tombol Aksi */}
                                {quiz.status === 'locked' ? (
                                    <button disabled className="w-full py-4 bg-gray-100 text-gray-400 font-bold rounded-2xl cursor-not-allowed">
                                        MASIH TERKUNCI
                                    </button>
                                ) : (
                                    <Link 
                                        href={`/user/quizzes/${quiz.id}`} 
                                        className={`w-full flex items-center justify-center gap-2 py-4 text-white font-black text-base md:text-lg rounded-2xl transition-all hover:brightness-110 active:translate-y-1 bg-gradient-to-br ${theme.ctaBg}`}
                                        style={{ boxShadow: `0 4px 0 0 ${theme.activeShadow}` }}
                                    >
                                        <PlayArrowIcon /> MULAI TANTANGAN
                                    </Link>
                                )}
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
