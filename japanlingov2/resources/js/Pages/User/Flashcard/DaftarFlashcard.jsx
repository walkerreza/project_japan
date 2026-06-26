import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import theme from '@/Components/theme/themes';
import StyleOutlinedIcon from '@mui/icons-material/StyleOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';

export default function DaftarFlashcard({ reviewItems = [], sets = [] }) {
    const hasReviewItems = reviewItems.length > 0;

    return (
        <AuthenticatedLayout>
            <Head title="Review Kosakata" />

            <div className={`min-h-screen transition-colors duration-300 ${theme.bgColor || 'bg-[#FAFAF8]'} dark:bg-gray-950 px-4 py-8 sm:px-6 lg:px-8 relative overflow-hidden`}>
                {/* Kanji Watermark Background */}
                <div className="absolute top-10 right-10 text-[20rem] font-black text-orange-200/30 dark:text-gray-800/30 select-none pointer-events-none -z-10 rotate-12">
                    語
                </div>

                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <header className="mb-8 relative z-10">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-black uppercase tracking-[0.25em] mb-3 transition-colors duration-300">
                                    <WorkspacePremiumOutlinedIcon fontSize="small" />
                                    <span>Area Review</span>
                                </div>
                                <h1 className={`text-3xl sm:text-4xl font-black ${theme.textColor || 'text-gray-950'} dark:text-white drop-shadow-sm transition-colors duration-300`}>
                                    Kosakata yang Belum Paham
                                </h1>
                                <p className="mt-2 max-w-2xl text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">
                                    Tingkatkan penguasaanmu! Kata yang ditandai <strong>Belum Paham</strong> saat kuis akan masuk ke kotak ini.
                                </p>
                            </div>
                            <div className={`flex flex-col items-center justify-center h-20 w-20 shrink-0 rounded-2xl ${theme.ctaBg || 'bg-orange-600'} shadow-lg shadow-orange-500/20 text-white transform transition duration-300 hover:scale-105`}>
                                <span className="text-2xl font-black">{reviewItems.length}</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Kartu</span>
                            </div>
                        </div>
                    </header>

                    {/* Bento Grid Container */}
                    <div className="lg:grid lg:grid-cols-12 lg:gap-6 space-y-6 lg:space-y-0 relative z-10">
                        
                        {/* Main Content: Review Items (Left Column) */}
                        <div className="lg:col-span-8 space-y-5">
                            {hasReviewItems ? (
                                <section className="space-y-8 sm:space-y-6">
                                    {reviewItems.map((item) => (
                                        <article key={item.id} className="relative group perspective-1000">
                                            {/* Stacked Flashcard Effect */}
                                            <div className="absolute inset-0 bg-orange-50/60 dark:bg-gray-800/60 rounded-3xl transform translate-y-3 translate-x-3 -z-20 border border-orange-200 dark:border-gray-700 transition-transform duration-300 group-hover:translate-x-4 group-hover:translate-y-4"></div>
                                            <div className="absolute inset-0 bg-orange-50/80 dark:bg-gray-800/80 rounded-3xl transform translate-y-1.5 translate-x-1.5 -z-10 border border-orange-200 dark:border-gray-700 transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2"></div>
                                            
                                            <div className="relative rounded-3xl border border-orange-200 bg-gradient-to-br from-white to-orange-50/30 p-6 shadow-md shadow-orange-100 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-orange-200/50 dark:border-gray-800 dark:from-gray-900 dark:to-gray-900 dark:shadow-none overflow-hidden">
                                                {/* Card Background Kanji */}
                                                <div className="absolute -right-4 -bottom-8 text-8xl font-black text-orange-50 dark:text-gray-800/30 select-none pointer-events-none z-0 transition-colors duration-300">
                                                    {item.front_text}
                                                </div>

                                                <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-center gap-4 mb-2">
                                                            <h2 className={`text-4xl sm:text-5xl font-black ${theme.activeColor || 'text-orange-600'} dark:text-white drop-shadow-sm transition-colors duration-300`}>
                                                                {item.front_text}
                                                            </h2>
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-sm font-bold text-gray-400 dark:text-gray-500 tracking-wider">
                                                                    {item.reading || '-'}
                                                                </span>
                                                                <span className="inline-flex w-fit items-center gap-1 rounded-md bg-red-50 dark:bg-red-900/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-red-600 dark:text-red-400 transition-colors duration-300">
                                                                    <AccessTimeOutlinedIcon sx={{ fontSize: 12 }} />
                                                                    x{item.learning_count} Misses
                                                                </span>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="mt-4 inline-flex items-center gap-2 border-l-4 border-orange-400 pl-3">
                                                            <TranslateOutlinedIcon className="text-gray-400 dark:text-gray-500" fontSize="small" />
                                                            <p className="text-base font-black text-gray-800 dark:text-gray-100 transition-colors duration-300">
                                                                {item.back_text || 'Belum ada arti'}
                                                            </p>
                                                        </div>

                                                        {(item.example_sentence || item.example_meaning) && (
                                                            <div className="mt-4 rounded-xl bg-orange-50/50 dark:bg-gray-800/50 p-4 border border-orange-100 dark:border-gray-800 transition-colors duration-300">
                                                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 italic">
                                                                    "{item.example_sentence}"
                                                                </p>
                                                                {item.example_meaning && (
                                                                    <p className="mt-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                                                                        {item.example_meaning}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        )}

                                                        <div className="mt-5 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-wider">
                                                            {item.level && <span className="rounded-full border border-orange-200 dark:border-gray-700 px-3 py-1 text-gray-700 dark:text-gray-300 backdrop-blur-sm transition-colors duration-300">{item.level}</span>}
                                                            {item.module && <span className="rounded-full border border-orange-200 dark:border-gray-700 px-3 py-1 text-gray-700 dark:text-gray-300 backdrop-blur-sm transition-colors duration-300">{item.module}</span>}
                                                            {item.last_reviewed_at && <span className="rounded-full bg-lime-50 dark:bg-lime-900/20 px-3 py-1 text-lime-700 dark:text-lime-400 transition-colors duration-300">{item.last_reviewed_at}</span>}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="sm:pl-6 sm:border-l border-gray-100 dark:border-gray-800 mt-2 sm:mt-0">
                                                        <Link 
                                                            href={route('user.flashcards.show', item.set_id)} 
                                                            className={`flex h-12 w-full sm:w-auto min-w-[130px] items-center justify-center gap-2 rounded-2xl ${theme.ctaBg || 'bg-orange-600'} px-6 text-xs font-black uppercase tracking-wide text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30`}
                                                        >
                                                            <StyleOutlinedIcon fontSize="small" />
                                                            Review
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </section>
                            ) : (
                                <section className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-orange-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-10 text-center transition-colors duration-300 min-h-[400px]">
                                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-lime-100 to-green-50 dark:from-lime-900/40 dark:to-green-900/20 mb-6 shadow-inner relative animate-bounce">
                                        <EmojiEventsOutlinedIcon sx={{ fontSize: 64 }} className="text-lime-600 dark:text-lime-400" />
                                        {/* Floating accents */}
                                        <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-yellow-400 animate-pulse"></div>
                                        <div className="absolute bottom-4 left-2 h-3 w-3 rounded-full bg-green-400 animate-ping"></div>
                                    </div>
                                    <h2 className="text-2xl font-black text-gray-950 dark:text-white transition-colors duration-300">Wow, Sempurna! 🏆</h2>
                                    <p className="mx-auto mt-3 max-w-md text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed transition-colors duration-300">
                                        Tidak ada kosakata sulit untuk saat ini. Penguasaan bahasamu luar biasa! Terus kerjakan kuis untuk menantang memori.
                                    </p>
                                    <Link 
                                        href={route('user.quizzes.index')} 
                                        className={`mt-8 inline-flex h-12 items-center gap-2 rounded-2xl ${theme.ctaBg || 'bg-orange-600'} px-8 text-sm font-black uppercase tracking-wide text-white shadow-lg hover:scale-105 transition-all duration-300`}
                                    >
                                        <LibraryBooksOutlinedIcon fontSize="small" />
                                        Mulai Kuis Baru
                                    </Link>
                                </section>
                            )}
                        </div>

                        {/* Sidebar: Set Fast Card (Right Column) */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-8">
                                <section className="rounded-[2rem] border border-orange-200 bg-gradient-to-br from-white to-orange-50/30 dark:border-gray-800 dark:from-gray-900 dark:to-gray-900 overflow-hidden shadow-md shadow-orange-100 dark:shadow-none transition-colors duration-300">
                                    <div className="bg-orange-50/50 dark:bg-gray-800/50 px-6 py-6 border-b border-orange-100 dark:border-gray-800 transition-colors duration-300">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2">
                                                <LibraryBooksOutlinedIcon className="text-orange-500" />
                                                <h2 className="text-lg font-black text-gray-950 dark:text-white transition-colors duration-300">Set Fast Card</h2>
                                            </div>
                                            <span className="rounded-full bg-white dark:bg-gray-900 border border-orange-200 dark:border-gray-700 px-3 py-1 text-xs font-black text-gray-700 dark:text-gray-300 shadow-sm transition-colors duration-300">
                                                {sets.length} Set
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium transition-colors duration-300">
                                            Latih memori dengan set flashcard yang tersedia.
                                        </p>
                                    </div>

                                    <div className="p-5 flex flex-col gap-4">
                                        {sets.length > 0 ? (
                                            sets.map((set) => (
                                                <div 
                                                    key={set.id} 
                                                    className="group flex flex-col gap-3 rounded-2xl border border-orange-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 p-5 transition-all duration-300 hover:border-orange-300 dark:hover:border-orange-900/50 hover:shadow-md hover:shadow-orange-100 dark:hover:shadow-orange-900/10 hover:-translate-y-1"
                                                >
                                                    <div className="min-w-0">
                                                        <h3 className="truncate text-sm font-black text-gray-900 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                                                            {set.title}
                                                        </h3>
                                                        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold text-gray-600 dark:text-gray-400">
                                                            <span className="inline-flex items-center gap-1 bg-orange-50 dark:bg-gray-800 px-2.5 py-1 rounded-md transition-colors duration-300 text-gray-700 dark:text-gray-300">
                                                                <StyleOutlinedIcon sx={{ fontSize: 14 }} />
                                                                {set.flashcards_count} Kartu
                                                            </span>
                                                            {set.module && (
                                                                <span className="bg-orange-50 dark:bg-gray-800 px-2.5 py-1 rounded-md truncate max-w-[120px] transition-colors duration-300 text-gray-700 dark:text-gray-300">
                                                                    {set.module}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Link 
                                                        href={route('user.flashcards.show', set.id)} 
                                                        className={`w-full rounded-xl bg-orange-50 dark:bg-orange-900/20 py-3 text-center text-xs font-black uppercase tracking-wide text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors duration-300 mt-1`}
                                                    >
                                                        Review Set
                                                    </Link>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-10 text-center px-4">
                                                <StyleOutlinedIcon className="text-gray-300 dark:text-gray-700 mb-3" sx={{ fontSize: 48 }} />
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Belum ada set fast card tersedia.</p>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
