import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
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
    multiple_choice: { label: 'Pilihan Ganda', icon: <ChecklistIcon sx={{ fontSize: 14 }} />, color: 'bg-blue-100 text-blue-700 dark:text-blue-400' },
    typing:          { label: 'Mengetik',      icon: <KeyboardIcon sx={{ fontSize: 14 }} />,  color: 'bg-purple-100 text-purple-700' },
    listening:       { label: 'Mendengarkan',  icon: <HearingIcon sx={{ fontSize: 14 }} />,   color: 'bg-green-100 text-green-700 dark:text-green-400' },
};

export default function QuizzesIndex({ quizzes, lessons = [], filters = {} }) {
    const [filterLesson, setFilterLesson] = useState('all');
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const createForm = useForm({
        lesson_id: '',
        type: 'multiple_choice',
        time_limit: '',
    });

    const quizItems = quizzes?.data || quizzes || [];

    const filtered = filterLesson === 'all'
        ? quizItems
        : quizItems.filter(q => q.lesson?.id == filterLesson);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.quizzes.index'), { search: searchQuery }, { preserveState: true });
    };

    const confirmDelete = () => {
        router.delete(route('admin.quizzes.destroy', deleteConfirm.id), {
            onSuccess: () => setDeleteConfirm(null),
        });
    };

    const handleCreateQuiz = (e) => {
        e.preventDefault();
        createForm.post(route('admin.quizzes.store'), {
            onSuccess: () => {
                setShowCreateModal(false);
                createForm.reset();
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Kuis - Japanlingo" />
            <div className="min-h-screen bg-[#F8F9FB] font-sans">

                {/* Header */}
                <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#E64A19] rounded-xl flex items-center justify-center text-white">
                            <QuizOutlinedIcon sx={{ fontSize: 20 }} />
                        </div>
                        <div>
                            <h1 className="text-sm font-black text-gray-900 dark:text-white">Manajemen Kuis</h1>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">{filtered.length} Kuis tersedia</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <form onSubmit={handleSearch} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2">
                            <input 
                                type="text"
                                placeholder="Cari Kuis/Tipe..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-transparent border-none focus:ring-0 outline-none w-32 md:w-48"
                            />
                        </form>
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2">
                            <FilterListIcon sx={{ fontSize: 16 }} className="text-gray-400 dark:text-gray-500" />
                            <select
                                value={filterLesson}
                                onChange={e => setFilterLesson(e.target.value)}
                                className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-transparent border-none focus:ring-0 outline-none"
                            >
                                <option value="all">Semua Pelajaran</option>
                                {lessons.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
                            </select>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-[#E64A19] hover:bg-[#D84315] text-white rounded-xl px-5 h-10 text-sm font-bold flex items-center gap-2 shadow-md shadow-orange-500/20 transition-colors"
                        >
                            <AddIcon sx={{ fontSize: 18 }} />
                            Buat Kuis Baru
                        </button>
                    </div>
                </header>

                <main className="max-w-5xl mx-auto p-6">
                    {filtered.length === 0 ? (
                        <div className="text-center py-24 text-gray-400 dark:text-gray-500">
                            <QuizOutlinedIcon sx={{ fontSize: 48 }} className="mb-3 opacity-30" />
                            <p className="font-medium">Belum ada kuis untuk pelajaran ini.</p>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="mt-4 text-sm font-bold text-[#E64A19] hover:underline"
                            >
                                + Buat Kuis Pertama
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filtered.map(quiz => {
                                const typeConf = TYPE_CONFIG[quiz.type] || { label: quiz.type, icon: null, color: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' };
                                return (
                                    <div key={quiz.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm px-5 py-4 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#E64A19] flex items-center justify-center shrink-0">
                                            <QuizOutlinedIcon sx={{ fontSize: 20 }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${typeConf.color}`}>
                                                    {typeConf.icon}{typeConf.label}
                                                </span>
                                                {quiz.time_limit && (
                                                    <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                                                        <TimerOutlinedIcon sx={{ fontSize: 12 }} />
                                                        {Math.floor(quiz.time_limit / 60)} menit
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm font-black text-gray-900 dark:text-white truncate">
                                                {quiz.lesson?.title || <span className="text-gray-400 dark:text-gray-500 italic">Pelajaran tidak ditemukan</span>}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4 shrink-0">
                                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 px-3 py-1 rounded-full">
                                                {quiz.question_count} Soal
                                            </span>
                                            <Link
                                                href={route('admin.quizzes.builder', quiz.id)}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-green-600 hover:bg-green-50 dark:bg-green-900/20 transition-colors"
                                                title="Buka Builder"
                                            >
                                                <OpenInNewIcon sx={{ fontSize: 18 }} />
                                            </Link>
                                            <Link
                                                href={route('admin.questions.index', { quiz_id: quiz.id })}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:bg-blue-900/20 transition-colors"
                                                title="Kelola Soal"
                                            >
                                                <EditOutlinedIcon sx={{ fontSize: 18 }} />
                                            </Link>
                                            <button
                                                onClick={() => setDeleteConfirm(quiz)}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-red-600 dark:text-red-400 hover:bg-red-50 dark:bg-red-900/20 transition-colors"
                                            >
                                                <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination Links */}
                    {quizzes?.links && quizzes.links.length > 3 && (
                        <div className="flex justify-center gap-2 mt-8">
                            {quizzes.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${link.active ? 'bg-[#E64A19] text-white shadow-md' : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:bg-gray-800/50'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Create Quiz Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white">Buat Kuis Baru</h3>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Pilih pelajaran dan tipe kuis, lalu buka Builder untuk menambah soal.</p>
                        </div>
                        <form onSubmit={handleCreateQuiz} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Pelajaran <span className="text-red-500">*</span></label>
                                <select
                                    value={createForm.data.lesson_id}
                                    onChange={e => createForm.setData('lesson_id', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E64A19]/30 focus:border-[#E64A19]"
                                    required
                                >
                                    <option value="">Pilih Pelajaran</option>
                                    {lessons.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
                                </select>
                                {createForm.errors.lesson_id && <p className="text-xs text-red-500 mt-1">{createForm.errors.lesson_id}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Tipe Kuis <span className="text-red-500">*</span></label>
                                <select
                                    value={createForm.data.type}
                                    onChange={e => createForm.setData('type', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E64A19]/30 focus:border-[#E64A19]"
                                    required
                                >
                                    <option value="multiple_choice">Pilihan Ganda</option>
                                    <option value="typing">Mengetik</option>
                                    <option value="listening">Mendengarkan</option>
                                </select>
                                {createForm.errors.type && <p className="text-xs text-red-500 mt-1">{createForm.errors.type}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Batas Waktu (detik) <span className="text-gray-400 dark:text-gray-500 font-normal">Opsional</span></label>
                                <input
                                    type="number"
                                    min="0"
                                    value={createForm.data.time_limit}
                                    onChange={e => createForm.setData('time_limit', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E64A19]/30 focus:border-[#E64A19]"
                                    placeholder="Kosongkan jika tanpa batas"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 h-11 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-800/50 transition-colors">Batal</button>
                                <button type="submit" disabled={createForm.processing} className="flex-1 h-11 rounded-xl bg-[#E64A19] hover:bg-[#D84315] text-white text-sm font-bold transition-colors disabled:opacity-50">
                                    {createForm.processing ? 'Membuat...' : 'Buat Kuis'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Dialog */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <DeleteOutlineIcon sx={{ fontSize: 28 }} className="text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="text-base font-black text-gray-900 dark:text-white mb-2">Hapus Kuis?</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            Kuis tipe <strong>{TYPE_CONFIG[deleteConfirm.type]?.label}</strong> untuk pelajaran <strong>"{deleteConfirm.lesson?.title}"</strong> akan dihapus beserta semua soalnya.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 h-11 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-800/50 transition-colors">Batal</button>
                            <button onClick={confirmDelete} className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors">Hapus</button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
