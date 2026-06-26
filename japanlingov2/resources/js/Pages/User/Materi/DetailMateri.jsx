import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import LessonArticle from '@/Components/Features/Lesson/LessonArticle';
import BoardCanvas from '@/Components/Features/Board/BoardCanvas';
import { motion, AnimatePresence } from 'framer-motion';
import theme from '@/Components/theme/themes';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import BoltIcon from '@mui/icons-material/Bolt';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const TYPE_ICON = {
    text: '📖', video: '🎬', audio: '🎧', presentation: '🪄', document: '📄',
};

const normalizeDocumentPath = (path) => {
    if (!path) return null;
    return String(path)
        .replaceAll('\\', '/')
        .replaceAll('%2F', '/')
        .replace(/^.*\/lesson-documents-download\//, '')
        .replace(/^.*\/lesson-documents\//, '')
        .replace(/^\/storage\//, '');
};

const buildLessonDocumentUrls = (lesson) => {
    const normalizedPath = normalizeDocumentPath(lesson?.file_url);
    if (!normalizedPath || /^https?:\/\//i.test(normalizedPath)) return lesson;
    return {
        ...lesson,
        file_preview_url: lesson.file_preview_url || `/lesson-documents/${normalizedPath}`,
        file_download_url: lesson.file_download_url || `/lesson-documents-download/${normalizedPath}`,
    };
};

export default function DetailMateri({ lesson, lessons = [], is_completed, boards = [] }) {
    const { auth } = usePage().props;
    const [showCompleteAnim, setShowCompleteAnim] = useState(false);

    const activeLesson = buildLessonDocumentUrls(lesson);
    const activeIndex = lessons.findIndex(l => l.is_active);
    const prevLesson = activeIndex > 0 ? lessons[activeIndex - 1] : null;
    const nextLesson = activeIndex < lessons.length - 1 ? lessons[activeIndex + 1] : null;
    const completedCount = lessons.filter(l => l.is_completed).length;
    const progressPct = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

    const handleComplete = () => {
        setShowCompleteAnim(true);
        setTimeout(() => {
            router.post(route('user.lessons.complete'), { lesson_id: lesson.id });
        }, 600);
    };

    return (
        <AuthenticatedLayout>
            <Head title={`${activeLesson.title} — Materi N3`} />

            <div className="flex min-h-screen bg-indigo-50/40 dark:bg-gray-950 transition-colors duration-300">

                {/* ──────────────────────────────────────────
                    SIDEBAR KIRI — Course Outline
                ────────────────────────────────────────── */}
                <aside className="hidden lg:flex flex-col w-[300px] xl:w-[320px] shrink-0 border-r border-indigo-200 dark:border-gray-800 bg-indigo-50 dark:bg-gray-900 sticky top-0 h-screen overflow-hidden transition-colors duration-300">

                    {/* Module header */}
                    <div className={`p-5 border-b border-indigo-200 dark:border-gray-800 ${theme?.sidebarHeaderBg || 'bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-gray-800 dark:to-gray-900'} transition-colors duration-300`}>
                        <Link href={route('user.lessons.index')} className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-3 transition-colors duration-300">
                            <ChevronLeftIcon sx={{ fontSize: 16 }} /> Kembali ke Daftar Materi
                        </Link>
                        <h2 className="font-black text-sm text-indigo-950 dark:text-indigo-50 leading-snug mb-3 transition-colors duration-300">
                            {activeLesson.module?.title ?? 'Modul'}
                        </h2>

                        {/* Progress */}
                        <div>
                            <div className="flex justify-between items-center mb-1.5 transition-colors duration-300">
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-800 dark:text-indigo-300">Progress</span>
                                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{progressPct}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden transition-colors duration-300">
                                <motion.div
                                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-600 dark:to-violet-600"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPct}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                />
                            </div>
                            <p className="text-[10px] text-indigo-700 dark:text-indigo-400 mt-1 font-medium transition-colors duration-300">{completedCount} / {lessons.length} materi selesai</p>
                        </div>

                        {/* Streak chip */}
                        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30 px-3 py-1.5 transition-colors duration-300">
                            <LocalFireDepartmentIcon sx={{ fontSize: 14, color: '#f97316' }} />
                            <span className="text-xs font-black text-orange-600 dark:text-orange-400">{auth.user.streak_count ?? 0} Day Streak</span>
                        </div>
                    </div>

                    {/* Lesson list */}
                    <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-indigo-200 dark:scrollbar-thumb-gray-800 transition-colors duration-300">
                        {lessons.map((item, i) => {
                            const icon = TYPE_ICON[item.type] || '📖';
                            const isActive = item.is_active;
                            const isDone = item.is_completed;
                            const isLocked = item.is_locked;

                            return (
                                <div key={item.id}>
                                    {isLocked ? (
                                        <div className="flex items-center gap-3 rounded-2xl px-3 py-2.5 opacity-40 cursor-not-allowed transition-colors duration-300">
                                            <div className="w-8 h-8 shrink-0 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-sm transition-colors duration-300">
                                                🔒
                                            </div>
                                            <div className="min-w-0 flex-1 transition-colors duration-300">
                                                <p className="text-xs font-bold text-slate-800 dark:text-slate-300 truncate">{item.title}</p>
                                                <p className="text-[10px] text-slate-700 dark:text-slate-400">{item.duration_minutes ?? '-'} min</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <Link href={route('user.lessons.show', item.id)}
                                            className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-all duration-300 group
                                                ${isActive ? `${theme?.activeColor || 'bg-indigo-600 dark:bg-indigo-600'} shadow-md shadow-indigo-200 dark:shadow-indigo-900/30` : isDone ? 'hover:bg-green-100 dark:hover:bg-green-900/10' : 'hover:bg-indigo-200 dark:hover:bg-indigo-900/10'}`}
                                        >
                                            <div className={`w-8 h-8 shrink-0 rounded-xl flex items-center justify-center text-sm relative transition-colors duration-300
                                                ${isActive ? 'bg-white/20 dark:bg-white/10' : isDone ? 'bg-green-200 dark:bg-green-900/30' : 'bg-indigo-100 dark:bg-slate-800'}`}>
                                                {isDone ? <CheckCircleIcon sx={{ fontSize: 16, color: '#16a34a' }} /> : icon}
                                            </div>
                                            <div className="min-w-0 flex-1 transition-colors duration-300">
                                                <p className={`text-xs font-bold truncate leading-tight transition-colors duration-300 ${isActive ? 'text-white' : isDone ? 'text-green-900/70 dark:text-green-400/70 line-through' : 'text-indigo-950 dark:text-indigo-100'}`}>
                                                    {item.title}
                                                </p>
                                                <p className={`text-[10px] font-medium transition-colors duration-300 ${isActive ? 'text-indigo-200 dark:text-indigo-300' : isDone ? 'text-green-800 dark:text-green-500' : 'text-indigo-800 dark:text-indigo-300'}`}>
                                                    {item.type} • {item.duration_minutes ?? '-'} min
                                                </p>
                                            </div>
                                            {isDone && !isActive && (
                                                <BoltIcon sx={{ fontSize: 14, color: '#a3e635' }} className="shrink-0" />
                                            )}
                                        </Link>
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    {/* XP Reward preview */}
                    <div className="p-4 border-t border-indigo-100 dark:border-gray-800 transition-colors duration-300">
                        <div className="rounded-2xl bg-gradient-to-r from-indigo-100 to-violet-100 dark:from-gray-800 dark:to-gray-800 border border-indigo-200 dark:border-gray-700 p-3 flex items-center gap-3 transition-colors duration-300">
                            <EmojiEventsIcon sx={{ fontSize: 28, color: '#6366f1' }} />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-700 dark:text-indigo-400 transition-colors duration-300">Reward Materi Ini</p>
                                <p className="text-sm font-black text-indigo-950 dark:text-white transition-colors duration-300">+30 XP • Badge Pembaca</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ──────────────────────────────────────────
                    MAIN CONTENT
                ────────────────────────────────────────── */}
                <div className="flex-1 min-w-0 flex flex-col">

                    {/* Mobile breadcrumb / top bar */}
                    <div className="lg:hidden sticky top-0 z-20 bg-indigo-50/90 backdrop-blur dark:bg-gray-900 border-b border-indigo-200 dark:border-gray-800 px-4 py-3 flex items-center gap-3 transition-colors duration-300">
                        <Link href={route('user.lessons.index')} className="text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-indigo-100 transition-colors duration-300">
                            <ChevronLeftIcon />
                        </Link>
                        <div className="flex-1 min-w-0 transition-colors duration-300">
                            <p className="text-xs font-bold text-indigo-800 dark:text-indigo-300 truncate">{activeLesson.module?.title}</p>
                            <p className="text-sm font-black text-indigo-950 dark:text-indigo-50 truncate">{activeLesson.title}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-black text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2.5 py-1 rounded-full transition-colors duration-300">
                            <LocalFireDepartmentIcon sx={{ fontSize: 14 }} />
                            {auth.user.streak_count ?? 0}
                        </div>
                    </div>

                    {/* Lesson content */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">

                            {/* Status banner */}
                            <AnimatePresence>
                                {is_completed && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -12, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className="mb-6 flex items-center gap-3 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 px-4 py-3 transition-colors duration-300"
                                    >
                                        <CheckCircleIcon sx={{ fontSize: 20, color: '#22c55e' }} />
                                        <div>
                                            <p className="text-sm font-black text-green-700 dark:text-green-400 transition-colors duration-300">Materi Sudah Diselesaikan!</p>
                                            <p className="text-xs text-green-600/70 dark:text-green-500/70 font-medium transition-colors duration-300">Kamu bisa tetap membaca ulang kapanpun.</p>
                                        </div>
                                        <div className="ml-auto text-xs font-black text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-800/40 px-2 py-1 rounded-lg transition-colors duration-300">
                                            +30 XP ✓
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Lesson header chip */}
                            <div className="mb-4 flex items-center gap-2 flex-wrap transition-colors duration-300">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-full transition-colors duration-300">
                                    {activeLesson.module?.title ?? 'Modul'} • Lesson {activeIndex + 1} dari {lessons.length}
                                </span>
                                {is_completed && (
                                    <span className="text-[10px] font-black uppercase tracking-widest text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full flex items-center gap-1 transition-colors duration-300">
                                        <CheckCircleIcon sx={{ fontSize: 12 }} /> Selesai
                                    </span>
                                )}
                            </div>

                            {/* Lesson article */}
                            <LessonArticle
                                lesson={activeLesson}
                                moduleTitle={activeLesson.module?.title}
                                isCompleted={is_completed}
                                progressLabel={lessons.length > 0 ? `${activeIndex + 1} / ${lessons.length}` : null}
                            />

                            {/* Board Ajar */}
                            {boards.length > 0 && (
                                <motion.section
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="mt-8 rounded-3xl border border-amber-100 dark:border-amber-900/30 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-900 overflow-hidden shadow-sm transition-colors duration-300"
                                >
                                    <div className="px-6 py-5 border-b border-amber-100/70 dark:border-gray-800 flex items-center gap-3 transition-colors duration-300">
                                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-600 dark:to-orange-700 flex items-center justify-center text-white shadow-md transition-colors duration-300">
                                            🖊️
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 dark:text-orange-400 transition-colors duration-300">Catatan Visual</p>
                                            <h2 className="text-base font-black text-slate-900 dark:text-white transition-colors duration-300">Board Ajar Sensei</h2>
                                        </div>
                                    </div>
                                    <div className="space-y-4 p-4 sm:p-6 transition-colors duration-300">
                                        {boards.map((board) => (
                                            <article key={board.id} className="rounded-2xl border border-orange-300 dark:border-gray-800 bg-orange-100/90 backdrop-blur dark:bg-gray-900 p-4 sm:p-5 transition-colors duration-300">
                                                <div className="flex items-start justify-between mb-3 gap-2 transition-colors duration-300">
                                                    <div>
                                                        <h3 className="text-base font-black text-orange-950 dark:text-orange-50 transition-colors duration-300">{board.title}</h3>
                                                        {board.description && <p className="text-xs text-orange-900 dark:text-orange-200 font-medium mt-0.5 transition-colors duration-300">{board.description}</p>}
                                                    </div>
                                                    {board.updated_at && (
                                                        <span className="shrink-0 text-[9px] font-black uppercase tracking-widest text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-lg transition-colors duration-300">
                                                            Diperbarui
                                                        </span>
                                                    )}
                                                </div>
                                                <BoardCanvas strokes={board.board_data?.strokes || []} />
                                            </article>
                                        ))}
                                    </div>
                                </motion.section>
                            )}

                            {/* ── BOTTOM NAVIGATION ── */}
                            <div className="mt-10 pt-6 border-t border-indigo-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4 transition-colors duration-300">
                                {/* Prev */}
                                {prevLesson && !prevLesson.is_locked ? (
                                    <Link href={route('user.lessons.show', prevLesson.id)}
                                        className="flex items-center gap-2 h-11 px-5 rounded-2xl border-2 border-slate-200 dark:border-gray-700 font-bold text-sm text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300">
                                        <ChevronLeftIcon sx={{ fontSize: 18 }} /> Sebelumnya
                                    </Link>
                                ) : <div />}

                                {/* Complete button */}
                                {!is_completed ? (
                                    <motion.button
                                        onClick={handleComplete}
                                        whileTap={{ scale: 0.97 }}
                                        className={`relative h-12 px-8 rounded-2xl ${theme?.ctaBg || 'bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700'} text-white font-black text-sm shadow-lg shadow-green-400/30 dark:shadow-none hover:shadow-xl hover:shadow-green-400/40 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 duration-300`}
                                    >
                                        <AnimatePresence>
                                            {showCompleteAnim && (
                                                <motion.span
                                                    key="burst"
                                                    initial={{ scale: 0.5, opacity: 0 }}
                                                    animate={{ scale: 2, opacity: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute inset-0 rounded-2xl bg-green-400 dark:bg-green-500"
                                                />
                                            )}
                                        </AnimatePresence>
                                        <CheckCircleIcon sx={{ fontSize: 18 }} />
                                        Tandai Selesai · +30 XP
                                    </motion.button>
                                ) : (
                                    <div className="flex items-center gap-2 h-12 px-6 rounded-2xl bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-800/40 text-green-700 dark:text-green-400 font-black text-sm transition-colors duration-300">
                                        <CheckCircleIcon sx={{ fontSize: 16 }} /> Sudah Selesai
                                    </div>
                                )}

                                {/* Next */}
                                {nextLesson && !nextLesson.is_locked ? (
                                    <Link href={route('user.lessons.show', nextLesson.id)}
                                        className={`flex items-center gap-2 h-11 px-5 rounded-2xl ${theme?.activeColor || 'bg-indigo-600 dark:bg-indigo-600'} text-white font-bold text-sm shadow-md shadow-indigo-400/30 dark:shadow-none hover:bg-indigo-700 dark:hover:bg-indigo-700 hover:-translate-y-0.5 transition-all duration-300`}>
                                        Materi Selanjutnya <ChevronRightIcon sx={{ fontSize: 18 }} />
                                    </Link>
                                ) : (
                                    <span className="text-xs font-black text-slate-500 dark:text-slate-600 uppercase tracking-widest transition-colors duration-300">
                                        {lessons.length > 0 ? `${activeIndex + 1} / ${lessons.length}` : ''}
                                    </span>
                                )}
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
