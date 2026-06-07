import React, { useRef, useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/UI/Card';

const emptyForm = {
    word: '',
    reading: '',
    meaning_id: '',
    meaning_en: '',
    jlpt_level: 'N3',
    category: '',
    tags_text: '',
    example_sentence: '',
    example_reading: '',
    example_meaning: '',
    audio_url: '',
    status: 'draft',
};

const parseTags = (value) => value.split(',').map((tag) => tag.trim()).filter(Boolean);

const toForm = (item) => ({
    word: item.word || '',
    reading: item.reading || '',
    meaning_id: item.meaning_id || '',
    meaning_en: item.meaning_en || '',
    jlpt_level: item.jlpt_level || 'N3',
    category: item.category || '',
    tags_text: Array.isArray(item.tags) ? item.tags.join(', ') : '',
    example_sentence: item.example_sentence || '',
    example_reading: item.example_reading || '',
    example_meaning: item.example_meaning || '',
    audio_url: item.audio_url || '',
    status: item.status || 'draft',
});

export default function Kosakata({ vocabulary = {}, filters = {} }) {
    const rows = vocabulary.data || [];
    const importInputRef = useRef(null);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [jlptLevel, setJlptLevel] = useState(filters.jlpt_level || 'all');
    const form = useForm(emptyForm);

    const openCreate = () => {
        setEditing(null);
        form.setData(emptyForm);
        setShowForm(true);
    };

    const openEdit = (item) => {
        setEditing(item);
        form.setData(toForm(item));
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditing(null);
        form.reset();
    };

    const submitFilters = (event) => {
        event.preventDefault();
        router.get(route('admin.vocabulary.index'), { search, status, jlpt_level: jlptLevel }, { preserveState: true, replace: true });
    };

    const submitForm = (event) => {
        event.preventDefault();
        form.transform((data) => ({
            ...data,
            tags: parseTags(data.tags_text),
        }));

        return editing
            ? form.put(route('admin.vocabulary.update', editing.id), { preserveScroll: true, onSuccess: closeForm })
            : form.post(route('admin.vocabulary.store'), { preserveScroll: true, onSuccess: closeForm });
    };

    const importVocabulary = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const payload = new FormData();
        payload.append('import_file', file);

        router.post(route('admin.vocabulary.import'), payload, {
            forceFormData: true,
            preserveScroll: true,
            preserveState: false,
            onFinish: () => {
                event.target.value = '';
            },
        });
    };

    const deleteVocabulary = (item) => {
        if (!window.confirm(`Hapus kosakata ${item.word}?`)) return;
        router.delete(route('admin.vocabulary.destroy', item.id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Admin - Kosakata" />

            <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-600">Vocabulary Bank</p>
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Kosakata</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Basis data kosakata untuk flashcard dan quiz drill.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link href={route('admin.vocabulary.template')} className="flex h-11 items-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-black text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                            Template CSV
                        </Link>
                        <input ref={importInputRef} type="file" accept=".csv,.txt" className="hidden" onChange={importVocabulary} />
                        <button onClick={() => importInputRef.current?.click()} className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm font-black text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                            Import CSV
                        </button>
                        <button onClick={openCreate} className="h-11 rounded-xl bg-[#E64A19] px-5 text-sm font-black text-white">
                            Tambah Kosakata
                        </button>
                    </div>
                </div>

                <Card>
                    <form onSubmit={submitFilters} className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_160px_160px_auto]">
                        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari kata, reading, arti, kategori..." className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                        <select value={jlptLevel} onChange={(event) => setJlptLevel(event.target.value)} className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white">
                            <option value="all">Semua JLPT</option>
                            <option value="N3">N3</option>
                            <option value="N4">N4</option>
                            <option value="N5">N5</option>
                        </select>
                        <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white">
                            <option value="all">Semua Status</option>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                        <button className="h-11 rounded-xl bg-gray-900 px-5 text-sm font-black text-white dark:bg-white dark:text-gray-900">Filter</button>
                    </form>
                </Card>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                    {rows.map((item) => (
                        <Card key={item.id} className="h-full">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="rounded-full bg-orange-50 px-2 py-1 text-[10px] font-black text-orange-600 dark:bg-orange-900/20">{item.jlpt_level}</span>
                                        <span className={`rounded-full px-2 py-1 text-[10px] font-black ${item.status === 'published' ? 'bg-green-50 text-green-600 dark:bg-green-900/20' : 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20'}`}>{item.status}</span>
                                        {item.category && <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-black text-gray-600 dark:bg-gray-800 dark:text-gray-300">{item.category}</span>}
                                    </div>
                                    <h2 className="mt-3 text-4xl font-black text-gray-900 dark:text-white">{item.word}</h2>
                                    <p className="mt-1 text-lg font-bold text-gray-500 dark:text-gray-400">{item.reading || '-'}</p>
                                    <p className="mt-3 text-sm font-black text-gray-900 dark:text-white">{item.meaning_id || item.meaning_en || 'Belum ada arti'}</p>
                                </div>
                            </div>
                            <div className="mt-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/50">
                                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{item.example_sentence || 'Contoh kalimat belum diisi.'}</p>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{item.example_meaning || item.example_reading || ''}</p>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <button onClick={() => openEdit(item)} className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-xs font-black text-gray-700 dark:border-gray-700 dark:text-gray-200">Edit</button>
                                <button onClick={() => deleteVocabulary(item)} className="rounded-xl border border-red-100 px-4 py-2 text-xs font-black text-red-600 dark:border-red-900/40">Hapus</button>
                            </div>
                        </Card>
                    ))}
                </div>

                {rows.length === 0 && (
                    <Card>
                        <p className="text-center text-sm font-bold text-gray-500">Belum ada kosakata. Tambahkan manual atau import CSV.</p>
                    </Card>
                )}

                {vocabulary.links && (
                    <div className="flex flex-wrap justify-center gap-2">
                        {vocabulary.links.map((link, index) => (
                            <Link key={`${link.label}-${index}`} href={link.url || '#'} preserveScroll className={`rounded-lg px-3 py-2 text-xs font-black ${link.active ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 dark:bg-gray-900 dark:text-gray-300'} ${!link.url ? 'pointer-events-none opacity-40' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </div>
                )}

                {showForm && (
                    <div className="fixed inset-0 z-[70] overflow-y-auto bg-gray-950/50 p-4 backdrop-blur-sm">
                        <div className="mx-auto my-8 max-w-4xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-900">
                            <div className="mb-6 flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-600">Vocabulary Editor</p>
                                    <h2 className="text-xl font-black text-gray-900 dark:text-white">{editing ? 'Edit Kosakata' : 'Tambah Kosakata'}</h2>
                                </div>
                                <button onClick={closeForm} className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-black text-gray-600 dark:bg-gray-800 dark:text-gray-300">Tutup</button>
                            </div>
                            <form onSubmit={submitForm} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <input value={form.data.word} onChange={(event) => form.setData('word', event.target.value)} placeholder="言葉 / kata Jepang" className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                                    <input value={form.data.reading} onChange={(event) => form.setData('reading', event.target.value)} placeholder="Reading / kana" className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                                    <input value={form.data.category} onChange={(event) => form.setData('category', event.target.value)} placeholder="Kategori: noun, verb..." className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <input value={form.data.meaning_id} onChange={(event) => form.setData('meaning_id', event.target.value)} placeholder="Arti Indonesia" className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                                    <input value={form.data.meaning_en} onChange={(event) => form.setData('meaning_en', event.target.value)} placeholder="English meaning opsional" className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                    <select value={form.data.jlpt_level} onChange={(event) => form.setData('jlpt_level', event.target.value)} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white">
                                        <option value="N3">N3</option>
                                        <option value="N4">N4</option>
                                        <option value="N5">N5</option>
                                    </select>
                                    <select value={form.data.status} onChange={(event) => form.setData('status', event.target.value)} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white">
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                    </select>
                                    <input value={form.data.tags_text} onChange={(event) => form.setData('tags_text', event.target.value)} placeholder="tag1, tag2" className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white md:col-span-2" />
                                </div>
                                <textarea value={form.data.example_sentence} onChange={(event) => form.setData('example_sentence', event.target.value)} placeholder="Contoh kalimat Jepang" className="min-h-20 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <textarea value={form.data.example_reading} onChange={(event) => form.setData('example_reading', event.target.value)} placeholder="Reading contoh" className="min-h-20 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                                    <textarea value={form.data.example_meaning} onChange={(event) => form.setData('example_meaning', event.target.value)} placeholder="Arti contoh" className="min-h-20 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                                </div>
                                <input value={form.data.audio_url} onChange={(event) => form.setData('audio_url', event.target.value)} placeholder="Audio URL opsional" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
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

