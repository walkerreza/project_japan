import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';

const weekActivity = [
    { day: 'Sen', xp: 120, height: '40%' },
    { day: 'Sel', xp: 200, height: '65%' },
    { day: 'Rab', xp: 80, height: '25%' },
    { day: 'Kam', xp: 320, height: '100%' },
    { day: 'Jum', xp: 240, height: '75%' },
    { day: 'Sab', xp: 180, height: '55%' },
    { day: 'Min', xp: 0, height: '0%', today: true },
];

const skills = [
    { label: 'Grammar', value: 72, color: 'bg-red-500' },
    { label: 'Kanji', value: 55, color: 'bg-blue-500' },
    { label: 'Vocabulary', value: 83, color: 'bg-green-500' },
    { label: 'Listening', value: 40, color: 'bg-amber-500' },
    { label: 'Reading', value: 65, color: 'bg-purple-500' },
];

const recentActivity = [
    { icon: <AutoStoriesIcon sx={{ fontSize: 18 }} />, text: 'Completed Lesson: Conditional Forms ~Tara', xp: '+50 XP', time: '2 jam lalu', color: 'bg-blue-50 text-blue-500' },
    { icon: <HelpCenterIcon sx={{ fontSize: 18 }} />, text: 'Quiz: Kanji Level 2 — Skor 90%', xp: '+30 XP', time: '5 jam lalu', color: 'bg-green-50 text-green-500' },
    { icon: <LocalFireDepartmentIcon sx={{ fontSize: 18 }} />, text: '12-Day Streak Milestone!', xp: '+100 XP', time: '1 hari lalu', color: 'bg-amber-50 text-amber-500' },
    { icon: <CheckCircleIcon sx={{ fontSize: 18 }} />, text: 'Module N5 — Semua bab selesai', xp: '+200 XP', time: '3 hari lalu', color: 'bg-purple-50 text-purple-500' },
];

export default function Progress() {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><ShowChartIcon className="text-blue-500" /> My Progress</h2>}>
            <Head title="Progress - Japanlingo" />

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                {[
                    { label: 'Total XP', value: '12,450', icon: <EmojiEventsIcon />, color: 'text-amber-500', bg: 'bg-amber-50' },
                    { label: 'Day Streak', value: '12', icon: <LocalFireDepartmentIcon />, color: 'text-red-500', bg: 'bg-red-50' },
                    { label: 'Lessons Done', value: '24', icon: <AutoStoriesIcon />, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { label: 'Quizzes', value: '18', icon: <HelpCenterIcon />, color: 'text-green-500', bg: 'bg-green-50' },
                ].map((s, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 min-w-0">
                        <div className={`w-11 h-11 rounded-full ${s.bg} ${s.color} flex items-center justify-center shrink-0`}>{s.icon}</div>
                        <div className="min-w-0">
                            <p className="text-xl font-black text-gray-900 leading-none">{s.value}</p>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mt-0.5">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">

                {/* Left Col: Charts & Skills */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Weekly Activity Bar Chart */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                            <h3 className="font-black text-gray-900">Weekly Activity</h3>
                            <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg">Total: 1,140 XP</span>
                        </div>
                        <div className="flex items-end gap-1 sm:gap-2 h-40">
                            {weekActivity.map((d, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <p className="text-xs font-bold text-gray-400">{d.xp > 0 ? d.xp : ''}</p>
                                    <div className="w-full bg-gray-100 rounded-xl overflow-hidden" style={{ height: '120px' }}>
                                        <div
                                            className={`w-full rounded-xl transition-all duration-700 ${d.today ? 'bg-gray-200' : 'bg-red-600'}`}
                                            style={{ height: d.height, marginTop: `calc(100% - ${d.height})`, minHeight: d.xp > 0 ? '8px' : '0' }}
                                        ></div>
                                    </div>
                                    <p className={`text-[10px] font-bold uppercase ${d.today ? 'text-red-500' : 'text-gray-400'}`}>{d.day}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skill Breakdown */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                        <h3 className="font-black text-gray-900 mb-6">Skill Breakdown</h3>
                        <div className="space-y-4">
                            {skills.map((s, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm font-bold text-gray-900 mb-1.5">
                                        <span>{s.label}</span>
                                        <span className="text-gray-500">{s.value}%</span>
                                    </div>
                                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${s.color} rounded-full transition-all duration-700`} style={{ width: `${s.value}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Col: JLPT Progress + Activity */}
                <div className="space-y-6">

                    {/* JLPT Progress */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                        <h3 className="font-black text-gray-900 mb-5">JLPT Journey</h3>
                        <div className="space-y-4">
                            {[
                                { level: 'N5', pct: 100, done: true },
                                { level: 'N4', pct: 100, done: true },
                                { level: 'N3', pct: 45, done: false },
                                { level: 'N2', pct: 0, done: false },
                                { level: 'N1', pct: 0, done: false },
                            ].map((l, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <span className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${l.done ? 'bg-green-100 text-green-600' : l.pct > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}>
                                        {l.done ? '✓' : l.level}
                                    </span>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between gap-3 text-xs font-bold mb-1">
                                            <span className={l.done ? 'text-green-600' : l.pct > 0 ? 'text-red-600' : 'text-gray-400'}>JLPT {l.level}</span>
                                            <span className="text-gray-400">{l.pct}%</span>
                                        </div>
                                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${l.done ? 'bg-green-500' : 'bg-red-600'}`} style={{ width: `${l.pct}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                        <h3 className="font-black text-gray-900 mb-5">Recent Activity</h3>
                        <div className="space-y-4">
                            {recentActivity.map((a, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className={`w-9 h-9 rounded-xl ${a.color} flex items-center justify-center shrink-0`}>{a.icon}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-gray-900 leading-snug">{a.text}</p>
                                        <div className="flex items-center justify-between mt-0.5">
                                            <p className="text-[10px] text-gray-400">{a.time}</p>
                                            <span className="text-[10px] font-black text-green-600">{a.xp}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
