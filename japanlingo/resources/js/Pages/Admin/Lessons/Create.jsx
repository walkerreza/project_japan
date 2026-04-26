import React, { lazy, Suspense } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

// Lazy load editor untuk menghindari SSR issue
const QuillEditor = lazy(() => import('@/Components/Editor/QuillEditor'));

export default function LessonCreate({ modules = [], defaultModuleId = null }) {
    const { data, setData, post, processing, errors } = useForm({
        module_id: defaultModuleId || '',
        title: '',
        content: '',
        order: 0,
        duration_minutes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.lessons.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Tambah Pelajaran - Japanlingo" />
            <div className="min-h-screen bg-[#F8F9FB] font-sans">

                {/* Header */}
                <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={route('admin.lessons.index')} className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:text-white transition-colors">
                            <ArrowBackIcon sx={{ fontSize: 18 }} />
                        </Link>
                        <div className="h-6 w-px bg-gray-200" />
                        <div className="w-9 h-9 bg-[#E64A19] rounded-xl flex items-center justify-center text-white">
                            <ArticleOutlinedIcon sx={{ fontSize: 20 }} />
                        </div>
                        <div>
                            <h1 className="text-sm font-black text-gray-900 dark:text-white">Tambah Pelajaran Baru</h1>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">Isi detail pelajaran dan konten materi</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="bg-[#E64A19] hover:bg-[#D84315] disabled:opacity-60 text-white rounded-xl px-6 h-10 text-sm font-bold flex items-center gap-2 shadow-md shadow-orange-500/20 transition-colors"
                    >
                        <SaveOutlinedIcon sx={{ fontSize: 18 }} />
                        {processing ? 'Menyimpan...' : 'Simpan Pelajaran'}
                    </button>
                </header>

                <main className="max-w-3xl mx-auto p-6 space-y-5">

                    {/* Info Dasar */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 space-y-4">
                        <h2 className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">Informasi Pelajaran</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Modul <span className="text-red-500">*</span></label>
                                <select
                                    value={data.module_id}
                                    onChange={e => setData('module_id', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E64A19]/30 focus:border-[#E64A19]"
                                    required
                                >
                                    <option value="">Pilih Modul</option>
                                    {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                                </select>
                                {errors.module_id && <p className="text-red-500 text-xs mt-1">{errors.module_id}</p>}
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Judul Pelajaran <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E64A19]/30 focus:border-[#E64A19]"
                                    placeholder="Contoh: Pengenalan Huruf Hiragana"
                                    required
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Urutan <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.order}
                                    onChange={e => setData('order', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E64A19]/30 focus:border-[#E64A19]"
                                />
                                {errors.order && <p className="text-red-500 text-xs mt-1">{errors.order}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Durasi (menit)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={data.duration_minutes}
                                    onChange={e => setData('duration_minutes', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E64A19]/30 focus:border-[#E64A19]"
                                    placeholder="15"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Rich Text Editor */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 space-y-3">
                        <h2 className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">Konten Materi</h2>
                        {errors.content && <p className="text-red-500 text-xs">{errors.content}</p>}
                        <Suspense fallback={<div className="h-48 bg-gray-50 dark:bg-gray-800/50 rounded-xl animate-pulse" />}>
                            <QuillEditor
                                value={data.content}
                                onChange={val => setData('content', val)}
                                placeholder="Tulis materi pembelajaran di sini..."
                            />
                        </Suspense>
                    </div>

                </main>
            </div>
        </AuthenticatedLayout>
    );
}
