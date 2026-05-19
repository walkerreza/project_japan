import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import SchoolIcon from '@mui/icons-material/School';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';

export default function StudentPreviewModal({ show, onClose, lessons, moduleTitle }) {
    if (!show) return null;

    // Helper untuk YouTube Embed
    const getEmbedUrl = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 lg:p-8 animate-in fade-in duration-200">
            <div className="bg-[#F8F9FA] dark:bg-gray-950 w-full max-w-5xl h-full rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden relative border border-white/20 dark:border-gray-800 animate-in zoom-in-95 duration-300">
                
                {/* Header Preview */}
                <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-8 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-[10px] font-black uppercase tracking-widest rounded-full">
                            Student Preview Mode
                        </div>
                        <span className="text-gray-300 dark:text-gray-700">/</span>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[300px]">
                            {moduleTitle}
                        </h3>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <CloseIcon />
                    </button>
                </header>

                {/* Content Area (Simulasi Halaman Murid) */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-12">
                    <div className="max-w-3xl mx-auto space-y-12">
                        
                        {/* Judul & Deskripsi Modul */}
                        <div className="text-center">
                            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">{moduleTitle}</h1>
                            <p className="text-gray-500 dark:text-gray-400 font-medium italic">Anda sedang melihat simulasi materi sebagai murid.</p>
                        </div>

                        {/* Rendering Blok Pelajaran */}
                        {lessons.map((lesson, idx) => (
                            <section key={idx} className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-center text-red-600 dark:text-red-400 font-black text-lg">
                                        {String(idx + 1).padStart(2, '0')}
                                    </div>
                                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">{lesson.title}</h2>
                                </div>

                                {/* Konten Materi */}
                                <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                                    
                                    {/* Video Youtube */}
                                    {lesson.type === 'video_yt' && (
                                        <div className="aspect-video w-full bg-black relative">
                                            {getEmbedUrl(lesson.video_url) ? (
                                                <iframe 
                                                    className="w-full h-full"
                                                    src={getEmbedUrl(lesson.video_url)}
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-white gap-3 p-8 text-center">
                                                    <PlayCircleFilledIcon sx={{ fontSize: 64, opacity: 0.3 }} />
                                                    <p className="text-sm font-bold opacity-50">Silakan masukkan URL YouTube yang valid di editor</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Konten Teks */}
                                    {lesson.type === 'text' && (
                                        <div className="p-8 lg:p-10">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-300 flex items-center justify-center">
                                                    <SchoolIcon />
                                                </div>
                                                <h4 className="text-lg font-black text-gray-900 dark:text-white">Materi Pelajaran</h4>
                                            </div>
                                            <div 
                                                className="prose prose-red max-w-none prose-headings:font-black prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-strong:text-gray-900 font-medium dark:prose-invert dark:prose-headings:text-white dark:prose-p:text-gray-300 dark:prose-strong:text-white"
                                                dangerouslySetInnerHTML={{ __html: lesson.content || '<p class="text-gray-400 italic">Belum ada konten teks...</p>' }}
                                            />
                                        </div>
                                    )}

                                    {/* File PDF/DOC */}
                                    {lesson.type === 'file' && (
                                        <div className="p-8 lg:p-10 bg-gray-50/50 dark:bg-gray-950/40">
                                            <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl bg-white dark:bg-gray-900 group hover:border-green-400 dark:hover:border-green-600 transition-colors">
                                                <div className="w-16 h-16 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                                                    <PictureAsPdfOutlinedIcon sx={{ fontSize: 32 }} />
                                                </div>
                                                <h4 className="text-lg font-black text-gray-900 dark:text-white mb-2">Dokumen Pendukung</h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-xs">
                                                    Klik tombol di bawah untuk mengunduh materi dalam format PDF atau Word.
                                                </p>
                                                
                                                {(lesson.file_url || lesson.file_uploaded) ? (
                                                    <a 
                                                        href={lesson.file_uploaded ? URL.createObjectURL(lesson.file_uploaded) : `/storage/${lesson.file_url}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-8 h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-green-500/20 transition-all active:scale-95"
                                                    >
                                                        Unduh Materi
                                                    </a>
                                                ) : (
                                                    <button disabled className="px-8 h-12 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-xl font-bold cursor-not-allowed">
                                                        Belum ada file diunggah
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        ))}

                        {/* Footer Preview */}
                        <div className="text-center pb-20">
                            <button 
                                onClick={onClose}
                                className="px-8 h-12 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-bold transition-all shadow-xl shadow-gray-900/20 active:scale-95"
                            >
                                Tutup Preview & Kembali Edit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Gaya CSS Khusus untuk Iframe & Prose */}
            <style dangerouslySetInnerHTML={{__html:`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes zoom-in-95 { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                .animate-in { animation-fill-mode: forwards; }
                .fade-in { animation-name: fade-in; }
                .zoom-in-95 { animation-name: zoom-in-95; }
            `}} />
        </div>
    );
}
