import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/UI/Card';

const emptyForm = {
    title: '',
    description: '',
    level_id: '',
    module_id: '',
    lesson_id: '',
    status: 'draft',
};

export default function ManajemenPresentasi({ decks = {}, filters = {}, levels = [], modules = [], lessons = [] }) {
    const rows = decks.data || [];
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const form = useForm(emptyForm);

    const normalizePayload = (data) => ({
        ...data,
        level_id: data.level_id || null,
        module_id: data.module_id || null,
        lesson_id: data.lesson_id || null,
    });

    const openCreate = () => {
        setEditing(null);
        form.setData(emptyForm);
        setShowForm(true);
    };

    const openEdit = (deck) => {
        setEditing(deck);
        form.setData({
            title: deck.title || '',
            description: deck.description || '',
            level_id: deck.level_id || '',
            module_id: deck.module_id || '',
            lesson_id: deck.lesson_id || '',
            status: deck.status || 'draft',
        });
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditing(null);
        form.reset();
    };

    const submitForm = (event) => {
        event.preventDefault();
        form.transform(normalizePayload);

        return editing
            ? form.put(route('admin.presentations.update', editing.id), { preserveScroll: true, onSuccess: closeForm })
            : form.post(route('admin.presentations.store'), { preserveScroll: true });
    };

    const submitFilters = (event) => {
        event.preventDefault();
        router.get(route('admin.presentations.index'), { search, status }, { preserveState: true, replace: true });
    };

    const deleteDeck = (deck) => {
        if (!window.confirm(`Hapus presentasi "${deck.title}"?`)) return;
        router.delete(route('admin.presentations.destroy', deck.id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Admin - Presentasi" />

            <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-600">Quizizz-style Slides</p>
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Presentasi</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Buat slide ajar sederhana seperti PowerPoint ringan untuk sesi sensei.
                        </p>
                    </div>
                    <button onClick={openCreate} className="h-11 rounded-xl bg-[#E64A19] px-5 text-sm font-black text-white">
                        Buat Presentasi
                    </button>
                </div>

                <Card>
                    <form onSubmit={submitFilters} className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px_auto]">
                        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari presentasi..." className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                        <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white">
                            <option value="all">Semua Status</option>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                        <button className="h-11 rounded-xl bg-gray-900 px-5 text-sm font-black text-white dark:bg-white dark:text-gray-900">Filter</button>
                    </form>
                </Card>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                    {rows.map((deck) => (
                        <Card key={deck.id} hover className="h-full overflow-hidden">
                            <div className="relative">
                                <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-orange-200 opacity-40 dark:bg-orange-900" />
                                <div className="relative flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex flex-wrap gap-2">
                                            <span className={`rounded-full px-2 py-1 text-[10px] font-black ${deck.status === 'published' ? 'bg-green-50 text-green-600 dark:bg-green-900/20' : 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20'}`}>{deck.status}</span>
                                            <span className="rounded-full bg-orange-50 px-2 py-1 text-[10px] font-black text-orange-600 dark:bg-orange-900/20">{deck.slides_count || 0} slide</span>
                                        </div>
                                        <h2 className="mt-4 text-lg font-black text-gray-900 dark:text-white">{deck.title}</h2>
                                        <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{deck.description || 'Belum ada deskripsi.'}</p>
                                        <p className="mt-3 text-xs font-bold text-gray-400">{deck.level?.level_name || 'General'} {deck.module ? `- ${deck.module.title}` : ''}</p>
                                    </div>
                                </div>
                                <div className="mt-5 grid grid-cols-2 gap-2">
                                    <Link href={route('admin.presentations.builder', deck.id)} className="rounded-xl bg-orange-600 px-4 py-2 text-center text-xs font-black text-white">Builder</Link>
                                    <Link href={route('admin.presentations.presenter', deck.id)} className="rounded-xl bg-gray-950 px-4 py-2 text-center text-xs font-black text-white dark:bg-white dark:text-gray-950">Present</Link>
                                    <button onClick={() => openEdit(deck)} className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-black text-gray-700 dark:border-gray-700 dark:text-gray-200">Edit</button>
                                    <button onClick={() => deleteDeck(deck)} className="rounded-xl border border-red-100 px-4 py-2 text-xs font-black text-red-600 dark:border-red-900/40">Hapus</button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {rows.length === 0 && <Card><p className="text-center text-sm font-bold text-gray-500">Belum ada presentasi.</p></Card>}

                {showForm && (
                    <div className="fixed inset-0 z-[70] overflow-y-auto bg-gray-950/50 p-4 backdrop-blur-sm">
                        <div className="mx-auto my-8 max-w-3xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-900">
                            <div className="mb-6 flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-600">Deck Presentasi</p>
                                    <h2 className="text-xl font-black text-gray-900 dark:text-white">{editing ? 'Edit Presentasi' : 'Buat Presentasi Baru'}</h2>
                                </div>
                                <button onClick={closeForm} className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-black text-gray-600 dark:bg-gray-800 dark:text-gray-300">Tutup</button>
                            </div>
                            <form onSubmit={submitForm} className="space-y-4">
                                <input value={form.data.title} onChange={(event) => form.setData('title', event.target.value)} placeholder="Judul presentasi" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                                <textarea value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} placeholder="Deskripsi singkat" className="min-h-24 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                    <select value={form.data.level_id} onChange={(event) => form.setData('level_id', event.target.value)} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white">
                                        <option value="">Tanpa Level</option>
                                        {levels.map((level) => <option key={level.id} value={level.id}>{level.level_name}</option>)}
                                    </select>
                                    <select value={form.data.module_id} onChange={(event) => form.setData('module_id', event.target.value)} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white">
                                        <option value="">Tanpa Modul</option>
                                        {modules.map((module) => <option key={module.id} value={module.id}>{module.title}</option>)}
                                    </select>
                                    <select value={form.data.lesson_id} onChange={(event) => form.setData('lesson_id', event.target.value)} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white">
                                        <option value="">Tanpa Lesson</option>
                                        {lessons.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.title}</option>)}
                                    </select>
                                    <select value={form.data.status} onChange={(event) => form.setData('status', event.target.value)} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white">
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                    </select>
                                </div>
                                {Object.values(form.errors).length > 0 && <p className="text-sm font-bold text-red-600">{Object.values(form.errors)[0]}</p>}
                                <div className="flex justify-end gap-3">
                                    <button type="button" onClick={closeForm} className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-black text-gray-600 dark:border-gray-700 dark:text-gray-300">Batal</button>
                                    <button disabled={form.processing} className="rounded-xl bg-[#E64A19] px-6 py-3 text-sm font-black text-white disabled:opacity-50">{form.processing ? 'Menyimpan...' : 'Simpan'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
