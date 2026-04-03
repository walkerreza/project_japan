import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FilterListIcon from '@mui/icons-material/FilterList';
import HearingIcon from '@mui/icons-material/Hearing';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import ChecklistIcon from '@mui/icons-material/Checklist';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';

const TYPE_CONFIG = {
    multiple_choice: { label: 'Pilihan Ganda', icon: <ChecklistIcon sx={{ fontSize: 14 }} />, color: 'bg-blue-100 text-blue-700' },
    typing:          { label: 'Mengetik',      icon: <KeyboardIcon sx={{ fontSize: 14 }} />,  color: 'bg-purple-100 text-purple-700' },
    listening:       { label: 'Mendengarkan',  icon: <HearingIcon sx={{ fontSize: 14 }} />,   color: 'bg-green-100 text-green-700' },
};

export default function QuizzesIndex({ quizzes = [], lessons = [] }) {
    const [filterLesson, setFilterLesson] = useState('all');
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const filtered = filterLesson === 'all'
        ? quizzes
        : quizzes.filter(q => q.lesson?.id == filterLesson);

    const confirmDelete = () => {
        router.delete(route('admin.quizzes.destroy', deleteConfirm.id), {
            onSuccess: () => setDeleteConfirm(null),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Kuis - Japanlingo" />
            <div className="min-h-screen bg-[#F8F9FB] font-sans">

                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#E64A19] rounded-xl flex items-center justify-center text-white">
                            <QuizOutlinedIcon sx={{ fontSize: 20 }} />
                        </div>
                        <div>
                            <h1 className="text-sm font-black text-gray-900">Manajemen Kuis</h1>
                            <p className="text-[11px] text-gray-400 font-medium">{filtered.length} Kuis tersedia</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Filter Pelajaran */}
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                            <FilterListIcon sx={{ fontSize: 16 }} className="text-gray-400" />
                            <select
                                value={filterLesson}
                                onChange={e => setFilterLesson(e.target.value)}
                                className="text-sm font-medium text-gray-700 bg-transparent border-none focus:ring-0 outline-none"
                            >
                                <option value="all">Semua Pelajaran</option>
                                {lessons.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
                            </select>
                        </div>
                        {/* Tombol ke Quiz Builder visual */}
                        <Link
                            href={route('admin.quiz.builder')}
                            className="border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl px-4 h-10 text-sm font-bold flex items-center gap-2 transition-colors"
                        >
                            <OpenInNewIcon sx={{ fontSize: 16 }} />
                            Buka Builder
                        </Link>
                        <Link
                            href={route('admin.questions.create')}
                            className="bg-[#E64A19] hover:bg-[#D84315] text-white rounded-xl px-5 h-10 text-sm font-bold flex items-center gap-2 shadow-md shadow-orange-500/20 transition-colors"
                        >
                            <AddIcon sx={{ fontSize: 18 }} />
                            Tambah Soal
                        </Link>
                    </div>
                </header>

                <main className="max-w-5xl mx-auto p-6">
                    {filtered.length === 0 ? (
                        <div className="text-center py-24 text-gray-400">
                            <QuizOutlinedIcon sx={{ fontSize: 48 }} className="mb-3 opacity-30" />
                            <p className="font-medium">Belum ada kuis untuk pelajaran ini.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filtered.map(quiz => {
                                const typeConf = TYPE_CONFIG[quiz.type] || { label: quiz.type, icon: null, color: 'bg-gray-100 text-gray-600' };
                                return (
                                    <div key={quiz.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-4 flex items-center gap-4">
                                        {/* Ikon tipe */}
                                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#E64A19] flex items-center justify-center shrink-0">
                                            <QuizOutlinedIcon sx={{ fontSize: 20 }} />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${typeConf.color}`}>
                                                    {typeConf.icon}{typeConf.label}
                                                </span>
                                                {quiz.time_limit && (
                                                    <span className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                                                        <TimerOutlinedIcon sx={{ fontSize: 12 }} />
                                                        {Math.floor(quiz.time_limit / 60)} menit
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm font-black text-gray-900 truncate">
                                                {quiz.lesson?.title || <span className="text-gray-400 italic">Pelajaran tidak ditemukan</span>}
                                            </p>
                                        </div>

                                        {/* Statistik */}
                                        <div className="flex items-center gap-4 shrink-0">
                                            <span className="text-xs font-bold text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
                                                {quiz.question_count} Soal
                                            </span>
                                            <Link
                                                href={route('admin.questions.index', { quiz_id: quiz.id })}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                title="Kelola Soal"
                                            >
                                                <EditOutlinedIcon sx={{ fontSize: 18 }} />
                                            </Link>
                                            <button
                                                onClick={() => setDeleteConfirm(quiz)}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>

            {/* Delete Dialog */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <DeleteOutlineIcon sx={{ fontSize: 28 }} className="text-red-600" />
                        </div>
                        <h3 className="text-base font-black text-gray-900 mb-2">Hapus Kuis?</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Kuis tipe <strong>{TYPE_CONFIG[deleteConfirm.type]?.label}</strong> untuk pelajaran <strong>"{deleteConfirm.lesson?.title}"</strong> akan dihapus beserta semua soalnya.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 h-11 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">Batal</button>
                            <button onClick={confirmDelete} className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors">Hapus</button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
