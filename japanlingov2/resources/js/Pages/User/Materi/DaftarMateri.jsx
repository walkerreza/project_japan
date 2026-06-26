import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import BoltIcon from '@mui/icons-material/Bolt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

const FILTERS = [
    { key: 'all', label: 'Semua' },
    { key: 'available', label: 'Tersedia' },
    { key: 'locked', label: 'Terkunci' },
];

const TYPE_META = {
    text: {
        label: 'Materi Baca',
        icon: '読',
        color: 'from-sky-500 to-indigo-600',
        badge: 'bg-sky-50 text-sky-700 ring-sky-100 dark:bg-sky-500/10 dark:text-sky-200 dark:ring-sky-400/20',
    },
    video: {
        label: 'Video',
        icon: '見',
        color: 'from-rose-500 to-orange-500',
        badge: 'bg-rose-50 text-rose-700 ring-rose-100 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-400/20',
    },
    audio: {
        label: 'Audio',
        icon: '聞',
        color: 'from-violet-500 to-fuchsia-600',
        badge: 'bg-violet-50 text-violet-700 ring-violet-100 dark:bg-violet-500/10 dark:text-violet-200 dark:ring-violet-400/20',
    },
    presentation: {
        label: 'Presentasi',
        icon: '学',
        color: 'from-amber-400 to-orange-600',
        badge: 'bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-400/20',
    },
    document: {
        label: 'Dokumen',
        icon: '資',
        color: 'from-emerald-500 to-teal-600',
        badge: 'bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-400/20',
    },
};

const getTypeMeta = (type) => TYPE_META[type] || TYPE_META.text;

const getFilteredLessons = (lessons, filter) => {
    if (filter === 'available') return lessons.filter((lesson) => lesson.status === 'available');
    if (filter === 'locked') return lessons.filter((lesson) => lesson.status === 'locked');

    return lessons;
};

