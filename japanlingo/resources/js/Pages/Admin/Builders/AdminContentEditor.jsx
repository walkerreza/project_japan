import React, { useState, lazy, Suspense } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// MUI Icons
import TitleIcon from '@mui/icons-material/Title';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StudentPreviewModal from '@/Components/StudentPreviewModal';

const QuillEditor = lazy(() => import('@/Components/Editor/QuillEditor'));

export default function ContentEditor({ module, lessons: initialLessons = [] }) {
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        lessons: initialLessons.length > 0 ? initialLessons : [
            { id: null, type: 'text', title: 'Pelajaran Baru', content: '', video_url: '', file_url: '', order: 0, status: 'published' }
        ],
    });

    const [activeBlockId, setActiveBlockId] = useState(0);
    const [showPreview, setShowPreview] = useState(false);

    const updateBlock = (index, field, value) => {
        const newLessons = [...data.lessons];
        newLessons[index][field] = value;
        setData('lessons', newLessons);
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
        };
        setData('lessons', [...data.lessons, newBlock]);
        setActiveBlockId(data.lessons.length);
    };

    const removeBlock = (index) => {
        if (data.lessons.length <= 1) return;
        const newLessons = data.lessons.filter((_, i) => i !== index);
        setData('lessons', newLessons);
    };

    const duplicateBlock = (index) => {
        const blockToCopy = data.lessons[index];
        const newBlock = { ...blockToCopy, id: null, order: data.lessons.length };
        setData('lessons', [...data.lessons, newBlock]);
    };

    const handleSave = () => {
        post(route('admin.modules.builder.update', module.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Builder: ${module.title} - Japanlingo`} />
            <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">
                <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 lg:h-16 lg:px-6 lg:py-0">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                        <Link href={route('admin.modules.index')} className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:text-white transition-colors">
                            <ArrowBackIcon sx={{ fontSize: 18 }} />
                        </Link>
                        <div className="h-6 w-px bg-gray-200"></div>
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
                            onClick={() => setShowPreview(true)} 
                            className="px-4 h-9 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800 transition-colors flex items-center gap-2"
                        >
                            <VisibilityIcon sx={{ fontSize: 18 }} /> Preview
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

                        {data.lessons.map((lesson, idx) => (
                            <div key={idx} onClick={() => setActiveBlockId(idx)} className={`bg-white dark:bg-gray-900 rounded-2xl transition-all duration-200 ${activeBlockId === idx ? 'shadow-lg border-l-4 border-l-[#E64A19] ring-2 ring-orange-500/10' : 'shadow-sm border border-gray-200 dark:border-gray-700'}`}>
                                <div className="p-5 sm:p-6 lg:p-8">
                                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded">Blok {idx + 1}</span>
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${lesson.type === 'text' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : lesson.type === 'video_yt' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-600'}`}>
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
                                    <input type="text" value={lesson.title} onChange={(e) => updateBlock(idx, 'title', e.target.value)} className="w-full text-lg font-black text-gray-900 dark:text-white border-none p-0 mb-6 focus:ring-0 placeholder-gray-300" placeholder="Judul blok..." />
                                    
                                    {lesson.type === 'text' && (
                                        <Suspense fallback={<div className="h-48 bg-gray-50 dark:bg-gray-800/50 rounded-xl animate-pulse" />}>
                                            <QuillEditor value={lesson.content} onChange={(val) => updateBlock(idx, 'content', val)} />
                                        </Suspense>
                                    )}
                                    {lesson.type === 'video_yt' && (
                                        <input type="text" value={lesson.video_url || ''} onChange={(e) => updateBlock(idx, 'video_url', e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-transparent rounded-xl text-sm" placeholder="Paste link YouTube..." />
                                    )}
                                    {lesson.type === 'file' && (
                                        <div className="space-y-4">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center gap-3">
                                                    <label className="flex-1">
                                                        <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-[#E64A19] hover:bg-orange-50 transition-all group">
                                                            <PictureAsPdfOutlinedIcon className="text-gray-400 dark:text-gray-500 group-hover:text-[#E64A19]" />
                                                            <span className="text-sm font-bold text-gray-500 dark:text-gray-400 group-hover:text-[#E64A19]">
                                                                {lesson.file_uploaded ? lesson.file_uploaded.name : (lesson.file_url ? 'Ganti File' : 'Pilih File PDF/DOC')}
                                                            </span>
                                                            <input 
                                                                type="file" 
                                                                className="hidden" 
                                                                accept=".pdf,.doc,.docx"
                                                                onChange={(e) => updateBlock(idx, 'file_uploaded', e.target.files[0])}
                                                            />
                                                        </div>
                                                    </label>
                                                </div>
                                                
                                                {(lesson.file_url || lesson.file_uploaded) && (
                                                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <PictureAsPdfOutlinedIcon className="text-green-600" sx={{fontSize: 20}} />
                                                            <span className="max-w-[160px] truncate text-xs font-bold text-green-700 dark:text-green-400 sm:max-w-[200px]">
                                                                {lesson.file_uploaded ? lesson.file_uploaded.name : lesson.file_url.split('/').pop()}
                                                            </span>
                                                        </div>
                                                        <button 
                                                            type="button"
                                                            onClick={() => {
                                                                updateBlock(idx, 'file_url', null);
                                                                updateBlock(idx, 'file_uploaded', null);
                                                            }}
                                                            className="text-[10px] font-black text-red-600 dark:text-red-400 hover:underline px-2 py-1"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </div>
                                                )}
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
                             <button onClick={() => addBlock('file')} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-green-50 dark:bg-green-900/20 text-green-600"><PictureAsPdfOutlinedIcon /></button>
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
            </div>
        </AuthenticatedLayout>
    );
}
