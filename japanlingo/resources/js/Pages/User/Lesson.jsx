import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// MUI Icons
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import StarIcon from '@mui/icons-material/Star';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

export default function Lesson({ lesson, lessons = [], is_completed }) {
    const { auth } = usePage().props;

    // Dapatkan index lesson aktif untuk navigasi prev/next
    const activeIndex = lessons.findIndex(l => l.is_active);
    const prevLesson  = activeIndex > 0 ? lessons[activeIndex - 1] : null;
    const nextLesson  = activeIndex < lessons.length - 1 ? lessons[activeIndex + 1] : null;

    // Hitung persentase progress modul
    const completedCount = lessons.filter(l => l.is_completed).length;
    const progressPct    = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

    const handleComplete = () => {
        router.post(route('user.lessons.complete'), {
            lesson_id: lesson.id,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link href={route('user.dashboard')} className="text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium">
                        ← Dashboard
                    </Link>
                    <span className="text-gray-300">/</span>
                    <span className="text-sm font-medium text-gray-500">{lesson.module?.title ?? 'Module'}</span>
                    <span className="text-gray-300">/</span>
                    <span className="text-sm font-bold text-gray-900">{lesson.title}</span>
                    <div className="ml-auto flex items-center gap-3">
                        <div className="bg-amber-50 px-3 h-8 rounded-full flex items-center gap-2 border border-amber-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            <span className="font-bold text-xs text-amber-600">{auth.user.streak_count ?? 0} Day Streak</span>
                        </div>
                        {is_completed && (
                            <div className="bg-green-50 text-green-600 border border-green-100 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                <CheckCircleIcon sx={{ fontSize: 12 }} />
                                Selesai
                            </div>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={`Lesson - ${lesson.title}`} />

            <div className="flex gap-6 items-start">

                {/* Sidebar: Daftar Lesson dalam Modul */}
                <aside className="w-[260px] shrink-0 hidden lg:block sticky top-20">
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Current Module</p>
                        <div className="flex justify-between items-end mb-3">
                            <h3 className="font-black text-gray-900 leading-tight text-sm">{lesson.module?.title ?? 'Module'}</h3>
                            <span className="text-red-600 font-black text-sm">{progressPct}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-red-600 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }}></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-4">Course Content</h4>
                        <div className="space-y-2 relative">
                            <div className="absolute left-4 top-8 bottom-8 w-px bg-gray-100"></div>
                            {lessons.map((l, i) => (
                                <div key={l.id}>
                                    {l.is_locked ? (
                                        <div className="rounded-xl p-3 flex items-start gap-3 opacity-50">
                                            <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-400 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                                                {String(l.order).padStart(2, '0')}
                                            </div>
                                            <div className="flex-1">
                                                <h5 className="font-bold text-gray-500 text-xs leading-tight">{l.title}</h5>
                                                <p className="text-[10px] text-gray-400 mt-0.5">{l.type} • {l.duration_minutes ?? '-'} min</p>
                                            </div>
                                            <LockIcon sx={{ fontSize: 12 }} className="text-gray-300 mt-1" />
                                        </div>
                                    ) : l.is_completed ? (
                                        <Link href={route('user.lessons.show', l.id)} className="rounded-xl p-3 flex items-start gap-3 hover:bg-gray-50 transition-colors no-underline">
                                            <div className="w-7 h-7 rounded-full bg-green-100 text-green-500 flex items-center justify-center shrink-0 mt-0.5">
                                                <CheckCircleIcon sx={{ fontSize: 16 }} />
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-gray-400 text-xs leading-tight line-through">{l.title}</h5>
                                                <p className="text-[10px] text-gray-400 mt-0.5">Completed</p>
                                            </div>
                                        </Link>
                                    ) : (
                                        <Link href={route('user.lessons.show', l.id)} className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-3 no-underline">
                                            <div className="w-7 h-7 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                                                {String(l.order).padStart(2, '0')}
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-gray-900 text-xs leading-tight">{l.title}</h5>
                                                <p className="text-[10px] text-red-500 font-bold mt-0.5">{l.type} • {l.duration_minutes ?? '-'} min</p>
                                            </div>
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Lesson Content */}
                <div className="flex-1 min-w-0">

                    {/* Video / Thumbnail */}
                    {lesson.video_url ? (
                        <div className="w-full aspect-video bg-gray-900 rounded-[2rem] overflow-hidden relative shadow-lg mb-8 group cursor-pointer border border-gray-100">
                            <iframe
                                src={lesson.video_url}
                                className="w-full h-full"
                                allowFullScreen
                                title={lesson.title}
                            />
                        </div>
                    ) : (
                        <div className="w-full aspect-video bg-gray-900 rounded-[2rem] overflow-hidden relative shadow-lg mb-8 group cursor-pointer border border-gray-100">
                            <img
                                src="https://images.unsplash.com/photo-1578269174936-2709b6aeb913?q=80&w=2671&auto=format&fit=crop"
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                alt={lesson.title}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 bg-red-600/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white shadow-2xl group-hover:scale-110 group-hover:bg-red-600 transition-all duration-300">
                                    <PlayCircleFilledIcon sx={{ fontSize: 48 }} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-3xl font-black text-gray-900 mb-2">{lesson.title}</h1>
                    {lesson.duration_minutes && (
                        <p className="text-gray-500 font-medium mb-8">Estimasi waktu: {lesson.duration_minutes} menit</p>
                    )}

                    {/* Lesson Content dari DB */}
                    {lesson.content ? (
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-6">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                                    <SchoolIcon />
                                </div>
                                <h3 className="text-xl font-black text-gray-900">Materi Pelajaran</h3>
                            </div>
                            <div
                                className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: lesson.content }}
                            />
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-6">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                                    <SchoolIcon />
                                </div>
                                <h3 className="text-xl font-black text-gray-900">Materi Pelajaran</h3>
                            </div>
                            <p className="text-gray-400 italic">Konten materi belum tersedia.</p>
                        </div>
                    )}

                    {/* Tombol Complete & Navigasi */}
                    <div className="flex items-center justify-between pb-8 gap-4 flex-wrap">
                        {prevLesson && !prevLesson.is_locked ? (
                            <Link href={route('user.lessons.show', prevLesson.id)} className="px-6 h-12 rounded-xl font-bold text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 transition-colors no-underline flex items-center">
                                ← Previous
                            </Link>
                        ) : <div />}

                        {!is_completed && (
                            <button
                                onClick={handleComplete}
                                className="px-8 h-12 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/30 transition-transform hover:scale-105"
                            >
                                ✓ Tandai Selesai
                            </button>
                        )}

                        {nextLesson && !nextLesson.is_locked ? (
                            <Link href={route('user.lessons.show', nextLesson.id)} className="px-8 h-12 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/30 transition-transform hover:scale-105 no-underline flex items-center">
                                Next Lesson →
                            </Link>
                        ) : (
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                {lessons.length > 0 ? `Lesson ${activeIndex + 1} of ${lessons.length}` : ''}
                            </span>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

