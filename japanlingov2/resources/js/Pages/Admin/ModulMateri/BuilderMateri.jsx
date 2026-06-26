import React, { useMemo, useState, lazy, Suspense } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// MUI Icons
import TitleIcon from '@mui/icons-material/Title';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import StudentPreviewModal from '@/Components/Features/StudentPreviewModal';
import LessonArticle from '@/Components/Features/Lesson/LessonArticle';

const QuillEditor = lazy(() => import('@/Components/Features/Editor/QuillEditor'));

const createLessonKey = () => `lesson-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const normalizeDocumentPath = (path) => {
    if (!path) return null;

    return String(path)
        .replaceAll('\\', '/')
        .replaceAll('%2F', '/')
        .replace(/^.*\/lesson-documents-download\//, '')
        .replace(/^.*\/lesson-documents\//, '')
        .replace(/^\/storage\//, '');
};

const buildDocumentUrls = (lesson) => {
    const normalizedPath = normalizeDocumentPath(lesson?.file_url);

    if (!normalizedPath || /^https?:\/\//i.test(normalizedPath)) {
        return lesson;
    }

    return {
        ...lesson,
        file_preview_url: lesson.file_preview_url || `/lesson-documents/${normalizedPath}`,
        file_download_url: lesson.file_download_url || `/lesson-documents-download/${normalizedPath}`,
    };
};

const normalizeLesson = (lesson, index) => ({
    ...buildDocumentUrls(lesson),
    _clientKey: lesson._clientKey || (lesson.id ? `lesson-id-${lesson.id}` : createLessonKey()),
    order: lesson.order ?? index,
});

const lessonTemplates = [
    {
        id: 'grammar',
        label: 'Grammar Lesson',
        title: 'Grammar N3 - Pola Kalimat Baru',
        duration_minutes: 12,
        content: `<h2>Tujuan Belajar</h2><p>Setelah materi ini, siswa memahami pola grammar dan bisa menggunakannya dalam kalimat sederhana.</p><h2>Pola</h2><p><strong>Rumus:</strong> ...</p><h2>Penjelasan</h2><p>Tulis penjelasan grammar di sini.</p><h2>Contoh Kalimat</h2><ul><li>日本語の例文 - arti Indonesia.</li><li>日本語の例文 - arti Indonesia.</li></ul><h2>Latihan Mini</h2><p>Buat 2 kalimat menggunakan pola ini.</p><h2>Rangkuman</h2><p>Tulis poin penting yang harus diingat siswa.</p>`,
    },
    {
        id: 'kanji',
        label: 'Kanji Lesson',
        title: 'Kanji N3 - Materi Kanji',
        duration_minutes: 10,
        content: `<h2>Target Kanji</h2><p style="font-size:48px;font-weight:900;line-height:1;">漢</p><p><strong>Arti:</strong> ...</p><p><strong>Onyomi:</strong> ...</p><p><strong>Kunyomi:</strong> ...</p><h2>Contoh Kata</h2><table><thead><tr><th>Kata</th><th>Reading</th><th>Arti</th></tr></thead><tbody><tr><td>漢字</td><td>かんじ</td><td>kanji</td></tr></tbody></table><h2>Contoh Kalimat</h2><p>日本語の例文 - arti Indonesia.</p><h2>Latihan Mini</h2><p>Tulis reading dan arti dari kanji target.</p>`,
    },
    {
        id: 'vocabulary',
        label: 'Vocabulary Lesson',
        title: 'Vocabulary N3 - Kosakata Baru',
        duration_minutes: 10,
        content: `<h2>Daftar Kosakata</h2><table><thead><tr><th>Kata</th><th>Reading</th><th>Arti</th><th>Catatan</th></tr></thead><tbody><tr><td>単語</td><td>たんご</td><td>kosakata</td><td>contoh catatan</td></tr></tbody></table><h2>Contoh Penggunaan</h2><ul><li>日本語の例文 - arti Indonesia.</li></ul><h2>Latihan Mini</h2><p>Pilih 5 kata dan buat kalimat pendek.</p>`,
    },
    {
        id: 'reading',
        label: 'Reading Lesson',
        title: 'Reading N3 - Bacaan Pendek',
        duration_minutes: 15,
        content: `<h2>Tujuan Membaca</h2><p>Latih pemahaman bacaan JLPT N3 dan identifikasi kosakata penting.</p><h2>Bacaan</h2><p>Tulis teks bacaan Jepang di sini.</p><h2>Kosakata Penting</h2><table><thead><tr><th>Kata</th><th>Arti</th></tr></thead><tbody><tr><td>例</td><td>contoh</td></tr></tbody></table><h2>Pertanyaan Pemahaman</h2><ol><li>Apa ide utama bacaan?</li><li>Kosakata apa yang baru?</li></ol>`,
    },
    {
        id: 'listening',
        label: 'Listening Lesson',
        title: 'Listening N3 - Latihan Mendengar',
        duration_minutes: 12,
        content: `<h2>Instruksi</h2><p>Dengarkan audio/video, lalu catat informasi penting.</p><h2>Target Pemahaman</h2><ul><li>Topik percakapan</li><li>Kata kunci</li><li>Kesimpulan pembicara</li></ul><h2>Transcript / Catatan</h2><p>Tambahkan transcript jika tersedia.</p><h2>Latihan Mini</h2><p>Tulis 3 kata yang kamu dengar dan artinya.</p>`,
    },
    {
        id: 'weekly',
        label: 'Weekly Recap',
        title: 'Weekly Recap - Minggu Ini',
        duration_minutes: 8,
        content: `<h2>Target Minggu Ini</h2><ul><li>Grammar: ...</li><li>Kanji: ...</li><li>Vocabulary: ...</li></ul><h2>Materi Yang Dipelajari</h2><p>Ringkas materi minggu ini.</p><h2>Checklist</h2><ul><li>Selesaikan semua lesson.</li><li>Kerjakan quiz mingguan.</li><li>Review materi yang salah.</li></ul><h2>Catatan Sensei</h2><p>Tambahkan arahan belajar untuk siswa.</p>`,
    },
];

const quickBlocks = [
    { label: 'Heading', html: '<h2>Judul Section</h2>' },
    { label: 'Paragraph', html: '<p>Tulis penjelasan materi di sini.</p>' },
    { label: 'Example', html: '<blockquote><p>日本語の例文</p><p><strong>Arti:</strong> Terjemahan Indonesia.</p></blockquote>' },
    { label: 'Vocab Table', html: '<table><thead><tr><th>Kata</th><th>Reading</th><th>Arti</th></tr></thead><tbody><tr><td>単語</td><td>たんご</td><td>kosakata</td></tr></tbody></table>' },
    { label: 'Kanji Card', html: '<div class="jl-kanji-card"><h2 style="font-size:48px;line-height:1;">漢</h2><p><strong>Arti:</strong> ...</p><p><strong>Reading:</strong> ...</p></div>' },
    { label: 'Note Box', html: '<aside><strong>Catatan Sensei:</strong> Tulis tips penting di sini.</aside>' },
    { label: 'Practice', html: '<h2>Latihan Mini</h2><ol><li>Kerjakan latihan pertama.</li><li>Tulis jawabanmu di catatan.</li></ol>' },
];

export default function ContentEditor({ module, lessons: initialLessons = [] }) {
    const initialNormalizedLessons = useMemo(() => (
        initialLessons.length > 0
            ? initialLessons.map(normalizeLesson)
            : [normalizeLesson({ id: null, type: 'text', title: 'Pelajaran Baru', content: '', video_url: '', file_url: '', order: 0, status: 'published' }, 0)]
    ), [initialLessons]);

    const { data, setData, post, processing, recentlySuccessful } = useForm({
        lessons: initialNormalizedLessons,
        deleted_files: [],
    });

    const [activeBlockId, setActiveBlockId] = useState(0);
    const [showPreview, setShowPreview] = useState(false);
    const [importingDocumentIndex, setImportingDocumentIndex] = useState(null);
    const [showKanjiImport, setShowKanjiImport] = useState(false);
    const [showTemplatePanel, setShowTemplatePanel] = useState(false);
    const [showBulkImport, setShowBulkImport] = useState(false);
    const kanjiForm = useForm({
        jlpt_level: 'N3',
        count: 10,
        status: 'published',
    });
    const bulkImportForm = useForm({
        import_file: null,
    });

    const updateBlock = (index, field, value) => {
        const newLessons = [...data.lessons];
        if (!newLessons[index]) return;
        newLessons[index][field] = value;
        setData('lessons', newLessons);
    };

    const getDeletableLessonPath = (path) => {
        if (!path || !String(path).includes('lessons/')) return null;
        const normalizedPath = normalizeDocumentPath(path);

        return normalizedPath?.startsWith('lessons/') ? normalizedPath : null;
    };

    const markFilesForDeletion = (paths) => {
        const normalizedPaths = paths
            .map(getDeletableLessonPath)
            .filter(Boolean);

        if (normalizedPaths.length === 0) return;

        setData('deleted_files', [...new Set([...(data.deleted_files || []), ...normalizedPaths])]);
    };

    const addBlock = (type) => {
        const newBlock = {
            id: null,
            type: type,
            title: type === 'text' ? 'Teks Baru' : type === 'video_yt' ? 'Video Baru' : 'File Baru',
            content: '',
            video_url: '',
            file_url: '',
            order: data.lessons.length,
            status: 'published',
            _clientKey: createLessonKey(),
        };
        setData('lessons', [...data.lessons, newBlock]);
        setActiveBlockId(data.lessons.length);
    };

    const addTemplateLesson = (template) => {
        const newBlock = normalizeLesson({
            id: null,
            type: 'text',
            title: template.title,
            content: template.content,
            video_url: '',
            file_url: '',
            order: data.lessons.length,
            duration_minutes: template.duration_minutes,
            status: 'draft',
        }, data.lessons.length);

        setData('lessons', [...data.lessons, newBlock]);
        setActiveBlockId(data.lessons.length);
        setShowTemplatePanel(false);
    };

    const insertQuickBlock = (html) => {
        const currentLesson = data.lessons[activeBlockId];
        if (!currentLesson) return;

        updateBlock(activeBlockId, 'content', `${currentLesson.content || ''}\n${html}`);
    };

    const removeBlock = (index) => {
        markFilesForDeletion([
            data.lessons[index]?.file_url,
            data.lessons[index]?.file_preview_url,
        ]);
        const newLessons = data.lessons.filter((_, i) => i !== index);
        setData('lessons', newLessons.map((lesson, lessonIndex) => ({ ...lesson, order: lessonIndex })));
        setActiveBlockId((current) => {
            if (newLessons.length === 0) return 0;
            if (current === index) return Math.max(0, index - 1);
            if (current > index) return current - 1;
            return current;
        });
    };

    const duplicateBlock = (index) => {
        const blockToCopy = data.lessons[index];
        const newBlock = { ...blockToCopy, id: null, order: data.lessons.length, _clientKey: createLessonKey() };
        setData('lessons', [...data.lessons, newBlock]);
        setActiveBlockId(data.lessons.length);
    };

    const clearDocumentFile = (index) => {
        const currentLesson = data.lessons[index];
        if (!currentLesson) return;

        markFilesForDeletion([currentLesson.file_url, currentLesson.file_preview_url]);

        const newLessons = [...data.lessons];
        newLessons[index] = {
            ...currentLesson,
            file_url: null,
            file_uploaded: null,
            file_preview_url: null,
            file_download_url: null,
            file_name: null,
            document_kind: null,
        };
        setData('lessons', newLessons);
    };

    const handleSave = () => {
        post(route('admin.modules.builder.update', module.id));
    };

    const handleDocumentImport = async (index, file) => {
        if (!file) return;

        setImportingDocumentIndex(index);

        try {
            const payload = new FormData();
            payload.append('document', file);

            const response = await window.axios.post(route('admin.modules.documents.import', module.id), payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const imported = response.data || {};
            const newLessons = [...data.lessons];
            markFilesForDeletion([
                newLessons[index]?.file_url,
                newLessons[index]?.file_preview_url,
            ]);
            newLessons[index] = {
                ...newLessons[index],
                type: 'file',
                file_url: imported.path || newLessons[index].file_url,
                file_preview_url: imported.url || null,
                file_download_url: imported.download_url || null,
                file_name: imported.name || file.name,
                document_kind: imported.document_kind || null,
                file_uploaded: null,
                content: imported.content_html || newLessons[index].content || '',
            };
            setData('lessons', newLessons);
        } catch (error) {
            window.alert(error.response?.data?.message || 'Gagal mengimport dokumen.');
        } finally {
            setImportingDocumentIndex(null);
        }
    };

    const handleImportKanjiLessons = (event) => {
        event.preventDefault();
        kanjiForm.post(route('admin.modules.kanji-lessons.import', module.id), {
            preserveScroll: true,
            preserveState: false,
            onSuccess: () => setShowKanjiImport(false),
        });
    };

    const handleBulkImportLessons = (event) => {
        event.preventDefault();
        bulkImportForm.post(route('admin.modules.lessons.import', module.id), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setShowBulkImport(false);
                bulkImportForm.reset();
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Builder: ${module.title} - Japanlingo`} />
            <div className="min-h-screen bg-[#F8F9FB] dark:bg-gray-950 flex flex-col font-sans">
                <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 lg:h-16 lg:px-6 lg:py-0">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                        <Link href={route('admin.modules.index')} className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:text-white transition-colors">
                            <ArrowBackIcon sx={{ fontSize: 18 }} />
                        </Link>
                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
                        <div className="flex min-w-0 items-center gap-2">
                            <div className="w-8 h-8 bg-[#E64A19] rounded-lg flex items-center justify-center text-white font-bold text-xs">
                                {module.level?.level_name?.charAt(0) || 'M'}
                            </div>
                            <div className="min-w-0">
                                <h1 className="truncate text-sm font-black text-gray-900 dark:text-white leading-none tracking-tight">Content Builder</h1>
                                <p className="mt-0.5 truncate text-[11px] font-medium text-gray-400 dark:text-gray-500">{module.title}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                        {recentlySuccessful && <span className="text-xs font-bold text-green-600 animate-pulse">Tersimpan!</span>}
                        <button
                            type="button"
                            onClick={() => setShowTemplatePanel(true)}
                            className="px-4 h-9 rounded-lg text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 transition-colors flex items-center gap-2"
                        >
                            Template Materi
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowBulkImport(true)}
                            className="px-4 h-9 rounded-lg text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 transition-colors flex items-center gap-2"
                        >
                            Bulk Import
                        </button>
                        <button 
                            type="button"
                            onClick={() => setShowPreview(true)} 
                            className="px-4 h-9 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                        >
                            <VisibilityIcon sx={{ fontSize: 18 }} /> Preview
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowKanjiImport(true)}
                            className="px-4 h-9 rounded-lg text-sm font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-300 transition-colors flex items-center gap-2"
                        >
                            Import Kanji Bank
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={processing}
                            className="bg-[#E64A19] hover:bg-[#D84315] disabled:opacity-50 text-white rounded-xl px-6 h-9 text-sm font-bold shadow-md transition-colors flex items-center gap-2"
                        >
                            <SaveOutlinedIcon sx={{ fontSize: 18 }} />
                            {processing ? 'Menyimpan...' : 'Simpan Konten'}
                        </button>
                    </div>
                    </div>
                </header>

                <main className="relative flex flex-1 flex-col justify-center gap-6 p-4 sm:p-6 lg:flex-row lg:p-8">
                    <div className="w-full max-w-[760px] space-y-6 pb-32">
                        <div className="bg-white dark:bg-gray-900 rounded-[20px] shadow-sm border border-gray-200 dark:border-gray-700 border-t-8 border-t-[#E64A19] p-6 sm:p-8">
                             <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{module.title}</h2>
                             <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{module.description || 'Tidak ada deskripsi'}</p>
                        </div>

                        {data.lessons.length === 0 && (
                            <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
                                <ArticleOutlinedIcon sx={{ fontSize: 46 }} className="mb-3 text-gray-300 dark:text-gray-600" />
                                <h3 className="text-lg font-black text-gray-900 dark:text-white">Belum ada materi di modul ini</h3>
                                <p className="mx-auto mt-2 max-w-md text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Tambahkan teks, video, atau dokumen dari tombol tambah di samping. Jika disimpan dalam kondisi kosong, semua materi lama akan dihapus.
                                </p>
                            </div>
                        )}

                        {data.lessons.map((lesson, idx) => (
                            <div key={lesson._clientKey} onClick={() => setActiveBlockId(idx)} className={`bg-white dark:bg-gray-900 rounded-2xl transition-all duration-200 ${activeBlockId === idx ? 'shadow-lg border-l-4 border-l-[#E64A19] ring-2 ring-orange-500/10' : 'shadow-sm border border-gray-200 dark:border-gray-700'}`}>
                                <div className="p-5 sm:p-6 lg:p-8">
                                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded">Blok {idx + 1}</span>
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${lesson.type === 'text' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : lesson.type === 'video_yt' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'}`}>
                                                {lesson.type}
                                            </span>
                                            <select
                                                value={lesson.status || 'published'}
                                                onChange={(e) => updateBlock(idx, 'status', e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-[10px] font-black uppercase text-gray-600 focus:ring-[#E64A19] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                            >
                                                <option value="published">Published</option>
                                                <option value="draft">Draft</option>
                                            </select>
                                        </div>
                                    </div>
                                    <input type="text" value={lesson.title} onChange={(e) => updateBlock(idx, 'title', e.target.value)} className="w-full bg-transparent text-lg font-black text-gray-900 dark:text-white border-none p-0 mb-6 focus:ring-0 placeholder-gray-300 dark:placeholder-gray-600" placeholder="Judul blok..." />
                                    {activeBlockId === idx && ['text', 'file'].includes(lesson.type) && (
                                        <div className="mb-4 flex flex-wrap gap-2 rounded-2xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950/40">
                                            <span className="mr-1 self-center text-[10px] font-black uppercase tracking-widest text-gray-400">Quick block</span>
                                            {quickBlocks.map((block) => (
                                                <button
                                                    key={block.label}
                                                    type="button"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        insertQuickBlock(block.html);
                                                    }}
                                                    className="rounded-xl bg-white px-3 py-2 text-[11px] font-black text-gray-600 shadow-sm transition-colors hover:text-[#E64A19] dark:bg-gray-900 dark:text-gray-300"
                                                >
                                                    {block.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    
                                    {lesson.type === 'text' && (
                                        activeBlockId === idx ? (
                                            <Suspense fallback={<div className="h-48 bg-gray-50 dark:bg-gray-800/50 rounded-xl animate-pulse" />}>
                                                <QuillEditor
                                                    key={`text-editor-${lesson._clientKey}`}
                                                    value={lesson.content}
                                                    onChange={(val) => updateBlock(idx, 'content', val)}
                                                    uploadImageUrl={route('admin.upload')}
                                                    editorMinHeight="280px"
                                                />
                                            </Suspense>
                                        ) : (
                                            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-950/40">
                                                <div
                                                    className="prose prose-sm max-w-none text-gray-600 line-clamp-6 dark:prose-invert dark:text-gray-300"
                                                    dangerouslySetInnerHTML={{ __html: lesson.content || '<p class="text-gray-400 italic">Klik blok untuk mengedit konten...</p>' }}
                                                />
                                            </div>
                                        )
                                    )}
                                    {lesson.type === 'video_yt' && (
                                        <input type="text" value={lesson.video_url || ''} onChange={(e) => updateBlock(idx, 'video_url', e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-transparent rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600" placeholder="Paste link YouTube..." />
                                    )}
                                    {lesson.type === 'file' && (
                                        <div className="space-y-4">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center gap-3">
                                                    <label className="flex-1">
                                                        <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-[#E64A19] hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all group">
                                                            <PictureAsPdfOutlinedIcon className="text-gray-400 dark:text-gray-500 group-hover:text-[#E64A19]" />
                                                            <span className="text-sm font-bold text-gray-500 dark:text-gray-400 group-hover:text-[#E64A19]">
                                                                {lesson.file_uploaded ? lesson.file_uploaded.name : (lesson.file_url ? 'Ganti File' : 'Pilih File PDF/DOC/PPT')}
                                                            </span>
                                                            <input 
                                                                type="file" 
                                                                className="hidden" 
                                                                accept=".pdf,.doc,.docx,.ppt,.pptx"
                                                                onChange={(e) => {
                                                                    handleDocumentImport(idx, e.target.files[0]);
                                                                    e.target.value = '';
                                                                }}
                                                            />
                                                        </div>
                                                    </label>
                                                </div>
                                                {importingDocumentIndex === idx && (
                                                    <p className="text-xs font-bold text-orange-600 dark:text-orange-300">Mengimport dokumen...</p>
                                                )}
                                                
                                                {(lesson.file_url || lesson.file_uploaded) && (
                                                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-900/40 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <PictureAsPdfOutlinedIcon className="text-green-600" sx={{fontSize: 20}} />
                                                            <span className="max-w-[160px] truncate text-xs font-bold text-green-700 dark:text-green-400 sm:max-w-[200px]">
                                                                {lesson.file_uploaded ? lesson.file_uploaded.name : (lesson.file_name || lesson.file_url.split('/').pop())}
                                                            </span>
                                                        </div>
                                                        <button 
                                                            type="button"
                                                            onClick={() => clearDocumentFile(idx)}
                                                            className="text-[10px] font-black text-red-600 dark:text-red-400 hover:underline px-2 py-1"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </div>
                                                )}
                                                {(lesson.file_url || lesson.file_uploaded) && (
                                                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-950/40">
                                                        <LessonArticle
                                                            key={`file-preview-${lesson._clientKey}-${lesson.file_url || lesson.file_preview_url || ''}`}
                                                            lesson={lesson}
                                                            moduleTitle={module.title}
                                                            previewMode
                                                        />
                                                    </div>
                                                )}
                                                <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                                                    <div className="mb-3">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Konten Artikel / Hasil Import DOCX/PPTX</p>
                                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Gunakan area ini untuk merapikan hasil import Word/PowerPoint atau menambahkan catatan sebelum dokumen.</p>
                                                    </div>
                                                    {activeBlockId === idx ? (
                                                        <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-gray-50 dark:bg-gray-800/50" />}>
                                                            <QuillEditor
                                                                key={`file-editor-${lesson._clientKey}`}
                                                                value={lesson.content}
                                                                onChange={(val) => updateBlock(idx, 'content', val)}
                                                                uploadImageUrl={route('admin.upload')}
                                                                editorMinHeight="180px"
                                                            />
                                                        </Suspense>
                                                    ) : (
                                                        <div
                                                            className="prose prose-sm max-w-none rounded-xl bg-gray-50 p-4 text-gray-600 line-clamp-5 dark:prose-invert dark:bg-gray-950/40 dark:text-gray-300"
                                                            dangerouslySetInnerHTML={{ __html: lesson.content || '<p class="text-gray-400 italic">Klik blok untuk mengedit hasil import...</p>' }}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {activeBlockId === idx && (
                                    <div className="flex justify-end gap-3 rounded-b-2xl border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 px-4 py-3 sm:px-6">
                                        <button onClick={(e) => { e.stopPropagation(); duplicateBlock(idx); }} className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:text-white"><ContentCopyIcon sx={{ fontSize: 18 }} /></button>
                                        <button onClick={(e) => { e.stopPropagation(); removeBlock(idx); }} className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:text-red-400"><DeleteOutlineIcon sx={{ fontSize: 20 }} /></button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="fixed bottom-4 left-1/2 z-50 w-auto -translate-x-1/2 lg:static lg:w-14 lg:translate-x-0 lg:self-start lg:sticky lg:top-24 lg:ml-6">
                          <div className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-3 shadow-xl lg:flex-col lg:px-0 lg:py-4">
                             <button onClick={() => addBlock('text')} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"><ControlPointIcon /></button>
                             <button onClick={() => addBlock('video_yt')} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"><PlayCircleOutlineIcon /></button>
                             <button onClick={() => addBlock('file')} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400"><PictureAsPdfOutlinedIcon /></button>
                          </div>
                    </div>
                </main>

                {/* Modal Preview */}
                <StudentPreviewModal 
                    show={showPreview}
                    onClose={() => setShowPreview(false)}
                    lessons={data.lessons}
                    moduleTitle={module.title}
                />
                {showTemplatePanel && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-4xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-900">
                            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-600">Lesson Templates</p>
                                    <h2 className="text-xl font-black text-gray-900 dark:text-white">Pilih Template Materi</h2>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Template akan ditambahkan sebagai draft lesson baru dan bisa diedit sebelum publish.</p>
                                </div>
                                <button type="button" onClick={() => setShowTemplatePanel(false)} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-black text-gray-600 dark:border-gray-700 dark:text-gray-300">Tutup</button>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {lessonTemplates.map((template) => (
                                    <button
                                        key={template.id}
                                        type="button"
                                        onClick={() => addTemplateLesson(template)}
                                        className="rounded-2xl border border-gray-100 bg-gray-50 p-5 text-left transition-all hover:border-blue-200 hover:bg-blue-50 dark:border-gray-800 dark:bg-gray-950/40 dark:hover:border-blue-900/40 dark:hover:bg-blue-900/10"
                                    >
                                        <p className="text-sm font-black text-gray-900 dark:text-white">{template.label}</p>
                                        <p className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400">{template.title}</p>
                                        <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-300">{template.duration_minutes} menit · Draft</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {showBulkImport && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm">
                        <form onSubmit={handleBulkImportLessons} className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-900">
                            <div className="mb-5">
                                <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-600">Bulk Import</p>
                                <h2 className="text-xl font-black text-gray-900 dark:text-white">Import Banyak Materi</h2>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Gunakan template resmi. Semua materi hasil import akan masuk sebagai draft jika status kosong/invalid.</p>
                            </div>
                            <div className="mb-4 flex flex-wrap gap-2">
                                <a href={route('admin.modules.lessons.template', [module.id, 'csv'])} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-black text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Download CSV</a>
                                <a href={route('admin.modules.lessons.template', [module.id, 'xlsx'])} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-black text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Download Excel</a>
                            </div>
                            <label className="block rounded-2xl border-2 border-dashed border-gray-200 p-5 dark:border-gray-700">
                                <span className="block text-sm font-black text-gray-900 dark:text-white">Upload CSV/XLSX</span>
                                <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">Kolom minimal wajib: lesson_title. Kolom content boleh HTML atau teks biasa.</span>
                                <input
                                    type="file"
                                    accept=".csv,.txt,.xlsx"
                                    onChange={(event) => bulkImportForm.setData('import_file', event.target.files[0] || null)}
                                    className="mt-4 block w-full text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-50 file:px-4 file:py-3 file:text-sm file:font-black file:text-emerald-700"
                                />
                            </label>
                            {bulkImportForm.errors.lesson_import && <p className="mt-3 text-sm font-bold text-red-600">{bulkImportForm.errors.lesson_import}</p>}
                            {bulkImportForm.errors.import_file && <p className="mt-3 text-sm font-bold text-red-600">{bulkImportForm.errors.import_file}</p>}
                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowBulkImport(false)} className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-black text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Batal</button>
                                <button disabled={bulkImportForm.processing || !bulkImportForm.data.import_file} className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-black text-white disabled:opacity-50">{bulkImportForm.processing ? 'Import...' : 'Import Materi'}</button>
                            </div>
                        </form>
                    </div>
                )}
                {showKanjiImport && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm">
                        <form onSubmit={handleImportKanjiLessons} className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-900">
                            <div className="mb-5">
                                <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-600">Kanji Bank</p>
                                <h2 className="text-xl font-black text-gray-900 dark:text-white">Import Kanji ke Materi</h2>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Lesson baru akan ditambahkan sebagai draft di akhir modul ini.</p>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <label className="space-y-1">
                                    <span className="text-xs font-black text-gray-500 dark:text-gray-400">JLPT</span>
                                    <select value={kanjiForm.data.jlpt_level} onChange={(e) => kanjiForm.setData('jlpt_level', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white">
                                        <option value="N5">N5</option>
                                        <option value="N4">N4</option>
                                        <option value="N3">N3</option>
                                    </select>
                                </label>
                                <label className="space-y-1">
                                    <span className="text-xs font-black text-gray-500 dark:text-gray-400">Jumlah</span>
                                    <input type="number" min="1" max="50" value={kanjiForm.data.count} onChange={(e) => kanjiForm.setData('count', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" />
                                </label>
                                <label className="space-y-1 sm:col-span-2">
                                    <span className="text-xs font-black text-gray-500 dark:text-gray-400">Sumber Data</span>
                                    <select value={kanjiForm.data.status} onChange={(e) => kanjiForm.setData('status', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white">
                                        <option value="published">Published saja</option>
                                        <option value="draft">Draft saja</option>
                                        <option value="all">Semua status</option>
                                    </select>
                                </label>
                            </div>
                            {kanjiForm.errors.kanji_import && <p className="mt-3 text-sm font-bold text-red-600">{kanjiForm.errors.kanji_import}</p>}
                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowKanjiImport(false)} className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-black text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Batal</button>
                                <button disabled={kanjiForm.processing} className="rounded-xl bg-[#E64A19] px-6 py-3 text-sm font-black text-white disabled:opacity-50">{kanjiForm.processing ? 'Import...' : 'Import'}</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
