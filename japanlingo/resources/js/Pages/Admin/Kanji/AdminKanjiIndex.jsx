import React, { useRef, useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/UI/Card';

const emptyForm = {
    kanji: '',
    onyomi: '',
    kunyomi: '',
    meaning: '',
    indonesian_meaning: '',
    jlpt_level: 'N3',
    stroke_count: '',
    tags_text: '',
    example_word: '',
    example_reading: '',
    example_meaning: '',
    example_sentence: '',
    example_sentence_reading: '',
    example_sentence_meaning: '',
    status: 'draft',
};

const toForm = (item) => ({
    kanji: item.kanji || '',
    onyomi: item.onyomi || '',
    kunyomi: item.kunyomi || '',
    meaning: item.meaning || '',
    indonesian_meaning: item.indonesian_meaning || '',
    jlpt_level: item.jlpt_level || 'N3',
    stroke_count: item.stroke_count || '',
    tags_text: Array.isArray(item.tags) ? item.tags.join(', ') : '',
    example_word: item.example_word || '',
    example_reading: item.example_reading || '',
    example_meaning: item.example_meaning || '',
    example_sentence: item.example_sentence || '',
    example_sentence_reading: item.example_sentence_reading || '',
    example_sentence_meaning: item.example_sentence_meaning || '',
    status: item.status || 'draft',
});

const parseTags = (value) => value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

export default function AdminKanjiIndex({ kanji = {}, filters = {} }) {
    const rows = kanji.data || [];
    const importInputRef = useRef(null);
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [autoFillLoading, setAutoFillLoading] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [jlptLevel, setJlptLevel] = useState(filters.jlpt_level || 'all');

    const form = useForm(emptyForm);

    const openCreate = () => {
        setEditing(null);
        form.reset();
        setShowForm(true);
    };

    const openEdit = (item) => {
        setEditing(item);
        form.setData(toForm(item));
        setShowForm(true);
    };

    const submitFilters = (event) => {
        event.preventDefault();
        router.get(route('admin.kanji.index'), {
            search,
            status,
            jlpt_level: jlptLevel,
        }, { preserveState: true, replace: true });
    };

    const submitForm = (event) => {
        event.preventDefault();
        form.transform((data) => ({
            ...data,
            tags: parseTags(data.tags_text),
            stroke_count: data.stroke_count || null,
        }));

        return editing
            ? form.put(route('admin.kanji.update', editing.id), { preserveScroll: true, onSuccess: closeForm })
            : form.post(route('admin.kanji.store'), { preserveScroll: true, onSuccess: closeForm });
    };

    const closeForm = () => {
        setShowForm(false);
        setEditing(null);
        form.reset();
    };

    const deleteKanji = (item) => {
        if (!window.confirm(`Hapus kanji ${item.kanji}?`)) return;
        router.delete(route('admin.kanji.destroy', item.id), { preserveScroll: true });
    };

    const importKanji = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const payload = new FormData();
        payload.append('import_file', file);

        router.post(route('admin.kanji.import'), payload, {
            forceFormData: true,
            preserveScroll: true,
            preserveState: false,
            onFinish: () => {
                event.target.value = '';
            },
        });
    };

    const autoFill = async () => {
        if (!form.data.kanji) return;

        setAutoFillLoading(true);
        try {
            const response = await fetch(route('admin.kanji.autofill', { kanji: form.data.kanji }));
            const payload = await response.json();

            if (!response.ok) {
                throw new Error(payload.message || 'Auto-fill gagal');
            }

            form.setData({
                ...form.data,
                kanji: payload.kanji || form.data.kanji,
                onyomi: payload.onyomi || form.data.onyomi,
                kunyomi: payload.kunyomi || form.data.kunyomi,
                meaning: payload.meaning || form.data.meaning,
                jlpt_level: payload.jlpt_level || form.data.jlpt_level,
                stroke_count: payload.stroke_count || form.data.stroke_count,
            });
        } catch (error) {
            window.alert(error.message || 'Auto-fill gagal. Isi data manual atau coba lagi nanti.');
        } finally {
            setAutoFillLoading(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Admin - Kanji Bank" />

            <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-red-600 dark:text-red-400">N3 Content Bank</p>
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Kanji Bank</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Basis data kanji untuk materi, kuis, dan latihan N3.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <input ref={importInputRef} type="file" accept=".csv,.txt" className="hidden" onChange={importKanji} />
                        <button onClick={() => importInputRef.current?.click()} className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm font-black text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                            Import CSV
                        </button>
                        <button onClick={openCreate} className="h-11 rounded-xl bg-[#E64A19] px-5 text-sm font-black text-white">
                            Tambah Kanji
                        </button>
                    </div>
                </div>

                <Card>
                    <form onSubmit={submitFilters} className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px_180px_auto]">
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Cari: fire, water, school, onyomi, kunyomi..."
                            className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                        />
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
                                <div className="flex gap-4">
                                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-red-50 text-5xl font-black text-red-600 dark:bg-red-900/20 dark:text-red-300">
                                        {item.kanji}
                                    </div>
                                    <div>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-black text-gray-600 dark:bg-gray-800 dark:text-gray-300">{item.jlpt_level}</span>
                                            <span className={`rounded-full px-2 py-1 text-[10px] font-black ${item.status === 'published' ? 'bg-green-50 text-green-600 dark:bg-green-900/20' : 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20'}`}>{item.status}</span>
                                        </div>
                                        <p className="mt-2 text-sm font-black text-gray-900 dark:text-white">{item.indonesian_meaning || item.meaning || 'Belum ada arti'}</p>
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">On: {item.onyomi || '-'} | Kun: {item.kunyomi || '-'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/50">
                                <p className="text-xs font-black text-gray-900 dark:text-white">{item.example_word || 'Contoh kata belum diisi'}</p>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{item.example_reading || item.example_meaning || 'Tambahkan contoh untuk membantu user.'}</p>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <button onClick={() => openEdit(item)} className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-xs font-black text-gray-700 dark:border-gray-700 dark:text-gray-200">Edit</button>
                                <button onClick={() => deleteKanji(item)} className="rounded-xl border border-red-100 px-4 py-2 text-xs font-black text-red-600 dark:border-red-900/40">Hapus</button>
                            </div>
                        </Card>
                    ))}
                </div>

                {rows.length === 0 && (
                    <Card>
                        <div className="text-center">
                            <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Tidak ada hasil kanji.</p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Jika mencari kata Inggris seperti "fire", pastikan level terkait sudah disync. Contoh: 火 ada di N5, bukan N3.
                            </p>
                        </div>
                    </Card>
                )}

                {kanji.links && (
                    <div className="flex flex-wrap justify-center gap-2">
                        {kanji.links.map((link, index) => (
                            <Link
                                key={`${link.label}-${index}`}
                                href={link.url || '#'}
                                preserveScroll
                                className={`rounded-lg px-3 py-2 text-xs font-black ${link.active ? 'bg-red-600 text-white' : 'bg-white text-gray-600 dark:bg-gray-900 dark:text-gray-300'} ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}

                {showForm && (
                    <div className="fixed inset-0 z-[70] overflow-y-auto bg-gray-950/50 p-4 backdrop-blur-sm">
                        <div className="mx-auto my-8 max-w-4xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-900">
                            <div className="mb-6 flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-[0.25em] text-red-600">Kanji Editor</p>
                                    <h2 className="text-xl font-black text-gray-900 dark:text-white">{editing ? 'Edit Kanji' : 'Tambah Kanji'}</h2>
                                </div>
                                <button onClick={closeForm} className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-black text-gray-600 dark:bg-gray-800 dark:text-gray-300">Tutup</button>
                            </div>

                            <form onSubmit={submitForm} className="space-y-5">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-[140px_1fr_1fr]">
                                    <input value={form.data.kanji} onChange={(event) => form.setData('kanji', event.target.value)} placeholder="漢" className="h-24 rounded-2xl border border-gray-200 bg-gray-50 text-center text-5xl font-black text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                                    <div className="space-y-3">
                                        <input value={form.data.onyomi} onChange={(event) => form.setData('onyomi', event.target.value)} placeholder="Onyomi" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                                        <input value={form.data.kunyomi} onChange={(event) => form.setData('kunyomi', event.target.value)} placeholder="Kunyomi" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                                    </div>
                                    <div className="space-y-3">
                                        <input value={form.data.meaning} onChange={(event) => form.setData('meaning', event.target.value)} placeholder="Meaning Inggris" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                                        <input value={form.data.indonesian_meaning} onChange={(event) => form.setData('indonesian_meaning', event.target.value)} placeholder="Arti Indonesia" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                    <select value={form.data.jlpt_level} onChange={(event) => form.setData('jlpt_level', event.target.value)} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white">
                                        <option value="N3">N3</option>
                                        <option value="N4">N4</option>
                                        <option value="N5">N5</option>
                                    </select>
                                    <input type="number" value={form.data.stroke_count} onChange={(event) => form.setData('stroke_count', event.target.value)} placeholder="Stroke" className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                                    <input value={form.data.tags_text} onChange={(event) => form.setData('tags_text', event.target.value)} placeholder="tag1, tag2" className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                                    <select value={form.data.status} onChange={(event) => form.setData('status', event.target.value)} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white">
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <input value={form.data.example_word} onChange={(event) => form.setData('example_word', event.target.value)} placeholder="Contoh kata" className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                                    <input value={form.data.example_reading} onChange={(event) => form.setData('example_reading', event.target.value)} placeholder="Reading" className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                                    <input value={form.data.example_meaning} onChange={(event) => form.setData('example_meaning', event.target.value)} placeholder="Arti contoh" className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                                </div>

                                <textarea value={form.data.example_sentence} onChange={(event) => form.setData('example_sentence', event.target.value)} placeholder="Contoh kalimat" className="min-h-24 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <textarea value={form.data.example_sentence_reading} onChange={(event) => form.setData('example_sentence_reading', event.target.value)} placeholder="Reading kalimat" className="min-h-20 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                                    <textarea value={form.data.example_sentence_meaning} onChange={(event) => form.setData('example_sentence_meaning', event.target.value)} placeholder="Arti kalimat" className="min-h-20 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                                </div>

                                {form.errors.kanji && <p className="text-sm font-bold text-red-600">{form.errors.kanji}</p>}

                                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                                    <button type="button" onClick={autoFill} disabled={autoFillLoading || !form.data.kanji} className="rounded-xl border border-blue-100 px-5 py-3 text-sm font-black text-blue-600 disabled:opacity-50 dark:border-blue-900/40">
                                        {autoFillLoading ? 'Mengambil data...' : 'Auto-fill API'}
                                    </button>
                                    <div className="flex gap-3">
                                        <button type="button" onClick={closeForm} className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-black text-gray-600 dark:border-gray-700 dark:text-gray-300">Batal</button>
                                        <button disabled={form.processing} className="rounded-xl bg-[#E64A19] px-6 py-3 text-sm font-black text-white disabled:opacity-50">{form.processing ? 'Menyimpan...' : 'Simpan'}</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
