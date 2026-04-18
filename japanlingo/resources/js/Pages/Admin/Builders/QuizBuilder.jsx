import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import SettingsIcon from '@mui/icons-material/Settings';
import AssessmentIcon from '@mui/icons-material/Assessment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const QUESTION_TYPES = [
    { value: 'multiple_choice', label: 'Multiple Choice' },
    { value: 'fill_blank', label: 'Fill in Blank' },
    { value: 'listening', label: 'Listening' },
];

const TYPE_LABELS = { multiple_choice: 'MC', fill_blank: 'FILL', listening: 'LISTEN' };
const TYPE_COLORS = { multiple_choice: 'text-blue-600 bg-blue-50', fill_blank: 'text-purple-600 bg-purple-50', listening: 'text-green-600 bg-green-50' };

const emptyQuestion = (type = 'multiple_choice') => ({
    id: null,
    type,
    question_text: '',
    correct_answer: '',
    options: type === 'multiple_choice' ? ['', '', '', ''] : [],
    explanation: '',
    audio_url: '',
    order: 0,
});

export default function QuizBuilder({ quiz, questions: initialQuestions = [] }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('questions');

    const { data, setData, post, processing, recentlySuccessful } = useForm({
        questions: initialQuestions.length > 0
            ? initialQuestions.map(q => ({ ...q, type: q.type || quiz?.type || 'multiple_choice' }))
            : [emptyQuestion(quiz?.type || 'multiple_choice')],
    });

    const activeQ = data.questions[activeIndex] || data.questions[0];
    const optLabels = ['A', 'B', 'C', 'D'];

    const updateQuestion = (index, field, value) => {
        const updated = [...data.questions];
        updated[index] = { ...updated[index], [field]: value };
        setData('questions', updated);
    };

    const updateOption = (qIndex, optIndex, value) => {
        const updated = [...data.questions];
        const opts = [...(updated[qIndex].options || ['', '', '', ''])];
        opts[optIndex] = value;
        updated[qIndex] = { ...updated[qIndex], options: opts };
        setData('questions', updated);
    };

    const setCorrectAnswer = (qIndex, value) => {
        const updated = [...data.questions];
        updated[qIndex] = { ...updated[qIndex], correct_answer: value };
        setData('questions', updated);
    };

    const changeQuestionType = (index, newType) => {
        const updated = [...data.questions];
        updated[index] = {
            ...updated[index],
            type: newType,
            options: newType === 'multiple_choice' ? (updated[index].options?.length ? updated[index].options : ['', '', '', '']) : [],
        };
        setData('questions', updated);
    };

    const addQuestion = (type) => {
        const newQ = emptyQuestion(type || quiz?.type || 'multiple_choice');
        newQ.order = data.questions.length;
        setData('questions', [...data.questions, newQ]);
        setActiveIndex(data.questions.length);
    };

    const removeQuestion = (index) => {
        if (data.questions.length <= 1) return;
        const updated = data.questions.filter((_, i) => i !== index);
        setData('questions', updated);
        if (activeIndex >= updated.length) setActiveIndex(updated.length - 1);
    };

    const handleSave = () => {
        post(route('admin.quizzes.builder.update', quiz.id));
    };

    const totalPoints = data.questions.length * 10;

    // ─── RENDER: QUESTION EDITOR (by type) ──────────────────
    const renderEditor = () => {
        const qType = activeQ.type || 'multiple_choice';

        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 border-l-4 border-l-[#E64A19] overflow-hidden">
                {/* Editor Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-50 bg-gray-50/30">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                        </div>
                        <h2 className="font-black text-gray-900">Q{activeIndex + 1}</h2>
                        <select
                            value={qType}
                            onChange={(e) => changeQuestionType(activeIndex, e.target.value)}
                            className="bg-transparent font-medium text-sm text-gray-600 focus:outline-none cursor-pointer"
                        >
                            {QUESTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Difficulty</span>
                            <span className="text-xs font-black text-[#E64A19] bg-orange-50 px-2 py-0.5 rounded">N3</span>
                        </div>
                        <button onClick={() => removeQuestion(activeIndex)} className="text-gray-300 hover:text-red-500 transition-colors">
                            <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                        </button>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {/* ─── Listening: Audio URL ─── */}
                    {qType === 'listening' && (
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                <MicNoneOutlinedIcon sx={{ fontSize: 14 }} /> Audio URL
                            </label>
                            <input
                                type="text"
                                value={activeQ.audio_url || ''}
                                onChange={(e) => updateQuestion(activeIndex, 'audio_url', e.target.value)}
                                placeholder="https://example.com/audio.mp3"
                                className="w-full bg-gray-50 border-transparent rounded-xl p-4 text-sm font-medium text-gray-900 focus:bg-white focus:border-red-100 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                            />
                            {activeQ.audio_url && (
                                <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shrink-0">
                                        <MicNoneOutlinedIcon sx={{ fontSize: 20 }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-black text-green-700 truncate">{activeQ.audio_url}</p>
                                        <audio controls className="w-full mt-2 h-8" src={activeQ.audio_url} />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ─── Question Text ─── */}
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                            {qType === 'listening' ? 'Question After Listening' : qType === 'fill_blank' ? 'Sentence (use ___ for blank)' : 'Question Text (Kanji Supported)'}
                        </label>
                        <div className="relative">
                            <textarea
                                value={activeQ.question_text}
                                onChange={(e) => updateQuestion(activeIndex, 'question_text', e.target.value)}
                                placeholder={
                                    qType === 'fill_blank'
                                        ? 'e.g. 彼は___に行きました。'
                                        : qType === 'listening'
                                        ? 'e.g. 音声で言っていることは何ですか？'
                                        : 'e.g. Choose the correct reading for: 経済'
                                }
                                className="w-full min-h-[100px] bg-gray-50 border-transparent rounded-xl p-4 text-base font-medium text-gray-900 focus:bg-white focus:border-red-100 focus:ring-4 focus:ring-red-500/10 transition-all resize-none outline-none"
                            />
                            <div className="absolute right-4 bottom-4 flex gap-2">
                                <button className="p-1.5 bg-white shadow-sm rounded-lg text-gray-400 hover:text-gray-600 transition-colors"><ImageOutlinedIcon sx={{ fontSize: 18 }} /></button>
                                <button className="p-1.5 bg-white shadow-sm rounded-lg text-gray-400 hover:text-gray-600 transition-colors"><MicNoneOutlinedIcon sx={{ fontSize: 18 }} /></button>
                            </div>
                        </div>
                    </div>

                    {/* ─── Multiple Choice: Options Grid ─── */}
                    {qType === 'multiple_choice' && (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {(activeQ.options || ['', '', '', '']).map((opt, optIdx) => {
                                const isCorrect = activeQ.correct_answer === opt && opt !== '';
                                return (
                                    <div key={optIdx} className="relative group">
                                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded flex items-center justify-center text-xs font-bold z-10 ${isCorrect ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'}`}>
                                            {optLabels[optIdx]}
                                        </div>
                                        <input
                                            type="text"
                                            value={opt}
                                            onChange={(e) => updateOption(activeIndex, optIdx, e.target.value)}
                                            placeholder={`Opsi ${optLabels[optIdx]}`}
                                            className={`w-full h-14 rounded-xl pl-14 pr-12 text-sm font-medium focus:outline-none ${
                                                isCorrect
                                                    ? 'bg-green-50/50 border border-green-500 text-green-900 font-bold focus:ring-4 focus:ring-green-500/20'
                                                    : 'bg-white border border-gray-200 text-gray-700 focus:border-gray-400'
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setCorrectAnswer(activeIndex, opt)}
                                            className={`absolute right-4 top-1/2 -translate-y-1/2 ${isCorrect ? 'text-green-500' : 'text-gray-300 hover:text-gray-400'}`}
                                        >
                                            {isCorrect ? <CheckCircleIcon sx={{ fontSize: 22 }} /> : <RadioButtonUncheckedIcon sx={{ fontSize: 22 }} />}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* ─── Fill in Blank: Answer Input ─── */}
                    {qType === 'fill_blank' && (
                        <div className="space-y-4">
                            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                                <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-3">Preview Soal</p>
                                <p className="text-lg font-bold text-gray-900 leading-relaxed">
                                    {activeQ.question_text
                                        ? activeQ.question_text.split('___').map((part, i, arr) => (
                                            <React.Fragment key={i}>
                                                {part}
                                                {i < arr.length - 1 && (
                                                    <span className="inline-block mx-1 px-4 py-1 bg-white border-2 border-dashed border-purple-400 rounded-lg text-purple-600 font-black text-sm">
                                                        {activeQ.correct_answer || '?'}
                                                    </span>
                                                )}
                                            </React.Fragment>
                                        ))
                                        : <span className="text-gray-300">Tulis kalimat dengan ___ ...</span>
                                    }
                                </p>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-purple-500 uppercase tracking-widest mb-2">Jawaban Benar (isi dari blank)</label>
                                <input
                                    type="text"
                                    value={activeQ.correct_answer}
                                    onChange={(e) => updateQuestion(activeIndex, 'correct_answer', e.target.value)}
                                    placeholder="e.g. 学校"
                                    className="w-full h-14 bg-white border-2 border-purple-300 rounded-xl px-4 text-lg font-bold text-purple-900 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Hint (Opsional)</label>
                                <input
                                    type="text"
                                    value={(activeQ.options && activeQ.options[0]) || ''}
                                    onChange={(e) => {
                                        const updated = [...data.questions];
                                        updated[activeIndex] = { ...updated[activeIndex], options: [e.target.value] };
                                        setData('questions', updated);
                                    }}
                                    placeholder="e.g. がっこう (petunjuk membaca)"
                                    className="w-full h-12 bg-gray-50 border-transparent rounded-xl px-4 text-sm font-medium text-gray-600 focus:bg-white focus:border-gray-300 focus:ring-4 focus:ring-gray-500/10 outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* ─── Listening: Answer (same as MC or direct) ─── */}
                    {qType === 'listening' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-green-600 uppercase tracking-widest mb-2">Jawaban Benar</label>
                                <input
                                    type="text"
                                    value={activeQ.correct_answer}
                                    onChange={(e) => updateQuestion(activeIndex, 'correct_answer', e.target.value)}
                                    placeholder="e.g. 天気予報"
                                    className="w-full h-14 bg-white border-2 border-green-300 rounded-xl px-4 text-lg font-bold text-green-900 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500"
                                />
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                                <HelpOutlineIcon className="text-green-500" sx={{ fontSize: 18 }} />
                                <p className="text-xs text-green-700 font-medium">Siswa akan mendengarkan audio, lalu mengetikkan jawaban. Cocok untuk latihan <strong>dictation</strong> atau <strong>comprehension</strong>.</p>
                            </div>
                        </div>
                    )}

                    {/* ─── Explanation (all types) ─── */}
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Explanation for Correct Answer
                        </label>
                        <textarea
                            value={activeQ.explanation || ''}
                            onChange={(e) => updateQuestion(activeIndex, 'explanation', e.target.value)}
                            placeholder="e.g. 経済 (Keizai) means economy."
                            className="w-full min-h-[80px] bg-gray-50 border-transparent rounded-xl p-4 text-sm font-medium text-gray-500 focus:bg-white focus:border-red-100 focus:ring-4 focus:ring-red-500/10 transition-all resize-none outline-none"
                        />
                    </div>
                </div>
            </div>
        );
    };

    // ─── RENDER: SETTINGS PANEL ─────────────────────────────
    const renderSettings = () => (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2"><SettingsIcon sx={{ fontSize: 20 }} className="text-[#E64A19]" /> Pengaturan Kuis</h2>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Passing Score (%)</label>
                        <input type="number" min="0" max="100" defaultValue="60" className="w-full h-12 bg-gray-50 border-transparent rounded-xl px-4 text-sm font-bold text-gray-900 focus:bg-white focus:border-red-100 focus:ring-4 focus:ring-red-500/10 outline-none" />
                        <p className="text-[10px] text-gray-400 mt-1">Skor minimum untuk lulus kuis</p>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1"><TimerOutlinedIcon sx={{ fontSize: 12 }} /> Batas Waktu (detik)</label>
                        <input type="number" min="0" defaultValue={quiz?.time_limit || ''} className="w-full h-12 bg-gray-50 border-transparent rounded-xl px-4 text-sm font-bold text-gray-900 focus:bg-white focus:border-red-100 focus:ring-4 focus:ring-red-500/10 outline-none" placeholder="Kosong = tanpa batas" />
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6 space-y-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Opsi Pengacakan</h3>
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                            <ShuffleIcon className="text-blue-500" sx={{ fontSize: 20 }} />
                            <div>
                                <p className="text-sm font-bold text-gray-900">Acak Urutan Soal</p>
                                <p className="text-[11px] text-gray-400">Soal muncul acak untuk setiap siswa</p>
                            </div>
                        </div>
                        <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-[#E64A19] focus:ring-[#E64A19]/30 border-gray-300" />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                            <ShuffleIcon className="text-purple-500" sx={{ fontSize: 20 }} />
                            <div>
                                <p className="text-sm font-bold text-gray-900">Acak Pilihan Jawaban</p>
                                <p className="text-[11px] text-gray-400">Opsi A/B/C/D diacak per siswa (Multiple Choice)</p>
                            </div>
                        </div>
                        <input type="checkbox" className="w-5 h-5 rounded text-[#E64A19] focus:ring-[#E64A19]/30 border-gray-300" />
                    </label>
                </div>

                <div className="border-t border-gray-100 pt-6 space-y-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Percobaan</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Maks. Percobaan</label>
                            <input type="number" min="1" defaultValue="3" className="w-full h-12 bg-gray-50 border-transparent rounded-xl px-4 text-sm font-bold text-gray-900 focus:bg-white focus:border-red-100 focus:ring-4 focus:ring-red-500/10 outline-none" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Tampilkan Penjelasan?</label>
                            <select className="w-full h-12 bg-gray-50 border-transparent rounded-xl px-4 text-sm font-bold text-gray-900 focus:bg-white focus:border-red-100 outline-none">
                                <option value="after_submit">Setelah Submit</option>
                                <option value="after_all">Setelah Semua Selesai</option>
                                <option value="never">Tidak Ditampilkan</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // ─── RENDER: ANALYSIS PANEL ─────────────────────────────
    const renderAnalysis = () => {
        const qCount = data.questions.length;
        const mcCount = data.questions.filter(q => (q.type || 'multiple_choice') === 'multiple_choice').length;
        const fillCount = data.questions.filter(q => q.type === 'fill_blank').length;
        const listenCount = data.questions.filter(q => q.type === 'listening').length;
        const filledCount = data.questions.filter(q => q.question_text && q.correct_answer).length;

        return (
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                        { label: 'Total Soal', value: qCount, color: 'text-[#E64A19]' },
                        { label: 'Multiple Choice', value: mcCount, color: 'text-blue-600' },
                        { label: 'Fill in Blank', value: fillCount, color: 'text-purple-600' },
                        { label: 'Listening', value: listenCount, color: 'text-green-600' },
                    ].map((item, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 text-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                            <p className={`text-3xl font-black ${item.color}`}>{item.value}</p>
                        </div>
                    ))}
                </div>

                {/* Completeness */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2"><BarChartIcon sx={{ fontSize: 18 }} className="text-[#E64A19]" /> Kelengkapan Soal</h3>
                    <div className="w-full h-3 bg-gray-100 rounded-full mb-3">
                        <div className="h-3 bg-gradient-to-r from-[#E64A19] to-[#FF7043] rounded-full transition-all" style={{ width: `${qCount > 0 ? (filledCount / qCount) * 100 : 0}%` }}></div>
                    </div>
                    <p className="text-xs font-bold text-gray-500">{filledCount}/{qCount} soal terisi lengkap ({qCount > 0 ? Math.round((filledCount / qCount) * 100) : 0}%)</p>
                </div>

                {/* Per-Question Analysis Table */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-100">
                        <h3 className="text-sm font-black text-gray-900 flex items-center gap-2"><TrendingUpIcon sx={{ fontSize: 18 }} className="text-[#E64A19]" /> Item Analysis</h3>
                        <p className="text-[11px] text-gray-400 mt-1">Analisis tiap soal — data akan terisi setelah ada percobaan siswa</p>
                    </div>
                    <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <th className="px-5 py-3 text-left">#</th>
                                <th className="px-5 py-3 text-left">Tipe</th>
                                <th className="px-5 py-3 text-left">Soal</th>
                                <th className="px-5 py-3 text-center">Difficulty (p)</th>
                                <th className="px-5 py-3 text-center">Discrimination</th>
                                <th className="px-5 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.questions.map((q, i) => {
                                const isFilled = q.question_text && q.correct_answer;
                                const typeConf = TYPE_LABELS[q.type || 'multiple_choice'];
                                const typeColor = TYPE_COLORS[q.type || 'multiple_choice'];
                                return (
                                    <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/50">
                                        <td className="px-5 py-3 font-black text-gray-400">Q{i + 1}</td>
                                        <td className="px-5 py-3"><span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${typeColor}`}>{typeConf}</span></td>
                                        <td className="px-5 py-3 font-medium text-gray-700 truncate max-w-[200px]">{q.question_text || <span className="text-gray-300 italic">Kosong</span>}</td>
                                        <td className="px-5 py-3 text-center text-gray-300 font-bold">—</td>
                                        <td className="px-5 py-3 text-center text-gray-300 font-bold">—</td>
                                        <td className="px-5 py-3 text-center">
                                            {isFilled
                                                ? <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded">Siap</span>
                                                : <span className="text-[10px] font-black text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded">Belum Lengkap</span>
                                            }
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-3">
                    <HelpOutlineIcon className="text-blue-500 shrink-0 mt-0.5" sx={{ fontSize: 18 }} />
                    <div>
                        <p className="text-sm font-bold text-blue-900">Tentang Item Analysis</p>
                        <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                            <strong>Difficulty (p-value)</strong>: Proporsi siswa yang menjawab benar. Rentang 0.0 (semua salah) — 1.0 (semua benar). Ideal: 0.3–0.7.<br />
                            <strong>Discrimination</strong>: Seberapa baik soal membedakan siswa pintar vs kurang. Positif = baik. Nol/negatif = soal perlu direvisi.
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    // ─── RENDER: STUDENT PREVIEW ────────────────────────────
    const renderPreview = () => {
        const qType = activeQ.type || 'multiple_choice';
        return (
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-200 h-[500px] overflow-hidden flex flex-col relative">
                <div className="bg-[#E64A19] h-12 flex items-center px-4 justify-between shrink-0">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Student Preview</span>
                    <div className="w-2 h-2 rounded-full bg-white/50"></div>
                </div>
                <div className="flex-1 p-6 flex flex-col overflow-y-auto">
                    <div className="w-full h-1.5 bg-gray-100 rounded-full mb-6">
                        <div className="h-1.5 bg-[#E64A19] rounded-full" style={{ width: `${data.questions.length > 0 ? ((activeIndex + 1) / data.questions.length) * 100 : 0}%` }}></div>
                    </div>

                    {qType === 'listening' && activeQ.audio_url && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 flex items-center gap-2">
                            <MicNoneOutlinedIcon className="text-green-600" sx={{ fontSize: 16 }} />
                            <span className="text-[10px] font-black text-green-700 uppercase">Audio</span>
                        </div>
                    )}

                    <div className="text-center mb-6">
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Question {activeIndex + 1}</p>
                        <h3 className="text-base font-black text-gray-900 leading-tight">
                            {activeQ.question_text || <span className="text-gray-300">...</span>}
                        </h3>
                    </div>

                    {qType === 'multiple_choice' && (
                        <div className="space-y-2 mb-auto">
                            {(activeQ.options || []).map((opt, i) => (
                                <div key={i} className={`border rounded-xl px-4 py-2.5 text-center text-xs font-bold ${
                                    activeQ.correct_answer === opt && opt !== '' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-700'
                                }`}>
                                    {opt || <span className="text-gray-300">—</span>}
                                </div>
                            ))}
                        </div>
                    )}

                    {qType === 'fill_blank' && (
                        <div className="mb-auto">
                            <div className="border-2 border-dashed border-purple-300 rounded-xl px-4 py-3 text-center">
                                <input type="text" disabled placeholder={activeQ.correct_answer || '???'} className="w-full text-center bg-transparent border-none text-sm font-bold text-purple-600 placeholder-purple-300" />
                            </div>
                        </div>
                    )}

                    {qType === 'listening' && (
                        <div className="mb-auto">
                            <div className="border-2 border-dashed border-green-300 rounded-xl px-4 py-3 text-center">
                                <input type="text" disabled placeholder={activeQ.correct_answer || '???'} className="w-full text-center bg-transparent border-none text-sm font-bold text-green-600 placeholder-green-300" />
                            </div>
                        </div>
                    )}

                    <button className="w-full py-2.5 bg-gray-100 rounded-xl text-gray-400 font-bold text-xs mt-4">Next Question</button>
                </div>
                <div className="h-10 bg-gray-50 border-t border-gray-100 flex items-center justify-between px-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Time: {quiz?.time_limit ? Math.floor(quiz.time_limit / 60) + ':00' : '∞'}</span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pts: 10</span>
                </div>
            </div>
        );
    };

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">
            <Head title="Quiz Builder - Japanlingo" />

            {/* Top Nav */}
            <header className="sticky top-0 z-40 shrink-0 border-b border-gray-200 bg-white px-4 py-3 lg:h-16 lg:px-6 lg:py-0">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                    <Link href={route('admin.quizzes.index')} className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </Link>
                    <div className="h-6 w-px bg-gray-200"></div>
                    <div className="flex min-w-0 items-center gap-2">
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">文A</div>
                        <div className="min-w-0">
                            <h1 className="truncate text-sm font-black text-gray-900 leading-none tracking-tight">JapanLingo Quiz Builder</h1>
                            <p className="mt-0.5 truncate text-[11px] font-medium text-gray-400">{quiz?.lesson?.title || 'Untitled'} — {quiz?.type}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-1">
                    {['questions', 'settings', 'analysis'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 h-9 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${
                                activeTab === tab ? 'text-red-600 bg-red-50' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            {tab === 'questions' && <><FormatListBulletedIcon sx={{ fontSize: 16 }} /> Questions</>}
                            {tab === 'settings' && <><SettingsIcon sx={{ fontSize: 16 }} /> Settings</>}
                            {tab === 'analysis' && <><AssessmentIcon sx={{ fontSize: 16 }} /> Analysis</>}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                    {recentlySuccessful && <span className="text-xs font-bold text-green-600 animate-pulse">Tersimpan!</span>}
                    <button onClick={handleSave} disabled={processing} className="bg-[#E64A19] hover:bg-[#D84315] disabled:opacity-50 text-white rounded-xl px-6 h-9 shadow-md shadow-orange-500/20 text-sm font-bold flex items-center gap-2 transition-colors">
                        <SaveOutlinedIcon sx={{ fontSize: 18 }} />
                        {processing ? 'Menyimpan...' : 'Publish Quiz'}
                    </button>
                </div>
                </div>
            </header>

            {/* Workspace */}
            <main className="flex-1 flex flex-col overflow-hidden lg:flex-row">

                {/* Left Panel (only on questions tab) */}
                {activeTab === 'questions' && (
                    <aside className="flex w-full shrink-0 flex-col border-b border-gray-200 bg-white lg:w-72 lg:border-b-0 lg:border-r">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Questions ({data.questions.length})</span>
                            <span className="text-xs font-bold text-red-600">Points: {totalPoints}</span>
                        </div>
                        <div className="flex-1 overflow-x-auto p-3 lg:overflow-y-auto">
                            <div className="flex min-w-max gap-2 lg:min-w-0 lg:block lg:space-y-2">
                            {data.questions.map((q, i) => {
                                const tLabel = TYPE_LABELS[q.type || 'multiple_choice'];
                                const tColor = TYPE_COLORS[q.type || 'multiple_choice'];
                                return (
                                    <button
                                        key={i}
                                        onClick={() => setActiveIndex(i)}
                                        className={`w-56 shrink-0 rounded-xl border p-3 text-left transition-all lg:w-full ${
                                            activeIndex === i ? 'border-red-500 bg-red-50 shadow-sm ring-1 ring-red-500' : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${activeIndex === i ? 'text-red-700' : 'text-gray-400'}`}>Q{i + 1}</span>
                                            <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${tColor}`}>{tLabel}</span>
                                        </div>
                                        <p className={`text-sm font-bold truncate ${activeIndex === i ? 'text-red-900' : 'text-gray-700'}`}>
                                            {q.question_text || 'Pertanyaan baru...'}
                                        </p>
                                    </button>
                                );
                            })}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-2 border-t border-gray-100 bg-white p-3 sm:grid-cols-3 lg:grid-cols-1">
                            {QUESTION_TYPES.map(t => (
                                <button key={t.value} onClick={() => addQuestion(t.value)} className="w-full py-2 border border-dashed border-gray-200 rounded-lg flex items-center justify-center gap-2 text-xs font-bold text-gray-400 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-600 transition-all">
                                    <AddIcon sx={{ fontSize: 14 }} /> {t.label}
                                </button>
                            ))}
                        </div>
                    </aside>
                )}

                {/* Center */}
                <section className="relative flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {activeTab === 'questions' && renderEditor()}
                    {activeTab === 'settings' && renderSettings()}
                    {activeTab === 'analysis' && renderAnalysis()}

                    {activeTab === 'questions' && (
                        <div className="fixed bottom-6 right-6 z-30 lg:bottom-8 lg:right-[340px]">
                            <button onClick={() => addQuestion()} className="w-14 h-14 bg-[#E64A19] hover:bg-[#D84315] text-white rounded-full shadow-xl shadow-orange-500/30 flex items-center justify-center transition-transform hover:scale-105">
                                <AddIcon sx={{ fontSize: 28 }} />
                            </button>
                        </div>
                    )}
                </section>

                {/* Right Panel (preview, always visible on questions tab) */}
                {activeTab === 'questions' && (
                    <aside className="flex w-full shrink-0 flex-col space-y-6 border-t border-gray-200 bg-gray-50 p-4 sm:p-6 lg:w-80 lg:border-t-0 lg:border-l">
                        {renderPreview()}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                            <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-4">Set Summary</h4>
                            <div className="flex justify-between gap-4">
                                <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Questions</p>
                                    <p className="text-lg font-black text-gray-900">{data.questions.length}</p>
                                </div>
                                <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Avg. Grade</p>
                                    <p className="text-lg font-black text-[#E64A19]">N3</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                )}
            </main>
            </div>
        </AuthenticatedLayout>
    );
}
