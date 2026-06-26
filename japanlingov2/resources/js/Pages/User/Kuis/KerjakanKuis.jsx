import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import theme from '@/Components/theme/themes';

// MUI Icons
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';

// Hitung XP berdasarkan akurasi
function calcXP(correct, total) {
    const pct = total > 0 ? correct / total : 0;
    if (pct === 1) return 50;
    if (pct >= 0.8) return 35;
    if (pct >= 0.6) return 20;
    return 10;
}

function normalizeAnswer(value) {
    return String(value || '').trim().toLowerCase();
}

function normalizeQuestionType(type) {
    if (type === 'fill_blank' || type === 'typing') return 'fill_blank';
    if (type === 'listening') return 'listening';
    return 'multiple_choice';
}

export default function Quiz({ quiz, questions: rawQuestions = [], flashcards = [] }) {
    // Normalise: backend kirim correct_answer (string), ubah ke correctIndex
    const [questions] = useState(() =>
        rawQuestions.map(q => ({
            ...q,
            type: normalizeQuestionType(q.type),
            // options adalah array string dari DB
            options: Array.isArray(q.options) ? q.options : [],
            correctIndex: Array.isArray(q.options)
                ? q.options.indexOf(q.correct_answer)
                : -1,
        }))
    );
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [textAnswer, setTextAnswer] = useState('');
    const [isCorrect, setIsCorrect] = useState(false);
    
    // Status Quiz
    const [lives, setLives] = useState(5);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [showFlashcard, setShowFlashcard] = useState(false);
    const [flashcardIndex, setFlashcardIndex] = useState(0);
    
    const submitted = useRef(false);
    const answerLogRef = useRef([]);

    // Animasi state
    const [shakeKey, setShakeKey] = useState(0); // Trigger shake animation

    // Window size for Confetti
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const currentQ = questions[currentIndex];
    const currentType = currentQ?.type || 'multiple_choice';
    const progressPercentage = ((currentIndex) / questions.length) * 100;
    const activeFlashcard = flashcards[flashcardIndex] || null;
    const flashcardInterval = 1;
    const shouldShowFlashcardAfterQuestion = (answeredCount, lastQuestion, gameOver) => (
        !lastQuestion
        && !gameOver
        && flashcards.length > 0
        && flashcardIndex < flashcards.length
        && answeredCount > 0
        && answeredCount % flashcardInterval === 0
    );

    const handleAnswerClick = (index) => {
        if (selectedAnswer !== null) return; // Mencegah double click
        
        setSelectedAnswer(index);
        const correct = index === currentQ.correctIndex;
        setIsCorrect(correct);

        if (correct) {
            setScore(prev => prev + 1);
            // PUT SOUND EFFECT HERE: playCorrectSound()
        } else {
            setLives(prev => Math.max(0, prev - 1));
            setShakeKey(prev => prev + 1); // Trigger getaran
            // PUT SOUND EFFECT HERE: playWrongSound()
        }

        answerLogRef.current[currentIndex] = {
            question_id: currentQ.id,
            answer_text: currentQ.options[index] || '',
            answer_payload: {
                selected_index: index,
                selected_option: currentQ.options[index] || '',
            },
        };
    };

    const handleTypedAnswerSubmit = (event) => {
        event.preventDefault();
        if (selectedAnswer !== null) return;

        const answer = textAnswer.trim();
        if (!answer) return;

        setSelectedAnswer(answer);
        const correct = normalizeAnswer(answer) === normalizeAnswer(currentQ.correct_answer);
        setIsCorrect(correct);

        if (correct) {
            setScore(prev => prev + 1);
        } else {
            setLives(prev => Math.max(0, prev - 1));
            setShakeKey(prev => prev + 1);
        }

        answerLogRef.current[currentIndex] = {
            question_id: currentQ.id,
            answer_text: answer,
            answer_payload: {
                typed_answer: answer,
                question_type: currentType,
            },
        };
    };

    const submitAttempt = (finalScore) => {
        if (submitted.current || !quiz?.id) return;
        submitted.current = true;
        const xp = calcXP(finalScore, questions.length);
        router.post(route('user.attempts.store'), {
            quiz_id: quiz.id,
            score: finalScore,
            xp_earned: xp,
            answers: answerLogRef.current.filter(Boolean),
        }, { preserveState: true });
    };

    const handleNext = () => {
        const gameOver = lives === 0;
        const lastQuestion = currentIndex >= questions.length - 1;

        if (gameOver || lastQuestion) {
            submitAttempt(score);
            setShowResult(true);
            return;
        }

        if (shouldShowFlashcardAfterQuestion(currentIndex + 1, lastQuestion, gameOver)) {
            setShowFlashcard(true);
            setSelectedAnswer(null);
            setTextAnswer('');
            return;
        }

        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setTextAnswer('');
    };

    const continueAfterFlashcard = () => {
        setShowFlashcard(false);
        setFlashcardIndex((prev) => prev + 1);
        setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1));
        setSelectedAnswer(null);
        setTextAnswer('');
    };

    const handleFlashcardReview = (action) => {
        if (!activeFlashcard?.id) {
            continueAfterFlashcard();
            return;
        }

        router.post(route('user.flashcards.review', activeFlashcard.id), {
            action,
            completed: false,
        }, {
            preserveScroll: true,
            preserveState: true,
            onFinish: continueAfterFlashcard,
        });
    };

    const confirmExit = (e) => {
        e.preventDefault();
        if (window.confirm("Yakin ingin keluar? Progres kuis ini akan hilang!")) {
            router.get('/user/dashboard');
        }
    };

    // Jika tidak ada soal dari DB
    if (questions.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Head title="Quiz" />
                <div className="text-center">
                    <p className="text-2xl font-black text-gray-400 mb-4">😅 Belum Ada Soal</p>
                    <p className="text-gray-500 mb-6">Admin belum menambahkan soal untuk kuis ini.</p>
                    <Link href={route('user.dashboard')} className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl no-underline">
                        Kembali ke Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    // === TAMPILAN HASIL (SUMMARY SCREEN) ===
    if (showResult) {
        const accuracy = Math.round((score / questions.length) * 100);
        const xpEarned = calcXP(score, questions.length);
        const isSuccess = lives > 0;

        return (
            <div className="min-h-screen font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden" 
                 style={{ backgroundColor: theme.sectionBg }}>
                <Head title="Hasil Kuis" />
                
                {isSuccess && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />}

                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
                    className="max-w-md w-full bg-white rounded-[2rem] shadow-xl p-8 text-center relative z-10"
                >
                    <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6" 
                         style={{ backgroundColor: isSuccess ? theme.activeColor : '#EF4444', color: 'white' }}>
                        {isSuccess ? <EmojiEventsIcon sx={{ fontSize: 56 }} /> : <CloseIcon sx={{ fontSize: 56 }} />}
                    </div>

                    <h1 className="text-3xl font-black text-gray-900 mb-2">
                        {isSuccess ? "Pelajaran Selesai!" : "Coba Lagi Nanti!"}
                    </h1>
                    <p className="text-gray-500 font-medium mb-8">
                        {isSuccess ? "Kamu mendapatkan pengetahuan baru hari ini." : "Jangan menyerah, kamu pasti bisa."}
                    </p>

                    <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-3">
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Skor</h3>
                            <div className="text-2xl font-black" style={{ color: theme.activeColor }}>
                                {score}/{questions.length}
                            </div>
                        </div>
                        <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-100">
                            <h3 className="text-sm font-bold text-yellow-500 uppercase tracking-wider mb-1">Akurasi</h3>
                            <div className="text-2xl font-black text-yellow-600">
                                {accuracy}%
                            </div>
                        </div>
                        <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                            <h3 className="text-sm font-bold text-green-500 uppercase tracking-wider mb-1">XP</h3>
                            <div className="text-2xl font-black text-green-600">+{xpEarned}</div>
                        </div>
                    </div>

                    <button 
                        onClick={() => router.get(route('user.dashboard'))}
                        className="w-full py-4 rounded-2xl font-black text-white text-lg tracking-wide uppercase shadow-lg hover:brightness-110 active:translate-y-1 active:shadow-none transition-all"
                        style={{ backgroundColor: theme.doneColor, boxShadow: `0 4px 0 0 ${theme.doneShadow}` }}
                    >
                        LANJUTKAN
                    </button>
                </motion.div>
            </div>
        );
    }

    if (showFlashcard && activeFlashcard) {
        const quizProgress = ((currentIndex + 1) / questions.length) * 100;

        return (
            <div className="min-h-screen font-sans flex flex-col items-center px-4 pb-10 pt-8 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-lime-50">
                <Head title="Kosakata Baru" />
                <div className="pointer-events-none fixed -left-24 top-24 h-72 w-72 rounded-full bg-orange-300/30 blur-3xl" />
                <div className="pointer-events-none fixed -right-24 bottom-24 h-72 w-72 rounded-full bg-lime-300/30 blur-3xl" />

                <header className="w-full max-w-4xl flex items-center gap-4 md:gap-6 mb-8 px-2 md:px-4 relative z-10">
                    <button onClick={confirmExit} className="text-gray-400 hover:text-gray-600 transition-colors p-2 -ml-2 rounded-full hover:bg-gray-100">
                        <CloseIcon />
                    </button>
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: theme.activeColor }}
                            initial={{ width: 0 }}
                            animate={{ width: `${quizProgress}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                    </div>
                    <div className="flex items-center gap-1.5 font-black text-red-500 text-lg">
                        <FavoriteIcon sx={{ fontSize: 24, color: lives > 0 ? '#EF4444' : '#gray-300' }} /> {lives}
                    </div>
                    {flashcards.length > 0 && (
                        <div className="hidden rounded-full bg-orange-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-orange-700 sm:block">
                            {flashcards.length} Kosakata
                        </div>
                    )}
                </header>

                <main className="w-full max-w-3xl flex-1 flex flex-col items-center justify-center relative z-10">
                    <motion.div
                        key={`flashcard-${activeFlashcard.id}`}
                        initial={{ opacity: 0, y: 30, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.35 }}
                        className="relative w-full overflow-hidden rounded-[2.5rem] border-2 border-orange-100 bg-white shadow-[0_30px_80px_-35px_rgba(234,88,12,0.65)]"
                    >
                        <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br from-orange-300 to-lime-300 opacity-30" />
                        <div className="relative border-b border-orange-100 bg-gradient-to-r from-orange-50 to-lime-50 px-6 py-5 sm:px-8">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-600">Mini Lesson</p>
                                    <h1 className="mt-2 text-xl font-black text-gray-900 sm:text-2xl">Kosakata baru sebelum lanjut soal</h1>
                                </div>
                                <span className="w-fit rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-orange-700 shadow-sm">
                                    {flashcardIndex + 1}/{flashcards.length}
                                </span>
                            </div>
                        </div>

                        <div className="relative px-6 py-10 text-center sm:px-10 sm:py-12">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-100 text-3xl font-black text-orange-700">
                                あ
                            </div>
                            <p className="text-6xl font-black tracking-tight text-gray-950 sm:text-7xl">{activeFlashcard.front_text}</p>
                            <p className="mt-4 text-2xl font-bold text-gray-500">{activeFlashcard.reading || '-'}</p>
                            <div className="mx-auto mt-5 h-px max-w-md bg-orange-200" />

                            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                                {activeFlashcard.audio_url && (
                                    <button
                                        onClick={() => new Audio(activeFlashcard.audio_url).play()}
                                        className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-600"
                                    >
                                        <VolumeUpIcon sx={{ fontSize: 20 }} />
                                    </button>
                                )}
                                {activeFlashcard.hint && (
                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-500">{activeFlashcard.hint}</span>
                                )}
                            </div>

                            <h2 className="mt-6 text-3xl font-black text-gray-900">{activeFlashcard.back_text || 'Belum ada arti'}</h2>
                            <p className="mt-3 text-sm font-bold text-gray-400">Pilih jujur. Yang belum paham akan masuk ke Review Kosakata.</p>

                            {(activeFlashcard.example_sentence || activeFlashcard.example_meaning) && (
                                <div className="mx-auto mt-8 max-w-2xl rounded-2xl bg-gray-50 p-5 text-left">
                                    <p className="text-base font-bold text-gray-700">{activeFlashcard.example_sentence}</p>
                                    <p className="mt-2 text-sm italic text-gray-500">{activeFlashcard.example_meaning}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
                        <button
                            onClick={() => handleFlashcardReview('learning')}
                            className="rounded-[2rem] bg-orange-500 px-6 py-5 text-center text-lg font-black text-white shadow-[0_8px_0_#C2410C] transition hover:brightness-105 active:translate-y-1 active:shadow-[0_4px_0_#C2410C]"
                        >
                            <span className="block text-2xl">?</span>
                            Belum Paham
                        </button>
                        <button
                            onClick={() => handleFlashcardReview('known')}
                            className="rounded-[2rem] bg-lime-400 px-6 py-5 text-center text-lg font-black text-gray-900 shadow-[0_8px_0_#65A30D] transition hover:brightness-105 active:translate-y-1 active:shadow-[0_4px_0_#65A30D]"
                        >
                            <span className="block text-2xl">✓</span>
                            Sudah Paham
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    // === TAMPILAN KUIS AKTIF ===
    return (
        <div className="min-h-screen font-sans flex flex-col items-center pt-8 md:pt-16 px-4 pb-32 overflow-x-hidden"
             style={{ backgroundColor: theme.landingHeroBg }}>
            <Head title={`Quiz - Level 2`} />

            {/* Top Progress & Lives */}
            <header className="w-full max-w-4xl flex items-center gap-4 md:gap-6 mb-8 md:mb-12 px-2 md:px-4 relative z-10">
                <button onClick={confirmExit} className="text-gray-400 hover:text-gray-600 transition-colors p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <CloseIcon />
                </button>
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                        className="h-full rounded-full" 
                        style={{ backgroundColor: theme.activeColor }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                </div>
                <div className="flex items-center gap-1.5 font-black text-red-500 text-lg">
                    <FavoriteIcon sx={{ fontSize: 24, color: lives > 0 ? '#EF4444' : '#gray-300' }} /> {lives}
                </div>
                {flashcards.length > 0 && (
                    <div className="hidden rounded-full bg-orange-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-orange-700 sm:block">
                        {flashcards.length} Kosakata
                    </div>
                )}
            </header>

            {/* Quiz Content Area */}
            <main className="w-full max-w-3xl flex-1 flex flex-col items-center relative z-10">
                
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="w-full flex flex-col items-center"
                    >
                        {/* Question Info */}
                        <div className="text-center mb-8 w-full">
                            <h2 className="text-xl md:text-3xl font-black text-gray-900 mb-2">{currentQ.question}</h2>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-shadow">Soal {currentIndex + 1} dari {questions.length}</p>
                        </div>

                        {/* Flashcard Canvas / Media */}
                        {(currentQ.kanji || currentQ.audio_url) && (
                            <div className="w-full max-w-[500px] aspect-video bg-white rounded-[2rem] shadow-sm border-2 border-gray-100 flex items-center justify-center relative mb-10 overflow-hidden">
                                {currentQ.kanji && <span className="text-[72px] sm:text-[100px] md:text-[140px] leading-none font-medium text-gray-900 select-none">{currentQ.kanji}</span>}
                                
                                {currentQ.audio_url && (
                                    (currentQ.audio_url.includes('youtube.com') || currentQ.audio_url.includes('youtu.be')) ? (
                                        <iframe
                                            src={currentQ.audio_url.includes('watch?v=') ? currentQ.audio_url.replace('watch?v=', 'embed/') : currentQ.audio_url}
                                            className="w-full h-full"
                                            allowFullScreen
                                            title="Audio Question"
                                        />
                                    ) : (
                                        <>
                                            {!currentQ.kanji && <span className="text-gray-400 font-bold tracking-widest uppercase">Pesan Suara</span>}
                                            <audio id={`audio-${currentQ.id}`} src={currentQ.audio_url} />
                                            <button 
                                                onClick={() => document.getElementById(`audio-${currentQ.id}`).play()}
                                                className="absolute bottom-4 right-4 md:bottom-6 md:right-6 w-12 h-12 text-white rounded-2xl shadow-md border-b-4 flex items-center justify-center active:translate-y-1 active:border-b-0 transition-all hover:brightness-110"
                                                style={{ backgroundColor: theme.activeColor, borderColor: theme.activeShadow }}>
                                                <VolumeUpIcon />
                                            </button>
                                        </>
                                    )
                                )}
                            </div>
                        )}

                        {/* Answer Area */}
                        <motion.div
                            className="w-full max-w-[500px]"
                            animate={shakeKey > 0 ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                            transition={{ duration: 0.4 }}
                        >
                            {currentType === 'multiple_choice' ? (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {currentQ.options.map((option, index) => {
                                        const isSelected = selectedAnswer === index;
                                        const isThisCorrect = isSelected && isCorrect;

                                        let buttonStyle = {
                                            backgroundColor: "white",
                                            borderColor: "#E5E7EB",
                                            color: "#4B5563",
                                            boxShadow: `0 4px 0 0 #E5E7EB`
                                        };

                                        if (isSelected) {
                                            if (isThisCorrect) {
                                                buttonStyle = {
                                                    backgroundColor: theme.heroBlob1 || '#F0FDF4',
                                                    borderColor: theme.activeColor,
                                                    color: theme.activeShadow,
                                                    boxShadow: `0 4px 0 0 ${theme.activeColor}`
                                                };
                                            } else {
                                                buttonStyle = {
                                                    backgroundColor: '#FEF2F2',
                                                    borderColor: '#EF4444',
                                                    color: '#B91C1C',
                                                    boxShadow: `0 4px 0 0 #EF4444`
                                                };
                                            }
                                        }

                                        return (
                                            <button
                                                key={index}
                                                disabled={selectedAnswer !== null}
                                                onClick={() => handleAnswerClick(index)}
                                                className="relative w-full text-center py-5 px-6 rounded-2xl border-2 font-bold text-base transition-all active:translate-y-1 active:shadow-none disabled:cursor-default"
                                                style={buttonStyle}
                                            >
                                                {option}

                                                {(selectedAnswer !== null && index === currentQ.correctIndex) && (
                                                    <motion.div
                                                        initial={{ scale: 0, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white flex items-center justify-center p-0.5"
                                                        style={{ color: theme.activeColor }}
                                                    >
                                                        <CheckCircleIcon sx={{ fontSize: 20 }} />
                                                    </motion.div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <form onSubmit={handleTypedAnswerSubmit} className="space-y-4">
                                    {currentType === 'fill_blank' && currentQ.options?.[0] && (
                                        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm font-bold text-yellow-700">
                                            Hint: {currentQ.options[0]}
                                        </div>
                                    )}
                                    <input
                                        type="text"
                                        value={textAnswer}
                                        onChange={(e) => setTextAnswer(e.target.value)}
                                        disabled={selectedAnswer !== null}
                                        placeholder={currentType === 'listening' ? 'Ketik jawaban dari audio...' : 'Ketik jawaban yang tepat...'}
                                        className="w-full rounded-2xl border-2 border-gray-200 bg-white px-5 py-5 text-center text-lg font-black text-gray-800 shadow-sm outline-none transition-all focus:border-red-400 focus:ring-4 focus:ring-red-500/10 disabled:bg-gray-50"
                                    />
                                    <button
                                        type="submit"
                                        disabled={selectedAnswer !== null || textAnswer.trim() === ''}
                                        className="w-full rounded-2xl bg-red-600 px-6 py-4 text-lg font-black uppercase tracking-wide text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Cek Jawaban
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Bottom Floating Success/Action Bar */}
            <AnimatePresence>
                {selectedAnswer !== null && (
                    <motion.div 
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={`fixed bottom-0 left-0 right-0 border-t-2 z-50`}
                        style={{ 
                            backgroundColor: isCorrect ? (theme.sectionBg || '#F0FDF4') : '#FEF2F2',
                            borderColor: isCorrect ? (theme.activeColor) : '#FCA5A5'
                        }}
                    >
                        <div className="max-w-4xl mx-auto px-4 py-6 md:px-8 md:py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                            
                            {/* Feedback Message */}
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", bounce: 0.6, delay: 0.1 }}
                                    className="w-16 h-16 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm"
                                    style={{ color: isCorrect ? theme.activeColor : '#EF4444' }}
                                >
                                    {isCorrect ? <CheckCircleIcon sx={{ fontSize: 40 }} /> : <CloseIcon sx={{ fontSize: 40 }} />}
                                </motion.div>
                                <div>
                                    <h3 className="text-2xl font-black mb-1" 
                                        style={{ color: isCorrect ? theme.activeShadow : '#B91C1C' }}>
                                        {isCorrect ? 'Luar Biasa!' : 'Ops, salah!'}
                                    </h3>
                                    <p className="text-sm font-medium" 
                                       style={{ color: isCorrect ? theme.activeShadow : '#B91C1C' }}>
                                        {isCorrect ? 'Jawaban yang tepat direkam.' : currentQ.explanation}
                                    </p>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button 
                                onClick={handleNext}
                                className="w-full sm:w-auto px-12 py-4 rounded-2xl font-black text-white text-lg tracking-wide uppercase transition-all shadow-lg active:translate-y-1 active:shadow-none hover:brightness-110"
                                style={{ 
                                    backgroundColor: isCorrect ? theme.doneColor : '#EF4444', 
                                    boxShadow: `0 4px 0 0 ${isCorrect ? theme.doneShadow : '#B91C1C'}` 
                                }}
                            >
                                {lives === 0 ? "SELESAI" : "LANJUT"}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
