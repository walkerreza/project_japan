import React, { useEffect, useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import theme from '@/Components/theme/themes';

const formatTime = (seconds) => {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const remainingSeconds = String(seconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${remainingSeconds}`;
};

export default function LatihanFlashcard({ set, cards = [] }) {
    const [index, setIndex] = useState(0);
    const [finished, setFinished] = useState(cards.length === 0);
    const [known, setKnown] = useState(0);
    const [learning, setLearning] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const card = cards[index];
    const progress = useMemo(() => (cards.length > 0 ? ((index + (finished ? 1 : 0)) / cards.length) * 100 : 0), [cards.length, finished, index]);

    useEffect(() => {
        if (finished) return undefined;

        const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
        return () => window.clearInterval(timer);
    }, [finished]);

    const playAudio = () => {
        if (!card?.audio_url) return;
        new Audio(card.audio_url).play();
    };

    const submitReview = (action) => {
        if (!card) return;

        const isLast = index >= cards.length - 1;
        if (action === 'known') {
            setKnown((value) => value + 1);
        } else {
            setLearning((value) => value + 1);
        }

        router.post(route('user.flashcards.review', card.id), {
            action,
            completed: isLast,
        }, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => {
                if (isLast) {
                    setFinished(true);
                    return;
                }

                setIndex((value) => value + 1);
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Flashcard - ${set.title}`} />

            <div className={`min-h-screen ${theme.bgColor || 'bg-[#FAFAF8]'} dark:bg-gray-950 transition-colors duration-300 relative overflow-hidden`}>
                <div className="absolute top-10 right-10 text-[20rem] font-black text-orange-200/20 dark:text-gray-800/30 select-none pointer-events-none -z-10 rotate-12">
                    練
                </div>
                <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-6 sm:px-6 lg:px-8 relative z-10">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <Link href={route('user.flashcards.index')} className="rounded-full bg-white border border-gray-200 dark:border-gray-800 px-4 py-2 text-xs font-black uppercase tracking-wider text-gray-700 shadow-sm dark:bg-gray-900 dark:text-gray-300 transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                            Keluar
                        </Link>
                        <div className="text-right">
                            <p className={`text-xs font-black uppercase tracking-[0.25em] ${theme.heroAccent || 'text-orange-600'} dark:text-orange-400 transition-colors duration-300`}>Fast Card</p>
                            <p className="text-sm font-bold text-gray-600 dark:text-gray-300 transition-colors duration-300">{set.title}</p>
                        </div>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800 transition-colors duration-300">
                        <div className={`h-full rounded-full bg-gradient-to-r ${theme.ctaBg || 'from-orange-500 to-amber-500'} transition-all duration-300`} style={{ width: `${progress}%` }} />
                    </div>

                    {finished ? (
                        <div className="my-auto rounded-[2rem] border border-orange-200 bg-gradient-to-br from-white to-orange-50/50 p-8 text-center shadow-xl shadow-orange-100 dark:border-gray-800 dark:from-gray-900 dark:to-gray-900 dark:shadow-none transition-colors duration-300">
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-teal-600 dark:text-teal-400 transition-colors duration-300">Sesi selesai</p>
                            <h1 className="mt-4 text-3xl font-black text-gray-900 dark:text-white transition-colors duration-300">Flashcard selesai</h1>
                            <p className="mt-3 text-sm font-bold text-gray-600 dark:text-gray-300 transition-colors duration-300">
                                Kamu menyelesaikan {cards.length} kartu dalam {formatTime(seconds)}.
                            </p>
                            <div className="mt-8 grid grid-cols-2 gap-3">
                                <div className="rounded-2xl bg-teal-50 p-5 dark:bg-teal-900/20 transition-colors duration-300">
                                    <p className="text-3xl font-black text-teal-700 dark:text-teal-300 transition-colors duration-300">{known}</p>
                                    <p className="text-xs font-black uppercase tracking-wider text-teal-600 dark:text-teal-400 transition-colors duration-300">Sudah Paham</p>
                                </div>
                                <div className="rounded-2xl bg-orange-50 p-5 dark:bg-orange-900/20 transition-colors duration-300">
                                    <p className="text-3xl font-black text-orange-700 dark:text-orange-300 transition-colors duration-300">{learning}</p>
                                    <p className="text-xs font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 transition-colors duration-300">Belum Paham</p>
                                </div>
                            </div>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                                <button onClick={() => { setIndex(0); setFinished(cards.length === 0); setKnown(0); setLearning(0); setSeconds(0); }} className={`rounded-2xl bg-gradient-to-r ${theme.ctaBg || 'from-gray-800 to-gray-900 dark:from-white dark:to-gray-100'} px-6 py-3 text-sm font-black text-white transition-colors duration-300 shadow-md hover:brightness-110 active:scale-[0.98]`}>
                                    Ulangi
                                </button>
                                <Link href={route('user.flashcards.index')} className="rounded-2xl bg-white border border-orange-200 px-6 py-3 text-sm font-black text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 transition-colors duration-300 hover:bg-orange-50 dark:hover:bg-gray-700 shadow-sm">
                                    Pilih Set Lain
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-1 flex-col">
                            <section className="mt-6 relative rounded-[2rem] border border-orange-200 bg-gradient-to-br from-white to-orange-50/50 p-5 shadow-xl shadow-orange-100 dark:border-gray-800 dark:from-gray-900 dark:to-gray-900 dark:shadow-none sm:p-8 transition-colors duration-300">
                                <div className="flex items-start gap-4 relative z-10">
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-orange-100 text-3xl dark:bg-orange-900/30 transition-colors duration-300 text-orange-600 dark:text-orange-400">あ</div>
                                    <div>
                                        <p className={`text-sm font-black ${theme.heroAccent || 'text-orange-600'} dark:text-orange-400 transition-colors duration-300`}>Kosakata baru untuk dipahami...</p>
                                        <p className="mt-1 text-xs font-bold text-gray-500 dark:text-gray-400 transition-colors duration-300">{index + 1}/{cards.length}</p>
                                    </div>
                                </div>

                                <div className="py-10 text-center sm:py-14">
                                    <p className="text-6xl font-black tracking-tight text-gray-950 dark:text-white sm:text-7xl transition-colors duration-300">{card.front_text}</p>
                                    <p className="mt-4 text-2xl font-bold text-gray-500 dark:text-gray-400 transition-colors duration-300">{card.reading || '-'}</p>
                                    <div className="mx-auto mt-5 h-px max-w-md bg-orange-200 dark:bg-orange-900/50 transition-colors duration-300" />
                                    <div className="mt-5 flex items-center justify-center gap-3">
                                        {card.audio_url && (
                                            <button onClick={playAudio} className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300 transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                                                ▶
                                            </button>
                                        )}
                                        {card.hint && <span className="rounded-full bg-orange-50 border border-orange-100 px-3 py-1 text-xs font-black text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 transition-colors duration-300">{card.hint}</span>}
                                    </div>
                                    <h2 className="mt-6 text-3xl font-black text-gray-900 dark:text-white transition-colors duration-300">{card.back_text || 'Belum ada arti'}</h2>
                                    <p className="mt-3 text-sm font-bold text-gray-600 dark:text-gray-400 transition-colors duration-300">Apakah kamu sudah paham kosakata ini?</p>
                                </div>

                                {(card.example_sentence || card.example_meaning) && (
                                    <div className="relative z-10 rounded-2xl bg-white/60 border border-orange-100 p-5 dark:border-gray-800 dark:bg-gray-800/50 transition-colors duration-300">
                                        <p className="text-base font-bold text-gray-800 dark:text-gray-200 transition-colors duration-300">{card.example_sentence}</p>
                                        <p className="mt-2 text-sm italic text-gray-600 dark:text-gray-400 transition-colors duration-300">{card.example_meaning}</p>
                                    </div>
                                )}
                            </section>

                            <section className="mt-8 grid grid-cols-2 gap-5">
                                <button
                                    onClick={() => submitReview('learning')}
                                    className="rounded-[2rem] bg-[var(--btn-bg)] px-5 py-5 text-center font-black text-white shadow-[0_8px_0_var(--btn-shadow)] transition-all duration-300 active:translate-y-1 active:shadow-[0_4px_0_var(--btn-shadow)]"
                                    style={{ '--btn-bg': theme.activeColor || '#fb923c', '--btn-shadow': theme.activeShadow || '#c2410c' }}
                                >
                                    <span className="block text-2xl">?</span>
                                    Belum Paham
                                </button>
                                <button
                                    onClick={() => submitReview('known')}
                                    className="rounded-[2rem] bg-[var(--btn-bg)] px-5 py-5 text-center font-black text-white shadow-[0_8px_0_var(--btn-shadow)] transition-all duration-300 active:translate-y-1 active:shadow-[0_4px_0_var(--btn-shadow)]"
                                    style={{ '--btn-bg': theme.doneColor || '#a3e635', '--btn-shadow': theme.doneShadow || '#65a30d' }}
                                >
                                    <span className="block text-2xl">✓</span>
                                    Sudah Paham
                                </button>
                            </section>

                            <footer className="mt-auto pt-8">
                                <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800 transition-colors duration-300">
                                    <div className="h-full rounded-full bg-[var(--progress-bg)] transition-all duration-300" style={{ width: `${((index + 1) / cards.length) * 100}%`, '--progress-bg': theme.activeColor || '#ef4444' }} />
                                </div>
                                <div className="grid grid-cols-3 gap-2 py-4 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                                    <div><span className="block text-xs">Time</span><span className="font-black text-gray-900 dark:text-white">{formatTime(seconds)}</span></div>
                                    <div><span className="block text-xs">Reviews</span><span className="font-black text-gray-900 dark:text-white">{index + 1} / {cards.length}</span></div>
                                    <div><span className="block text-xs">Progress</span><span className="font-black text-gray-900 dark:text-white">{card.status === 'new' ? 'New!' : card.status}</span></div>
                                </div>
                            </footer>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
