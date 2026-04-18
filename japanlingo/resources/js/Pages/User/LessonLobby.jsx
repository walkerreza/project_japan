import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import theme from '@/Components/theme/themes';

import MenuBookIcon from '@mui/icons-material/MenuBook';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TranslateIcon from '@mui/icons-material/Translate';

export default function LessonLobby() {
    // Data tiruan kuis yang tersedia (biasanya dipicu dari Inertia props Backend)
    const availableLessons = [
        {
            id: 1,
            title: "Pengenalan Huruf Hiragana",
            description: "Pelajari 46 huruf dasar untuk membaca kalimat Jepang.",
            xpReward: 10,
            durationEstimate: "15 Menit",
            totalPages: 5,
            status: "available",
            colorHint: "from-blue-400 to-blue-500",
            shadowHint: "shadow-blue-200"
        },
        {
            id: 2,
            title: "Pengucapan Vokal Diftong",
            description: "Memahami bagaimana bunyi gabungan AI, OI, dan EI diucapkan.",
            xpReward: 20,
            durationEstimate: "10 Menit",
            totalPages: 3,
            status: "locked",
            colorHint: "from-gray-300 to-gray-400",
            shadowHint: "shadow-gray-200"
        }
    ];

    return (
        <AuthenticatedLayout
            header={<h2 className="font-bold text-xl text-gray-800 leading-tight">Lobi Matapelajaran</h2>}
        >
            <Head title="Lobi Pelajaran" />

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
                             <TranslateIcon sx={{ fontSize: 240, color: theme.activeColor }} />
                        </div>

                        <div className="relative z-10 max-w-lg">
                            <span className="inline-block py-1 px-3 rounded-full text-sm font-bold tracking-wider uppercase mb-3" style={{ backgroundColor: theme.heroBlob1, color: theme.activeShadow }}>
                                RUANG LITERASI
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 tracking-tight">
                                Mulai Perjalanan Membacamu
                            </h3>
                            <p className="text-gray-500 font-medium text-base sm:text-lg leading-relaxed">
                                Baca dengan seksama, catat kosa kata baru, dan pahami tata nahunya sebelum kamu melaju ke Arena Kuis. Semakin banyak membaca, semakin kuat fondasimu!
                            </p>
                        </div>
                    </motion.div>

                    {/* Katagog Pelajaran */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {availableLessons.map((lesson, idx) => (
                            <motion.div 
                                key={lesson.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`relative rounded-3xl p-6 border-2 transition-all ${
                                    lesson.status === 'locked' 
                                    ? 'bg-gray-50 border-gray-200' 
                                    : 'bg-white border-gray-100 shadow-xl hover:-translate-y-2'
                                }`}
                                style={{
                                    boxShadow: lesson.status !== 'locked' ? `0 10px 30px -10px ${theme.activeColor}40` : 'none'
                                }}
                            >
                                {/* Kunci / Tersedia Badge */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${lesson.colorHint} text-white shadow-lg ${lesson.shadowHint}`}>
                                        <AutoStoriesIcon />
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-widest ${lesson.status === 'locked' ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-700'}`}>
                                        {lesson.status === 'locked' ? 'Terkunci' : 'Tersedia'}
                                    </span>
                                </div>

                                <h4 className={`text-xl font-black mb-2 ${lesson.status === 'locked' ? 'text-gray-500' : 'text-gray-900'}`}>
                                    {lesson.title}
                                </h4>
                                <p className="text-gray-500 font-medium text-sm mb-6 min-h-[3rem]">
                                    {lesson.description}
                                </p>

                                <div className="flex flex-wrap items-center gap-4 mb-8 text-sm font-bold text-gray-400">
                                    <span className="flex items-center gap-1.5"><AccessTimeIcon sx={{ fontSize: 18 }} /> {lesson.durationEstimate}</span>
                                    <span className="flex items-center gap-1.5"><MenuBookIcon sx={{ fontSize: 18 }} /> {lesson.totalPages} Halaman</span>
                                </div>

                                {/* Tombol Aksi */}
                                {lesson.status === 'locked' ? (
                                    <button disabled className="w-full py-4 bg-gray-100 text-gray-400 font-bold rounded-2xl cursor-not-allowed">
                                        BELUM BISA DIAKSES
                                    </button>
                                ) : (
                                    <Link 
                                        href={`/user/lessons/${lesson.id}`} 
                                        className={`w-full flex items-center justify-center gap-2 py-4 text-white font-black text-base md:text-lg rounded-2xl transition-all hover:brightness-110 active:translate-y-1 bg-gradient-to-br ${theme.ctaBg}`}
                                        style={{ boxShadow: `0 4px 0 0 ${theme.activeShadow}` }}
                                    >
                                        <MenuBookIcon /> BUKA MATERI
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
