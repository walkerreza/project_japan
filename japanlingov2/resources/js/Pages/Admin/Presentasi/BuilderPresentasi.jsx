import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BoardCanvas from '@/Components/Features/Board/BoardCanvas';
import EditableBoardCanvas from '@/Components/Features/Board/EditableBoardCanvas';

const createSlideKey = () => `slide-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const emptySlide = {
    id: null,
    title: 'Slide Baru',
    layout: 'content',
    content: '',
    media_url: '',
    background: 'light',
    accent_color: '#E64A19',
    speaker_notes: '',
    board_data: { strokes: [] },
    snapshot_data: null,
    _clientKey: createSlideKey(),
};

const templates = [
    { label: 'Title', layout: 'title', title: 'Judul Presentasi', content: 'Subjudul atau tujuan pembelajaran.' },
    { label: 'Materi', layout: 'content', title: 'Poin Utama', content: 'Tulis 3-5 poin penting untuk dijelaskan.' },
    { label: 'Kosakata', layout: 'vocabulary', title: '会議', content: 'かいぎ\nrapat\n今日は一時から会議があります。' },
    { label: 'Kanji', layout: 'kanji', title: '割', content: 'Arti: membagi, diskon\nOnyomi: カツ\nContoh: 割引 - diskon' },
    { label: 'Media', layout: 'media', title: 'Gambar / Video', content: 'Tambahkan penjelasan media.', media_url: '' },
    { label: 'Pertanyaan', layout: 'question', title: 'Pertanyaan Pemantik', content: 'Apa arti dari 会議?' },
];

const boardTemplate = {
    label: 'Board',
    layout: 'board',
    title: 'Board Diskusi',
    content: 'Gunakan papan ini untuk menjelaskan kanji, pola kalimat, atau tanya jawab.',
};

const backgroundClass = {
    light: 'bg-white text-gray-950',
    dark: 'bg-gray-950 text-white',
    sunrise: 'bg-gradient-to-br from-orange-100 via-amber-50 to-white text-gray-950',
    sakura: 'bg-gradient-to-br from-pink-100 via-white to-rose-50 text-gray-950',
    ocean: 'bg-gradient-to-br from-cyan-100 via-white to-blue-100 text-gray-950',
    forest: 'bg-gradient-to-br from-emerald-100 via-white to-lime-100 text-gray-950',
};

function SlidePreview({ slide, small = false }) {
    const lines = String(slide.content || '').split('\n').filter(Boolean);
    const accent = slide.accent_color || '#E64A19';

    return (
        <div className={`${backgroundClass[slide.background] || backgroundClass.light} ${small ? 'min-h-[120px] rounded-2xl p-4' : 'min-h-[360px] rounded-[2rem] p-8 sm:p-10'} relative overflow-hidden border border-gray-200 shadow-sm dark:border-gray-800`}>
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-20" style={{ backgroundColor: accent }} />
            <div className="relative z-10 flex min-h-full flex-col">
                {slide.layout === 'title' && (
                    <div className="my-auto">
                        <p className="mb-4 text-xs font-black uppercase tracking-[0.3em]" style={{ color: accent }}>JapanLingo</p>
                        <h2 className={`${small ? 'text-2xl' : 'text-5xl sm:text-6xl'} font-black tracking-tight`}>{slide.title || 'Untitled'}</h2>
                        <p className={`${small ? 'mt-2 text-xs' : 'mt-6 text-xl'} max-w-2xl font-bold opacity-70`}>{slide.content}</p>
                    </div>
                )}
                {slide.layout === 'content' && (
                    <div>
                        <h2 className={`${small ? 'text-xl' : 'text-4xl'} font-black`}>{slide.title || 'Poin Utama'}</h2>
                        <div className="mt-6 space-y-3">
                            {(lines.length ? lines : ['Tulis poin materi di sini.']).map((line, index) => (
                                <div key={`${line}-${index}`} className={`${small ? 'text-xs' : 'text-xl'} rounded-2xl bg-white/60 p-3 font-bold shadow-sm dark:bg-gray-900/50`}>
                                    {line}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {slide.layout === 'vocabulary' && (
                    <div className="my-auto text-center">
                        <p className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: accent }}>Vocabulary</p>
                        <h2 className={`${small ? 'text-4xl' : 'text-7xl'} mt-4 font-black`}>{slide.title || '単語'}</h2>
                        <p className={`${small ? 'mt-2 text-sm' : 'mt-5 text-3xl'} font-bold opacity-70`}>{lines[0] || 'reading'}</p>
                        <p className={`${small ? 'mt-3 text-base' : 'mt-8 text-4xl'} font-black`}>{lines[1] || 'arti'}</p>
                        {!small && <p className="mx-auto mt-6 max-w-2xl text-lg italic opacity-70">{lines[2] || 'Contoh kalimat akan tampil di sini.'}</p>}
                    </div>
                )}
                {slide.layout === 'kanji' && (
                    <div className="grid flex-1 place-items-center gap-6 sm:grid-cols-[220px_1fr]">
                        <div className={`${small ? 'h-24 w-24 text-5xl' : 'h-48 w-48 text-8xl'} grid place-items-center rounded-[2rem] bg-white/70 font-black shadow-lg dark:bg-gray-900/60`}>
                            {slide.title || '漢'}
                        </div>
                        <div className="space-y-3">
                            {(lines.length ? lines : ['Arti: ...', 'Reading: ...', 'Contoh: ...']).map((line, index) => (
                                <p key={`${line}-${index}`} className={`${small ? 'text-xs' : 'text-xl'} font-black opacity-80`}>{line}</p>
                            ))}
                        </div>
                    </div>
                )}
                {slide.layout === 'media' && (
                    <div>
                        <h2 className={`${small ? 'text-xl' : 'text-4xl'} mb-5 font-black`}>{slide.title || 'Media'}</h2>
                        {slide.media_url ? (
                            <div className="overflow-hidden rounded-3xl bg-gray-950">
                                <img src={slide.media_url} alt={slide.title || 'media'} className={`${small ? 'h-24' : 'h-80'} w-full object-cover`} />
                            </div>
                        ) : (
                            <div className={`${small ? 'h-24' : 'h-80'} grid place-items-center rounded-3xl border-2 border-dashed border-gray-300 font-black opacity-50`}>Media URL</div>
                        )}
                        {!small && <p className="mt-5 text-lg font-bold opacity-70">{slide.content}</p>}
                    </div>
                )}
                {slide.layout === 'question' && (
                    <div className="my-auto text-center">
                        <p className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: accent }}>Question</p>
                        <h2 className={`${small ? 'text-2xl' : 'text-5xl'} mt-5 font-black`}>{slide.title || 'Pertanyaan'}</h2>
                        <p className={`${small ? 'mt-3 text-sm' : 'mt-8 text-2xl'} mx-auto max-w-3xl font-bold opacity-70`}>{slide.content}</p>
                    </div>
                )}
                {slide.layout === 'board' && (
                    <div>
                        <h2 className={`${small ? 'text-xl' : 'text-4xl'} mb-5 font-black`}>{slide.title || 'Board'}</h2>
                        <BoardCanvas
                            strokes={slide.board_data?.strokes || slide.board?.board_data?.strokes || []}
                            className={small ? 'rounded-xl shadow-none' : 'rounded-3xl'}
                        />
                        {!small && <p className="mt-5 text-lg font-bold opacity-70">{slide.content || 'Board interaktif untuk sesi ajar.'}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function BuilderPresentasi({ deck }) {
    const [slides, setSlides] = useState((deck.slides || []).map((slide) => ({
        ...slide,
        board_data: slide.board?.board_data || slide.board_data || { strokes: [] },
        snapshot_data: slide.board?.snapshot_data || slide.snapshot_data || null,
        _clientKey: `slide-id-${slide.id}`,
    })));
    const [activeIndex, setActiveIndex] = useState(0);
    const [status, setStatus] = useState(deck.status || 'draft');
    const [pptxFile, setPptxFile] = useState(null);
    const [isImporting, setIsImporting] = useState(false);
    const activeSlide = slides[activeIndex] || null;

    const updateSlide = (field, value) => {
        setSlides((current) => current.map((slide, index) => (
            index === activeIndex ? { ...slide, [field]: value } : slide
        )));
    };

    const addSlide = (template = emptySlide) => {
        const next = { ...emptySlide, ...template, id: null, _clientKey: createSlideKey() };
        setSlides((current) => [...current, next]);
        setActiveIndex(slides.length);
    };

    const duplicateSlide = () => {
        if (!activeSlide) return;
        addSlide({ ...activeSlide, title: `${activeSlide.title || 'Slide'} Copy` });
    };

    const removeSlide = () => {
        if (!activeSlide || !window.confirm('Hapus slide aktif?')) return;
        const next = slides.filter((_, index) => index !== activeIndex);
        setSlides(next);
        setActiveIndex(Math.max(0, activeIndex - 1));
    };

    const moveSlide = (direction) => {
        const nextIndex = activeIndex + direction;
        if (nextIndex < 0 || nextIndex >= slides.length) return;

        const next = [...slides];
        [next[activeIndex], next[nextIndex]] = [next[nextIndex], next[activeIndex]];
        setSlides(next);
        setActiveIndex(nextIndex);
    };

    const saveSlides = () => {
        router.post(route('admin.presentations.builder.update', deck.id), {
            status,
            slides: slides.map((slide) => ({
                id: slide.id,
                title: slide.title || '',
                layout: slide.layout || 'content',
                content: slide.content || '',
                media_url: slide.media_url || '',
                background: slide.background || 'light',
                accent_color: slide.accent_color || '#E64A19',
                speaker_notes: slide.speaker_notes || '',
                board_data: slide.board_data || { strokes: [] },
                snapshot_data: slide.snapshot_data || null,
            })),
        }, { preserveScroll: true });
    };

    const importPptx = (event) => {
        event.preventDefault();
        if (!pptxFile) return;

        setIsImporting(true);
        router.post(route('admin.presentations.import-pptx', deck.id), {
            pptx_file: pptxFile,
        }, {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => setIsImporting(false),
        });
    };

    const saveActiveBoard = () => {
        if (!activeSlide?.id || activeSlide.layout !== 'board') {
            saveSlides();
            return;
        }

        router.post(route('admin.presentations.slides.board.save', { presentationDeck: deck.id, presentationSlide: activeSlide.id }), {
            status,
            board_data: activeSlide.board_data || { strokes: [] },
            snapshot_data: activeSlide.snapshot_data || null,
        }, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Builder Presentasi - ${deck.title}`} />

            <div className="min-h-screen bg-[#F8F9FB] dark:bg-gray-950">
                <header className="sticky top-0 z-30 border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900 lg:px-6">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                            <Link href={route('admin.presentations.index')} className="text-xs font-black uppercase tracking-[0.25em] text-orange-600">Kembali</Link>
                            <h1 className="mt-1 truncate text-xl font-black text-gray-900 dark:text-white">{deck.title}</h1>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm font-bold dark:border-gray-700 dark:bg-gray-950 dark:text-white">
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                            <form onSubmit={importPptx} className="flex flex-wrap items-center gap-2">
                                <input
                                    type="file"
                                    accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                                    onChange={(event) => setPptxFile(event.target.files?.[0] || null)}
                                    className="max-w-[190px] text-xs font-bold text-gray-600 file:mr-2 file:rounded-xl file:border-0 file:bg-orange-50 file:px-3 file:py-2 file:text-xs file:font-black file:text-orange-700 dark:text-gray-300 dark:file:bg-orange-900/20 dark:file:text-orange-300"
                                />
                                <button disabled={!pptxFile || isImporting} className="h-10 rounded-xl border border-orange-200 px-4 text-sm font-black text-orange-700 disabled:opacity-50 dark:border-orange-900/50 dark:text-orange-300">
                                    {isImporting ? 'Import...' : 'Import PPTX'}
                                </button>
                            </form>
                            <Link href={route('admin.presentations.presenter', deck.id)} className="flex h-10 items-center rounded-xl bg-gray-950 px-4 text-sm font-black text-white dark:bg-white dark:text-gray-950">Present</Link>
                            <button onClick={saveSlides} className="h-10 rounded-xl bg-[#E64A19] px-5 text-sm font-black text-white">Simpan</button>
                        </div>
                    </div>
                </header>

                <main className="grid grid-cols-1 gap-5 p-4 lg:grid-cols-[260px_minmax(0,1fr)_340px] lg:p-6">
                    <aside className="space-y-3">
                        <div className="rounded-3xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Slides</h2>
                                <button onClick={() => addSlide()} className="rounded-xl bg-orange-50 px-3 py-2 text-xs font-black text-orange-700 dark:bg-orange-900/20 dark:text-orange-300">Tambah</button>
                            </div>
                            <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
                                {slides.map((slide, index) => (
                                    <button key={slide._clientKey} onClick={() => setActiveIndex(index)} className={`w-full rounded-2xl border p-2 text-left transition ${activeIndex === index ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-100 bg-gray-50 hover:border-gray-200 dark:border-gray-800 dark:bg-gray-950'}`}>
                                        <SlidePreview slide={slide} small />
                                        <p className="mt-2 truncate px-1 text-xs font-black text-gray-700 dark:text-gray-200">{index + 1}. {slide.title || 'Untitled'}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    <section className="space-y-4">
                        {activeSlide ? (
                            <>
                                <SlidePreview slide={activeSlide} />
                                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                                    <button onClick={() => moveSlide(-1)} className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-black text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">Naik</button>
                                    <button onClick={() => moveSlide(1)} className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-black text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">Turun</button>
                                    <button onClick={duplicateSlide} className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-black text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">Duplicate</button>
                                    <button onClick={removeSlide} className="rounded-xl border border-red-100 bg-white px-4 py-2 text-xs font-black text-red-600 dark:border-red-900/40 dark:bg-gray-900">Hapus</button>
                                </div>
                            </>
                        ) : (
                            <div className="grid min-h-[420px] place-items-center rounded-3xl border-2 border-dashed border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                                <button onClick={() => addSlide()} className="rounded-2xl bg-[#E64A19] px-6 py-3 text-sm font-black text-white">Tambah Slide Pertama</button>
                            </div>
                        )}
                    </section>

                    <aside className="space-y-4">
                        <div className="rounded-3xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Template</h2>
                            <div className="mt-4 grid grid-cols-2 gap-2">
                                {[...templates, boardTemplate].map((template) => (
                                    <button key={template.label} onClick={() => addSlide(template)} className="rounded-2xl border border-gray-100 bg-gray-50 p-3 text-left text-xs font-black text-gray-700 hover:border-orange-200 hover:bg-orange-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200 dark:hover:bg-orange-900/20">
                                        {template.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {activeSlide && (
                            <div className="rounded-3xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Edit Slide</h2>
                                <div className="mt-4 space-y-3">
                                    <input value={activeSlide.title || ''} onChange={(event) => updateSlide('title', event.target.value)} placeholder="Judul slide" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                                    <select value={activeSlide.layout} onChange={(event) => updateSlide('layout', event.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white">
                                        <option value="title">Title</option>
                                        <option value="content">Materi</option>
                                        <option value="vocabulary">Kosakata</option>
                                        <option value="kanji">Kanji</option>
                                        <option value="media">Media</option>
                                        <option value="question">Pertanyaan</option>
                                        <option value="board">Board</option>
                                    </select>
                                    {activeSlide.layout === 'board' ? (
                                        <div className="space-y-3">
                                            <textarea value={activeSlide.content || ''} onChange={(event) => updateSlide('content', event.target.value)} placeholder="Catatan board untuk sensei." className="min-h-24 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                                            <EditableBoardCanvas
                                                initialStrokes={activeSlide.board_data?.strokes || []}
                                                onChange={({ strokes, snapshot_data }) => {
                                                    setSlides((current) => current.map((slide, index) => (
                                                        index === activeIndex ? { ...slide, board_data: { strokes }, snapshot_data } : slide
                                                    )));
                                                }}
                                            />
                                            <button type="button" onClick={saveActiveBoard} className="w-full rounded-xl bg-gray-950 px-4 py-3 text-sm font-black text-white dark:bg-white dark:text-gray-950">
                                                {activeSlide.id ? 'Simpan Board Aktif' : 'Simpan Slide Dulu'}
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <textarea value={activeSlide.content || ''} onChange={(event) => updateSlide('content', event.target.value)} placeholder="Konten slide. Pisahkan poin dengan baris baru." className="min-h-36 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                                            <input value={activeSlide.media_url || ''} onChange={(event) => updateSlide('media_url', event.target.value)} placeholder="Media URL opsional" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                                        </>
                                    )}
                                    <div className="grid grid-cols-2 gap-3">
                                        <select value={activeSlide.background} onChange={(event) => updateSlide('background', event.target.value)} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white">
                                            <option value="light">Light</option>
                                            <option value="dark">Dark</option>
                                            <option value="sunrise">Sunrise</option>
                                            <option value="sakura">Sakura</option>
                                            <option value="ocean">Ocean</option>
                                            <option value="forest">Forest</option>
                                        </select>
                                        <input type="color" value={activeSlide.accent_color || '#E64A19'} onChange={(event) => updateSlide('accent_color', event.target.value)} className="h-[46px] w-full rounded-xl border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-950" />
                                    </div>
                                    <textarea value={activeSlide.speaker_notes || ''} onChange={(event) => updateSlide('speaker_notes', event.target.value)} placeholder="Catatan sensei, hanya tampil di presenter mode." className="min-h-24 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                                </div>
                            </div>
                        )}
                    </aside>
                </main>
            </div>
        </AuthenticatedLayout>
    );
}
