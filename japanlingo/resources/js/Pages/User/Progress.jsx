import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';

// Data statis dihapus, menggunakan props dari backend.

export default function Progress({ stats = {}, weekActivity = [], jlptJourney = [], recentActivity = [], skills = [] }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><ShowChartIcon className="text-blue-500" /> My Progress</h2>}>
            <Head title="Progress - Japanlingo" />

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                {[
                    { label: 'Total XP', value: stats.xp || '0', icon: <EmojiEventsIcon />, color: 'text-amber-500', bg: 'bg-amber-50' },
                    { label: 'Day Streak', value: stats.streak || '0', icon: <LocalFireDepartmentIcon />, color: 'text-red-500', bg: 'bg-red-50' },
                    { label: 'Lessons Done', value: stats.lessonsDone || '0', icon: <AutoStoriesIcon />, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { label: 'Quizzes', value: stats.quizzesDone || '0', icon: <HelpCenterIcon />, color: 'text-green-500', bg: 'bg-green-50' },
                ].map((s, i) => (
                    <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 min-w-0 transition-colors">
                        <div className={`w-11 h-11 rounded-full ${s.bg} dark:bg-opacity-10 ${s.color} flex items-center justify-center shrink-0`}>{s.icon}</div>
                        <div className="min-w-0">
                            <p className="text-xl font-black text-gray-900 dark:text-white leading-none">{s.value}</p>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mt-0.5">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">

                {/* Left Col: Charts & Skills */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Weekly Activity Bar Chart */}
                    <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                            <h3 className="font-black text-gray-900 dark:text-white">Weekly Activity</h3>
                            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg">Total: {weekActivity.reduce((acc, curr) => acc + curr.xp, 0)} XP</span>
                        </div>
                        <div className="flex items-end gap-1 sm:gap-2 h-40">
                            {weekActivity.map((d, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500">{d.xp > 0 ? d.xp : ''}</p>
                                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden" style={{ height: '120px' }}>
                                        <div
                                            className={`w-full rounded-xl transition-all duration-700 ${d.today ? 'bg-gray-200 dark:bg-gray-700' : 'bg-red-600 dark:bg-red-500'}`}
                                            style={{ height: d.height, marginTop: `calc(100% - ${d.height})`, minHeight: d.xp > 0 ? '8px' : '0' }}
                                        ></div>
                                    </div>
                                    <p className={`text-[10px] font-bold uppercase ${d.today ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}>{d.day}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skill Breakdown */}
                    <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                        <h3 className="font-black text-gray-900 dark:text-white mb-6">Skill Breakdown</h3>
                        <div className="space-y-4">
                            {skills.map((s, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm font-bold text-gray-900 dark:text-gray-200 mb-1.5">
                                        <span>{s.label}</span>
                                        <span className="text-gray-500 dark:text-gray-400">{s.value}%</span>
                                    </div>
                                    <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
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
                    <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                        <h3 className="font-black text-gray-900 dark:text-white mb-5">JLPT Journey</h3>
                        <div className="space-y-4">
                            {jlptJourney.map((l, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <span className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${l.done ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : l.pct > 0 ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'}`}>
                                        {l.done ? '✓' : l.level}
                                    </span>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between gap-3 text-xs font-bold mb-1">
                                            <span className={l.done ? 'text-green-600 dark:text-green-400' : l.pct > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400 dark:text-gray-500'}>JLPT {l.level}</span>
                                            <span className="text-gray-400 dark:text-gray-500">{l.pct}%</span>
                                        </div>
                                        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${l.done ? 'bg-green-500' : 'bg-red-600 dark:bg-red-500'}`} style={{ width: `${l.pct}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                        <h3 className="font-black text-gray-900 dark:text-white mb-5">Recent Activity</h3>
                        <div className="space-y-4">
                            {recentActivity.length > 0 ? recentActivity.map((a, i) => {
                                const icon = a.type === 'lesson' ? <AutoStoriesIcon sx={{ fontSize: 18 }} /> :
                                            a.type === 'quiz' ? <HelpCenterIcon sx={{ fontSize: 18 }} /> :
                                            <LocalFireDepartmentIcon sx={{ fontSize: 18 }} />;
                                const color = a.type === 'lesson' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-500' :
                                            a.type === 'quiz' ? 'bg-green-50 dark:bg-green-900/30 text-green-500' :
                                            'bg-amber-50 dark:bg-amber-900/30 text-amber-500';
                                
                                return (
                                <div key={i} className="flex items-start gap-3">
                                    <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center shrink-0`}>{icon}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-gray-900 dark:text-white leading-snug line-clamp-2">{a.text}</p>
                                        <div className="flex items-center justify-between mt-0.5">
                                            <p className="text-[10px] text-gray-400 dark:text-gray-500">{a.time}</p>
                                            <span className="text-[10px] font-black text-green-600 dark:text-green-400">{a.xp}</span>
                                        </div>
                                    </div>
                                </div>
                            )}) : (
                                <p className="text-xs text-gray-400 dark:text-gray-500">Belum ada aktivitas.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
