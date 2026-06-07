import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function LessonsIndex({ lessons = [], modules = [], selectedModuleId }) {
    const [filterModule, setFilterModule] = useState(selectedModuleId || 'all');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [forceDeleteQuizzes, setForceDeleteQuizzes] = useState(false);

    const filteredLessons = filterModule === 'all'
        ? lessons
        : lessons.filter(l => l.module?.id == filterModule);

    const handleFilterChange = (val) => {
        setFilterModule(val);
        router.get(route('admin.lessons.index'), val !== 'all' ? { module_id: val } : {}, { preserveState: true });
    };

    const handleDelete = (lesson) => {
        setDeleteError(null);
        setForceDeleteQuizzes(false);
        setDeleteConfirm(lesson);
    };

    const confirmDelete = () => {
        router.delete(route('admin.lessons.destroy', deleteConfirm.id), {
            data: {
                force_delete_quizzes: forceDeleteQuizzes,
            },
            onSuccess: () => setDeleteConfirm(null),
            onError: (errors) => {
                setDeleteError(errors.delete || 'Terjadi kesalahan saat menghapus');
                setDeleteConfirm(null);
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Pelajaran - Japanlingo" />
            <div className="min-h-screen bg-[#F8F9FB] font-sans">

                {/* Header */}
                <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <a href={route('admin.modules.index')} className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:text-white transition-colors">
                            <ArrowBackIcon sx={{ fontSize: 18 }} />
                        </a>
                        <div className="h-6 w-px bg-gray-200" />
                        <div className="w-9 h-9 bg-[#E64A19] rounded-xl flex items-center justify-center text-white">
                            <ArticleOutlinedIcon sx={{ fontSize: 20 }} />
                        </div>
                        <div>
                            <h1 className="text-sm font-black text-gray-900 dark:text-white">Manajemen Pelajaran</h1>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">{filteredLessons.length} Pelajaran</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={filterModule}
                            onChange={e => handleFilterChange(e.target.value)}
                            className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E64A19]/30"
                        >
                            <option value="all">Semua Modul</option>
                            {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                        </select>
                        <a
                            href={route('admin.lessons.create', filterModule !== 'all' ? { module_id: filterModule } : {})}
                            className="bg-[#E64A19] hover:bg-[#D84315] text-white rounded-xl px-5 h-10 text-sm font-bold flex items-center gap-2 shadow-md shadow-orange-500/20 transition-colors"
                        >
                            <AddIcon sx={{ fontSize: 18 }} />
                            Tambah Pelajaran
                        </a>
                    </div>
                </header>

                <main className="max-w-5xl mx-auto p-6">
                    {deleteError && (
                        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl text-sm text-red-700 dark:text-red-400 font-medium">
                            {deleteError}
                        </div>
                    )}

                    {filteredLessons.length === 0 ? (
                        <div className="text-center py-24 text-gray-400 dark:text-gray-500">
                            <ArticleOutlinedIcon sx={{ fontSize: 48 }} className="mb-3 opacity-30" />
                            <p className="font-medium">Belum ada pelajaran.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredLessons.map((lesson, idx) => (
                                <div key={lesson.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm px-5 py-4 flex items-center gap-4">
                                    <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#E64A19] flex items-center justify-center font-black text-sm shrink-0">
                                        {lesson.order + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-black text-gray-900 dark:text-white truncate">{lesson.title}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">{lesson.module?.title || '—'}</span>
                                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${lesson.status === 'draft' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'}`}>
                                                {lesson.status || 'published'}
                                            </span>
                                            {lesson.duration_minutes && (
                                                <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500">
                                                    <AccessTimeIcon sx={{ fontSize: 12 }} />
                                                    {lesson.duration_minutes} menit
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${lesson.quiz_count > 0 ? 'bg-green-100 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                                            {lesson.quiz_count > 0 ? `${lesson.quiz_count} Kuis` : 'Belum ada kuis'}
                                        </span>
                                        <a
                                            href={route('admin.lessons.edit', lesson.id)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:bg-blue-900/20 transition-colors"
                                        >
                                            <EditOutlinedIcon sx={{ fontSize: 18 }} />
                                        </a>
                                        <button
                                            onClick={() => handleDelete(lesson)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-red-600 dark:text-red-400 hover:bg-red-50 dark:bg-red-900/20 transition-colors"
                                        >
                                            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Delete Dialog */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <DeleteOutlineIcon sx={{ fontSize: 28 }} className="text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="text-base font-black text-gray-900 dark:text-white mb-2">Hapus Pelajaran?</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            Apakah Anda yakin ingin menghapus pelajaran <strong>"{deleteConfirm.title}"</strong>?
                        </p>
                        {deleteConfirm.quiz_count > 0 && (
                            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-left dark:border-red-900/50 dark:bg-red-900/20">
                                <p className="text-sm font-black text-red-700 dark:text-red-300">Validasi berlapis</p>
                                <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-300">
                                    Pelajaran ini memiliki {deleteConfirm.quiz_count} kuis. Jika dilanjutkan, kuis dan soal yang terhubung akan ikut terhapus.
                                </p>
                                <label className="mt-3 flex items-start gap-2 text-xs font-bold text-red-700 dark:text-red-300">
                                    <input
                                        type="checkbox"
                                        checked={forceDeleteQuizzes}
                                        onChange={(e) => setForceDeleteQuizzes(e.target.checked)}
                                        className="mt-0.5 rounded border-red-300 text-red-600 focus:ring-red-500"
                                    />
                                    Saya paham dan ingin menghapus kuis terkait.
                                </label>
                            </div>
                        )}
                        {deleteConfirm.progress_count > 0 && (
                            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-left dark:border-amber-900/50 dark:bg-amber-900/20">
                                <p className="text-xs font-bold text-amber-700 dark:text-amber-300">
                                    Ada {deleteConfirm.progress_count} progress murid. Backend akan menolak penghapusan agar riwayat belajar tidak rusak.
                                </p>
                            </div>
                        )}
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 h-11 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-800/50 transition-colors">Batal</button>
                            <button
                                onClick={confirmDelete}
                                disabled={(deleteConfirm.quiz_count > 0 && !forceDeleteQuizzes) || deleteConfirm.progress_count > 0}
                                className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
