import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// MUI Icons
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import StarIcon from '@mui/icons-material/Star';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

export default function Lesson() {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link href="/user/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium">
                        ← Dashboard
                    </Link>
                    <span className="text-gray-300">/</span>
                    <span className="text-sm font-medium text-gray-500">JLPT N3</span>
                    <span className="text-gray-300">/</span>
                    <span className="text-sm font-bold text-gray-900">Bab 1: Conditional Forms</span>
                    <div className="ml-auto flex items-center gap-3">
                        <div className="bg-amber-50 px-3 h-8 rounded-full flex items-center gap-2 border border-amber-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            <span className="font-bold text-xs text-amber-600">12 Day Streak</span>
                        </div>
                        <div className="bg-red-50 text-red-600 border border-red-100 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                            +50 XP
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Lesson - Conditional Forms" />

            <div className="flex gap-6 items-start">

                {/* Left: Course Content Sidebar */}
                <aside className="w-[260px] shrink-0 hidden lg:block sticky top-20">
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Current Module</p>
                        <div className="flex justify-between items-end mb-3">
                            <h3 className="font-black text-gray-900 leading-tight">JLPT N3 Grammar</h3>
                            <span className="text-red-600 font-black text-sm">38%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-red-600 rounded-full" style={{ width: '38%' }}></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-4">Course Content</h4>
                        <div className="space-y-2 relative">
                            <div className="absolute left-4 top-8 bottom-8 w-px bg-gray-100"></div>

                            {/* Active */}
                            <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">01</div>
                                <div>
                                    <h5 className="font-bold text-gray-900 text-xs leading-tight">Conditional Forms</h5>
                                    <p className="text-[10px] text-red-500 font-bold mt-0.5">Grammar • 30 min</p>
                                </div>
                            </div>

                            {/* Done */}
                            <div className="rounded-xl p-3 flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-green-100 text-green-500 flex items-center justify-center shrink-0 mt-0.5">
                                    <CheckCircleIcon sx={{ fontSize: 16 }} />
                                </div>
                                <div>
                                    <h5 className="font-bold text-gray-400 text-xs leading-tight line-through">Intro to N3</h5>
                                    <p className="text-[10px] text-gray-400 mt-0.5">Completed</p>
                                </div>
                            </div>

                            {/* Locked 1 */}
                            <div className="rounded-xl p-3 flex items-start gap-3 opacity-50">
                                <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-400 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">02</div>
                                <div className="flex-1">
                                    <h5 className="font-bold text-gray-500 text-xs leading-tight">Vocabulary Context</h5>
                                    <p className="text-[10px] text-gray-400 mt-0.5">Vocab • 20 min</p>
                                </div>
                                <LockIcon sx={{ fontSize: 12 }} className="text-gray-300 mt-1" />
                            </div>

                            {/* Locked 2 */}
                            <div className="rounded-xl p-3 flex items-start gap-3 opacity-50">
                                <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-400 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">03</div>
                                <div className="flex-1">
                                    <h5 className="font-bold text-gray-500 text-xs leading-tight">Kanji Practice</h5>
                                    <p className="text-[10px] text-gray-400 mt-0.5">Kanji • 25 min</p>
                                </div>
                                <LockIcon sx={{ fontSize: 12 }} className="text-gray-300 mt-1" />
                            </div>

                            {/* Recap */}
                            <div className="bg-purple-50/50 border border-purple-100 border-dashed rounded-xl p-3 flex items-start gap-3 opacity-60 mt-1">
                                <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center shrink-0 mt-0.5">
                                    <StarIcon sx={{ fontSize: 14 }} />
                                </div>
                                <div className="flex-1">
                                    <h5 className="font-bold text-purple-900 text-xs leading-tight">Weekly Recap</h5>
                                    <p className="text-[10px] text-purple-500 font-bold mt-0.5">Quiz • 100 XP</p>
                                </div>
                                <LockIcon sx={{ fontSize: 12 }} className="text-purple-300 mt-1" />
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Right: Main Lesson Content */}
                <div className="flex-1 min-w-0">

                    {/* Video Banner */}
                    <div className="w-full aspect-video bg-gray-900 rounded-[2rem] overflow-hidden relative shadow-lg mb-8 group cursor-pointer border border-gray-100">
                        <img
                            src="https://images.unsplash.com/photo-1578269174936-2709b6aeb913?q=80&w=2671&auto=format&fit=crop"
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                            alt="Classroom"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 bg-red-600/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white shadow-2xl group-hover:scale-110 group-hover:bg-red-600 transition-all duration-300">
                                <PlayCircleFilledIcon sx={{ fontSize: 48 }} />
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Conditional Forms: ~Tara</h1>
                    <p className="text-gray-500 font-medium mb-8">Mastering the art of "if" and "when" in Japanese conversations.</p>

                    {/* Grammar Section */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                                <SchoolIcon />
                            </div>
                            <h3 className="text-xl font-black text-gray-900">Grammar Explanation</h3>
                        </div>

                        <p className="text-gray-600 leading-relaxed font-medium mb-6">
                            The conditional form <strong>~tara (~たら)</strong> is one of the most versatile ways to say "if" or "when" in Japanese. Take the past tense plain form and add <strong>ra (ら)</strong>.
                        </p>

                        <div className="grid md:grid-cols-2 gap-5 mb-8">
                            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-3">Construction (Verbs)</h4>
                                <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
                                    <span className="font-bold text-gray-700 text-sm">Past Plain Form</span>
                                    <span className="text-gray-400">+</span>
                                    <span className="font-black text-gray-900 text-lg">ら (ra)</span>
                                </div>
                                <p className="text-xs text-gray-500">行く → 行った → <span className="font-bold text-red-600">行ったら</span></p>
                            </div>
                            <div className="bg-blue-50/40 rounded-2xl p-5 border border-blue-100">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Usage Tip</h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Use ~tara when the second clause happens <em>after</em> the first clause is completed.
                                </p>
                            </div>
                        </div>

                        <h3 className="text-lg font-black text-gray-900 mb-5">Example Sentences (Reibun)</h3>
                        <div className="space-y-4">
                            {[
                                { jp: '日本に行ったら、着物を買いたいです。', id: 'Kalau pergi ke Jepang, saya ingin membeli Kimono.' },
                                { jp: '雨が降ったら、行きません。', id: 'Kalau hujan turun, saya tidak akan pergi.' },
                                { jp: '安かったら、二つ買います。', id: 'Kalau murah, saya akan beli dua.' },
                            ].map((s, i) => (
                                <div key={i} className="border border-gray-100 hover:border-red-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-start gap-4 group cursor-pointer">
                                    <button className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors">
                                        <VolumeUpIcon sx={{ fontSize: 20 }} />
                                    </button>
                                    <div>
                                        <p className="text-xl font-medium text-gray-900 mb-1">{s.jp}</p>
                                        <p className="text-sm text-gray-500">{s.id}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Nav Buttons */}
                    <div className="flex items-center justify-between pb-8">
                        <button className="px-6 h-12 rounded-xl font-bold text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                            ← Previous
                        </button>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lesson 1 of 5</span>
                        <button className="px-8 h-12 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/30 transition-transform hover:scale-105">
                            Next Lesson →
                        </button>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
