import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import LessonArticle from '@/Components/Lesson/LessonArticle';
import BoardCanvas from '@/Components/Board/BoardCanvas';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';

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

    if (!normalizedPath || /^https?:\/\//i.test(normalizedPath)) {
        return lesson;
    }

    return {
        ...lesson,
        file_preview_url: lesson.file_preview_url || `/lesson-documents/${normalizedPath}`,
        file_download_url: lesson.file_download_url || `/lesson-documents-download/${normalizedPath}`,
    };
};

export default function Lesson({ lesson, lessons = [], is_completed, boards = [] }) {
    const { auth } = usePage().props;
    const activeLesson = buildLessonDocumentUrls(lesson);
    const activeIndex = lessons.findIndex(l => l.is_active);
    const prevLesson = activeIndex > 0 ? lessons[activeIndex - 1] : null;
    const nextLesson = activeIndex < lessons.length - 1 ? lessons[activeIndex + 1] : null;
    const completedCount = lessons.filter(l => l.is_completed).length;
    const progressPct = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

    const handleComplete = () => {
        router.post(route('user.lessons.complete'), {
            lesson_id: lesson.id,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-wrap items-center gap-3">
                    <Link href={route('user.dashboard')} className="text-sm font-medium text-gray-400 transition-colors hover:text-gray-600">
                        ← Dashboard
                    </Link>
                    <span className="text-gray-300">/</span>
                    <span className="text-sm font-medium text-gray-500">{activeLesson.module?.title ?? 'Module'}</span>
                    <span className="text-gray-300">/</span>
                    <span className="text-sm font-bold text-gray-900">{activeLesson.title}</span>
                    <div className="flex w-full flex-wrap items-center gap-3 sm:ml-auto sm:w-auto">
                        <div className="flex h-8 items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500"></span>
                            <span className="text-xs font-bold text-amber-600">{auth.user.streak_count ?? 0} Day Streak</span>
                        </div>
                        {is_completed && (
                            <div className="flex items-center gap-1.5 rounded-lg border border-green-100 bg-green-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-green-600">
                                <CheckCircleIcon sx={{ fontSize: 12 }} />
                                Selesai
                            </div>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={`Lesson - ${activeLesson.title}`} />

            <div className="flex flex-col items-start gap-6 lg:flex-row">
                <aside className="hidden w-[280px] shrink-0 lg:sticky lg:top-20 lg:block">
                    <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-gray-400">Current Module</p>
                        <div className="mb-3 flex items-end justify-between">
                            <h3 className="text-sm font-black leading-tight text-gray-900">{activeLesson.module?.title ?? 'Module'}</h3>
                            <span className="text-sm font-black text-red-600">{progressPct}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                            <div className="h-full rounded-full bg-red-600 transition-all duration-500" style={{ width: `${progressPct}%` }}></div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-gray-400">Course Content</h4>
                        <div className="relative space-y-2">
                            <div className="absolute bottom-8 left-4 top-8 w-px bg-gray-100"></div>
                            {lessons.map((item) => (
                                <div key={item.id}>
                                    {item.is_locked ? (
                                        <div className="flex items-start gap-3 rounded-xl p-3 opacity-50">
                                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-black text-gray-400">
                                                {String(item.order).padStart(2, '0')}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h5 className="text-xs font-bold leading-tight text-gray-500">{item.title}</h5>
                                                <p className="mt-0.5 text-[10px] text-gray-400">{item.type} • {item.duration_minutes ?? '-'} min</p>
                                            </div>
                                            <LockIcon sx={{ fontSize: 12 }} className="mt-1 text-gray-300" />
                                        </div>
                                    ) : item.is_completed ? (
                                        <Link href={route('user.lessons.show', item.id)} className="flex items-start gap-3 rounded-xl p-3 no-underline transition-colors hover:bg-gray-50">
                                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-500">
                                                <CheckCircleIcon sx={{ fontSize: 16 }} />
                                            </div>
                                            <div className="min-w-0">
                                                <h5 className="text-xs font-bold leading-tight text-gray-400 line-through">{item.title}</h5>
                                                <p className="mt-0.5 text-[10px] text-gray-400">Completed</p>
                                            </div>
                                        </Link>
                                    ) : (
                                        <Link href={route('user.lessons.show', item.id)} className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-3 no-underline">
                                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-black text-white shadow-sm">
                                                {String(item.order).padStart(2, '0')}
                                            </div>
                                            <div className="min-w-0">
                                                <h5 className="text-xs font-bold leading-tight text-gray-900">{item.title}</h5>
                                                <p className="mt-0.5 text-[10px] font-bold text-red-500">{item.type} • {item.duration_minutes ?? '-'} min</p>
                                            </div>
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                <main className="min-w-0 flex-1">
                    <LessonArticle
                        lesson={activeLesson}
                        moduleTitle={activeLesson.module?.title}
                        isCompleted={is_completed}
                        progressLabel={lessons.length > 0 ? `Lesson ${activeIndex + 1} of ${lessons.length}` : null}
                    />

                    {boards.length > 0 && (
                        <section className="mt-6 overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <div className="border-b border-orange-50 bg-gradient-to-r from-orange-50 to-white px-5 py-5 dark:border-gray-800 dark:from-gray-900 dark:to-gray-900 sm:px-7">
                                <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-600">Board Ajar</p>
                                <h2 className="mt-2 text-xl font-black text-gray-950 dark:text-white">Catatan Visual Sensei</h2>
                                <p className="mt-1 max-w-2xl text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Papan ajar tambahan dari sensei untuk membantu memahami coretan, alur, atau contoh visual pada materi ini.
                                </p>
                            </div>
                            <div className="space-y-5 p-4 sm:p-6">
                                {boards.map((board) => (
                                    <article key={board.id} className="rounded-3xl border border-gray-100 bg-[#FFFDF8] p-3 dark:border-gray-800 dark:bg-gray-950 sm:p-5">
                                        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <h3 className="text-lg font-black text-gray-950 dark:text-white">{board.title}</h3>
                                                {board.description && (
                                                    <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">{board.description}</p>
                                                )}
                                            </div>
                                            {board.updated_at && (
                                                <span className="rounded-full bg-orange-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-orange-600 dark:bg-orange-900/20">
                                                    Updated
                                                </span>
                                            )}
                                        </div>
                                        <BoardCanvas strokes={board.board_data?.strokes || []} />
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4 pb-8 pt-6">
                        {prevLesson && !prevLesson.is_locked ? (
                            <Link href={route('user.lessons.show', prevLesson.id)} className="flex h-12 items-center rounded-xl border border-gray-200 bg-white px-6 font-bold text-gray-500 no-underline transition-colors hover:bg-gray-50">
                                ← Previous
                            </Link>
                        ) : <div />}

                        {!is_completed && (
                            <button
                                onClick={handleComplete}
                                className="h-12 rounded-xl bg-green-600 px-8 font-bold text-white shadow-lg shadow-green-500/30 transition-transform hover:scale-105 hover:bg-green-700"
                            >
                                ✓ Tandai Selesai
                            </button>
                        )}

                        {nextLesson && !nextLesson.is_locked ? (
                            <Link href={route('user.lessons.show', nextLesson.id)} className="flex h-12 items-center rounded-xl bg-red-600 px-8 font-bold text-white no-underline shadow-lg shadow-red-500/30 transition-transform hover:scale-105 hover:bg-red-700">
                                Next Lesson →
                            </Link>
                        ) : (
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                {lessons.length > 0 ? `Lesson ${activeIndex + 1} of ${lessons.length}` : ''}
                            </span>
                        )}
                    </div>
                </main>
            </div>
        </AuthenticatedLayout>
    );
}
