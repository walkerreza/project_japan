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
            { id: null, type: 'text', title: 'Pelajaran Baru', content: '', video_url: '', file_url: '', order: 0 }
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
                <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <Link href={route('admin.modules.index')} className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">
                            <ArrowBackIcon sx={{ fontSize: 18 }} />
                        </Link>
                        <div className="h-6 w-px bg-gray-200"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#E64A19] rounded-lg flex items-center justify-center text-white font-bold text-xs">
                                {module.level?.level_name?.charAt(0) || 'M'}
                            </div>
                            <div>
                                <h1 className="text-sm font-black text-gray-900 leading-none tracking-tight">Content Builder</h1>
                                <p className="text-[11px] text-gray-400 mt-0.5 font-medium">{module.title}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {recentlySuccessful && <span className="text-xs font-bold text-green-600 animate-pulse">Tersimpan!</span>}
                        <button 
                            type="button"
                            onClick={() => setShowPreview(true)} 
                            className="px-4 h-9 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2"
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
                </header>

                <main className="flex-1 flex justify-center p-8 relative">
                    <div className="w-full max-w-[760px] space-y-6 pb-32">
                        <div className="bg-white rounded-[20px] shadow-sm border border-gray-200 border-t-8 border-t-[#E64A19] p-8">
                             <h2 className="text-3xl font-black text-gray-900 mb-2">{module.title}</h2>
                             <p className="text-sm font-medium text-gray-500">{module.description || 'Tidak ada deskripsi'}</p>
                        </div>

                        {data.lessons.map((lesson, idx) => (
                            <div key={idx} onClick={() => setActiveBlockId(idx)} className={`bg-white rounded-2xl transition-all duration-200 ${activeBlockId === idx ? 'shadow-lg border-l-4 border-l-[#E64A19] ring-2 ring-orange-500/10' : 'shadow-sm border border-gray-200'}`}>
                                <div className="p-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">Blok {idx + 1}</span>
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${lesson.type === 'text' ? 'bg-blue-50 text-blue-600' : lesson.type === 'video_yt' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                                {lesson.type}
                                            </span>
                                        </div>
                                    </div>
                                    <input type="text" value={lesson.title} onChange={(e) => updateBlock(idx, 'title', e.target.value)} className="w-full text-lg font-black text-gray-900 border-none p-0 mb-6 focus:ring-0 placeholder-gray-300" placeholder="Judul blok..." />
                                    
                                    {lesson.type === 'text' && (
                                        <Suspense fallback={<div className="h-48 bg-gray-50 rounded-xl animate-pulse" />}>
                                            <QuillEditor value={lesson.content} onChange={(val) => updateBlock(idx, 'content', val)} />
                                        </Suspense>
                                    )}
                                    {lesson.type === 'video_yt' && (
                                        <input type="text" value={lesson.video_url || ''} onChange={(e) => updateBlock(idx, 'video_url', e.target.value)} className="w-full p-3 bg-gray-50 border border-transparent rounded-xl text-sm" placeholder="Paste link YouTube..." />
                                    )}
                                    {lesson.type === 'file' && (
                                        <div className="space-y-4">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center gap-3">
                                                    <label className="flex-1">
                                                        <div className="flex items-center gap-2 p-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#E64A19] hover:bg-orange-50 transition-all group">
                                                            <PictureAsPdfOutlinedIcon className="text-gray-400 group-hover:text-[#E64A19]" />
                                                            <span className="text-sm font-bold text-gray-500 group-hover:text-[#E64A19]">
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
                                                    <div className="p-3 bg-green-50 rounded-xl border border-green-100 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <PictureAsPdfOutlinedIcon className="text-green-600" sx={{fontSize: 20}} />
                                                            <span className="text-xs font-bold text-green-700 truncate max-w-[200px]">
                                                                {lesson.file_uploaded ? lesson.file_uploaded.name : lesson.file_url.split('/').pop()}
                                                            </span>
                                                        </div>
                                                        <button 
                                                            type="button"
                                                            onClick={() => {
                                                                updateBlock(idx, 'file_url', null);
                                                                updateBlock(idx, 'file_uploaded', null);
                                                            }}
                                                            className="text-[10px] font-black text-red-600 hover:underline px-2 py-1"
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
                                    <div className="border-t border-gray-100 px-6 py-3 flex justify-end gap-3 bg-gray-50/50 rounded-b-2xl">
                                        <button onClick={(e) => { e.stopPropagation(); duplicateBlock(idx); }} className="p-2 text-gray-400 hover:text-gray-900"><ContentCopyIcon sx={{ fontSize: 18 }} /></button>
                                        <button onClick={(e) => { e.stopPropagation(); removeBlock(idx); }} className="p-2 text-gray-400 hover:text-red-600"><DeleteOutlineIcon sx={{ fontSize: 20 }} /></button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="fixed bottom-10 right-10 lg:sticky lg:top-24 lg:ml-6 w-14 z-50">
                          <div className="bg-white border border-gray-200 shadow-xl rounded-full flex flex-col items-center py-4 gap-2">
                             <button onClick={() => addBlock('text')} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-50 text-blue-600"><ControlPointIcon /></button>
                             <button onClick={() => addBlock('video_yt')} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-50 text-red-600"><PlayCircleOutlineIcon /></button>
                             <button onClick={() => addBlock('file')} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-green-50 text-green-600"><PictureAsPdfOutlinedIcon /></button>
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