export default function DaftarMateri({ lessons = [] }) {
    const [filter, setFilter] = useState('all');

    const filteredLessons = getFilteredLessons(lessons, filter);
    const completedCount = lessons.filter((lesson) => lesson.status !== 'locked' && lesson.is_completed).length;
    const availableCount = lessons.filter((lesson) => lesson.status !== 'locked').length;
    const progressPct = availableCount > 0 ? Math.round((completedCount / availableCount) * 100) : 0;
    const totalXp = lessons.length * 30;

    return (
        <AuthenticatedLayout>
            <Head title="Materi JLPT N3" />

            <main className="min-h-screen overflow-hidden bg-[#f6f8ef] pb-20 text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
                <section className="relative isolate border-b border-lime-950/10 bg-[radial-gradient(circle_at_top_left,#d9f99d_0,transparent_30%),linear-gradient(135deg,#fefce8_0%,#ecfccb_42%,#dbeafe_100%)] px-4 py-8 dark:border-white/10 dark:bg-[radial-gradient(circle_at_top_left,rgba(132,204,22,0.18)_0,transparent_34%),linear-gradient(135deg,#0f172a_0%,#111827_48%,#1e1b4b_100%)] sm:px-6 lg:px-8">
                    <div className="pointer-events-none absolute right-[-8rem] top-[-8rem] h-80 w-80 rounded-full bg-white/50 blur-3xl dark:bg-indigo-500/10" />
                    <div className="pointer-events-none absolute bottom-[-7rem] left-[-6rem] h-72 w-72 rounded-full bg-lime-200/60 blur-3xl dark:bg-lime-400/10" />

                    <div className="relative mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-2xl shadow-lime-950/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/30 sm:p-8"
                        >
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-lime-200 bg-lime-50 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-lime-700 dark:border-lime-300/20 dark:bg-lime-300/10 dark:text-lime-100">
                                <span className="h-2 w-2 rounded-full bg-lime-500" />
                                JLPT N3 · Ruang Belajar
                            </div>

                            <h1 className="max-w-3xl text-4xl font-black leading-[0.98] tracking-tight text-slate-950 dark:text-white sm:text-6xl">
                                Kuasai <span className="text-lime-600 dark:text-lime-300">日本語</span>
                                <span className="block text-slate-800 dark:text-slate-200">Satu Materi Sehari</span>
                            </h1>

                            <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-slate-700 dark:text-slate-300">
                                Pelajari materi secara berurutan, kumpulkan XP, dan naikkan level N3-mu bersama Sensei Fuad.
                            </p>

                            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-inner shadow-slate-200/70 dark:border-white/10 dark:bg-slate-950/70 dark:shadow-black/20">
                                <div className="mb-3 flex items-center justify-between gap-4">
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
                                        Progress Keseluruhan
                                    </span>
                                    <span className="rounded-full bg-lime-100 px-3 py-1 text-sm font-black text-lime-700 dark:bg-lime-300/10 dark:text-lime-200">
                                        {progressPct}%
                                    </span>
                                </div>
                                <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressPct}%` }}
                                        transition={{ duration: 0.8, ease: 'easeOut' }}
                                        className="h-full rounded-full bg-gradient-to-r from-lime-400 via-emerald-400 to-cyan-400"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.08 }}
                            className="grid grid-cols-3 gap-3"
                        >
                            <StatCard label="Selesai" value={completedCount} tone="lime" />
                            <StatCard label="Total" value={lessons.length} tone="sky" />
                            <StatCard label="Total XP" value={totalXp} tone="amber" icon={<BoltIcon sx={{ fontSize: 18 }} />} />
                        </motion.div>
                    </div>
                </section>

                <section className="relative mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-lime-700 dark:text-lime-300">
                                Learning Path
                            </p>
                            <h2 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
                                Pilih materi hari ini
                            </h2>
                        </div>

                        <div className="grid grid-cols-3 rounded-2xl border border-slate-200 bg-white p-1 shadow-lg shadow-slate-200/60 dark:border-white/10 dark:bg-slate-900 dark:shadow-black/20 sm:min-w-[360px]">
                            {FILTERS.map((item) => {
                                const isActive = filter === item.key;

                                return (
                                    <button
                                        key={item.key}
                                        type="button"
                                        onClick={() => setFilter(item.key)}
                                        className={`rounded-xl px-3 py-2 text-xs font-black transition ${
                                            isActive
                                                ? 'bg-slate-950 text-white shadow-md dark:bg-lime-300 dark:text-slate-950'
                                                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10'
                                        }`}
                                    >
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {filteredLessons.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="grid gap-4 lg:grid-cols-2">
                            {filteredLessons.map((lesson, index) => (
                                <LessonCard key={lesson.id} lesson={lesson} index={index} />
                            ))}
                        </div>
                    )}

                    {lessons.length > 0 && (
                        <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-6 text-center shadow-xl shadow-slate-200/60 dark:border-white/10 dark:bg-slate-900 dark:shadow-black/20">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-lime-300 to-emerald-400 text-2xl shadow-lg">
                                🎯
                            </div>
                            <h3 className="text-xl font-black text-slate-950 dark:text-white">Target JLPT N3</h3>
                            <p className="mx-auto mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
                                Selesaikan semua materi untuk membuka sertifikat dan menghadapi ujian N3 bersama Sensei Fuad.
                            </p>
                        </div>
                    )}
                </section>
            </main>
        </AuthenticatedLayout>
    );
}

function StatCard({ label, value, tone, icon = null }) {
    const tones = {
        lime: 'from-lime-200 to-lime-50 text-lime-800 dark:from-lime-400/20 dark:to-lime-300/5 dark:text-lime-100',
        sky: 'from-sky-200 to-sky-50 text-sky-800 dark:from-sky-400/20 dark:to-sky-300/5 dark:text-sky-100',
        amber: 'from-amber-200 to-amber-50 text-amber-800 dark:from-amber-400/20 dark:to-amber-300/5 dark:text-amber-100',
    };

    return (
        <div className={`rounded-[1.5rem] border border-white/80 bg-gradient-to-br ${tones[tone]} p-4 shadow-xl shadow-slate-900/10 dark:border-white/10 dark:shadow-black/20`}>
            <div className="flex items-center gap-1 text-2xl font-black">
                {icon}
                {value}
            </div>
            <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] opacity-75">{label}</p>
        </div>
    );
}

function LessonCard({ lesson, index }) {
    const meta = getTypeMeta(lesson.type);
    const isLocked = lesson.status === 'locked';
    const isCompleted = lesson.is_completed;
    const isPremiumLock = lesson.lockReason === 'premium';
    const href = isLocked ? null : route('user.lessons.show', lesson.id);

    const content = (
        <motion.article
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.035 }}
            className={`group relative overflow-hidden rounded-[1.75rem] border p-5 shadow-lg transition duration-300 ${
                isLocked
                    ? 'border-slate-200 bg-slate-100/90 opacity-80 dark:border-white/10 dark:bg-slate-900/70'
                    : 'border-white bg-white shadow-slate-200/80 hover:-translate-y-1 hover:shadow-2xl hover:shadow-lime-950/10 dark:border-white/10 dark:bg-slate-900 dark:shadow-black/20'
            }`}
        >
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-lime-200/50 blur-2xl dark:bg-lime-400/10" />

            <div className="relative flex gap-4">
                <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${isLocked ? 'from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-800' : meta.color} text-2xl font-black text-white shadow-lg`}>
                    {isLocked ? <LockIcon sx={{ fontSize: 26 }} /> : meta.icon}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ring-1 ${meta.badge}`}>
                            {lesson.level || 'N3'} · {meta.label}
                        </span>
                        {isCompleted && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-400/20">
                                <CheckCircleIcon sx={{ fontSize: 13 }} />
                                Selesai
                            </span>
                        )}
                    </div>

                    <h3 className={`line-clamp-2 text-base font-black leading-snug ${isLocked ? 'text-slate-600 dark:text-slate-300' : 'text-slate-950 dark:text-white'}`}>
                        {lesson.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
                        {isLocked
                            ? (isPremiumLock ? 'Butuh akses Premium untuk membuka materi ini.' : 'Selesaikan materi sebelumnya untuk membuka akses.')
                            : (lesson.description || 'Materi terstruktur untuk memperkuat kemampuan JLPT N3.')}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-black text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1">
                            <AccessTimeIcon sx={{ fontSize: 15 }} />
                            {lesson.durationEstimate || '10 Menit'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-300">
                            <BoltIcon sx={{ fontSize: 15 }} />
                            +30 XP
                        </span>
                    </div>
                </div>

                <div className="hidden shrink-0 items-center sm:flex">
                    {isLocked ? (
                        isPremiumLock ? (
                            <Link
                                href={route('pricing')}
                                className="rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 text-xs font-black uppercase tracking-wide text-white shadow-lg shadow-amber-500/25"
                            >
                                Upgrade
                            </Link>
                        ) : (
                            <div className="rounded-2xl bg-slate-200 px-4 py-2 text-xs font-black uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                Locked
                            </div>
                        )
                    ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg transition group-hover:scale-105 dark:bg-lime-300 dark:text-slate-950">
                            <PlayArrowIcon sx={{ fontSize: 24 }} />
                        </div>
                    )}
                </div>
            </div>

            {isLocked && isPremiumLock && (
                <Link
                    href={route('pricing')}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-3 text-xs font-black uppercase tracking-wide text-white shadow-lg shadow-amber-500/20 sm:hidden"
                >
                    <WorkspacePremiumIcon sx={{ fontSize: 17 }} />
                    Upgrade Premium
                </Link>
            )}
        </motion.article>
    );

    if (href) {
        return (
            <Link href={href} className="block focus:outline-none focus:ring-4 focus:ring-lime-300/60 rounded-[1.75rem]">
                {content}
            </Link>
        );
    }

    return content;
}

function EmptyState() {
    return (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-lg shadow-slate-200/60 dark:border-white/10 dark:bg-slate-900 dark:shadow-black/20">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-lime-100 text-lime-700 dark:bg-lime-300/10 dark:text-lime-200">
                <AutoStoriesIcon sx={{ fontSize: 30 }} />
            </div>
            <h3 className="text-lg font-black text-slate-950 dark:text-white">Belum ada materi tersedia</h3>
            <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                Coba ubah filter atau tunggu Sensei menambahkan materi baru.
            </p>
        </div>
    );
}
