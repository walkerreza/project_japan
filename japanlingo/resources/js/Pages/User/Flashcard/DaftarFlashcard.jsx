import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function DaftarFlashcard({ reviewItems = [], sets = [] }) {
    const hasReviewItems = reviewItems.length > 0;

    return (
        <AuthenticatedLayout>
            <Head title="Review Kosakata" />

            <div className="min-h-screen bg-[#FAFAF8] px-4 py-6 dark:bg-gray-950 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl space-y-5">
                    <header className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-600">Review Kosakata</p>
                                <h1 className="mt-2 text-2xl font-black text-gray-950 dark:text-white">Kosakata yang belum paham</h1>
                                <p className="mt-2 max-w-2xl text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Kata yang kamu tandai <strong>Belum Paham</strong> saat kuis akan muncul di sini.
                                </p>
                            </div>
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-2xl font-black text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                                {reviewItems.length}
                            </div>
                        </div>
                    </header>

                    {hasReviewItems ? (
                        <section className="space-y-3">
                            {reviewItems.map((item) => (
                                <article key={item.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-orange-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h2 className="text-2xl font-black text-gray-950 dark:text-white">{item.front_text}</h2>
                                                <span className="text-sm font-bold text-gray-400">{item.reading || '-'}</span>
                                                <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                                                    belum paham x{item.learning_count}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-sm font-black text-gray-800 dark:text-gray-100">{item.back_text || 'Belum ada arti'}</p>
                                            {(item.example_sentence || item.example_meaning) && (
                                                <p className="mt-2 line-clamp-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                                                    {item.example_sentence} {item.example_meaning ? `- ${item.example_meaning}` : ''}
                                                </p>
                                            )}
                                            <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-wider">
                                                {item.level && <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600 dark:bg-gray-800 dark:text-gray-300">{item.level}</span>}
                                                {item.module && <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600 dark:bg-gray-800 dark:text-gray-300">{item.module}</span>}
                                                {item.last_reviewed_at && <span className="rounded-full bg-lime-50 px-2.5 py-1 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300">{item.last_reviewed_at}</span>}
                                            </div>
                                        </div>
                                        <Link href={route('user.flashcards.show', item.set_id)} className="flex h-11 shrink-0 items-center justify-center rounded-xl bg-gray-950 px-5 text-xs font-black uppercase tracking-wide text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-gray-950">
                                            Review
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </section>
                    ) : (
                        <section className="rounded-3xl border border-dashed border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-50 text-2xl font-black text-lime-700 dark:bg-lime-900/30 dark:text-lime-300">
                                ✓
                            </div>
                            <h2 className="mt-4 text-xl font-black text-gray-950 dark:text-white">Belum ada kosakata sulit</h2>
                            <p className="mx-auto mt-2 max-w-xl text-sm font-medium text-gray-500 dark:text-gray-400">
                                Kerjakan kuis. Saat flashcard muncul, pilih <strong>Belum Paham</strong> agar kata itu masuk ke review.
                            </p>
                            <Link href={route('user.quizzes.index')} className="mt-5 inline-flex h-11 items-center rounded-xl bg-orange-600 px-5 text-xs font-black uppercase tracking-wide text-white">
                                Buka Kuis
                            </Link>
                        </section>
                    )}

                    {sets.length > 0 && (
                        <section className="rounded-3xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">Opsional</p>
                                    <h2 className="text-lg font-black text-gray-950 dark:text-white">Set Fast Card</h2>
                                </div>
                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-600 dark:bg-gray-800 dark:text-gray-300">{sets.length} set</span>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {sets.map((set) => (
                                    <div key={set.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="min-w-0">
                                            <h3 className="truncate text-sm font-black text-gray-950 dark:text-white">{set.title}</h3>
                                            <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">{set.flashcards_count} kartu {set.module ? `- ${set.module}` : ''}</p>
                                        </div>
                                        <Link href={route('user.flashcards.show', set.id)} className="text-xs font-black uppercase tracking-wide text-orange-600 hover:text-orange-700">
                                            Review set
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
