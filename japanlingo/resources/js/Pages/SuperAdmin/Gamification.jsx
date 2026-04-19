import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Card from '@/Components/UI/Card';
import StatCard from '@/Components/Dashboard/StatCard';

const stats = [
    { title: 'XP Terdistribusi', value: '48,220', icon: '⚡', change: '11%', changeType: 'up' },
    { title: 'Achievement Unlock', value: '1,284', icon: '🏆', change: '7%', changeType: 'up' },
    { title: 'Rata-rata Streak', value: '5.8', icon: '🔥', change: '0.6', changeType: 'up' },
    { title: 'Challenge Aktif', value: '2', icon: '🎯', change: '1', changeType: 'up' },
];

const leaderboard = [
    { rank: 1, name: 'Takumi N3', xp: '1,240 XP', streak: '9 hari' },
    { rank: 2, name: 'Rei Kanji', xp: '1,010 XP', streak: '6 hari' },
    { rank: 3, name: 'Aiko Study', xp: '920 XP', streak: '5 hari' },
];

const campaigns = [
    { name: 'Weekend XP Boost', status: 'Live', detail: 'Bonus 2x XP untuk quiz perfect score' },
    { name: '7-Day Streak Push', status: 'Scheduled', detail: 'Reminder banner + reward badge ringan' },
    { name: 'Kanji Sprint April', status: 'Draft', detail: 'Challenge 20 soal kanji dalam 7 hari' },
];

export default function Gamification() {
    return (
        <AuthenticatedLayout>
            <Head title="Superadmin - Gamifikasi" />

            <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-red-600">Superadmin</p>
                        <h1 className="text-2xl font-black text-gray-900">Gamifikasi</h1>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Monitoring performa loop gamifikasi N3, leaderboard, streak, dan campaign mingguan.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
                        Mode saat ini: monitor dan campaign ringan
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((item) => (
                        <StatCard key={item.title} {...item} />
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                    <Card>
                        <h2 className="text-lg font-black text-gray-900">Top Learners Minggu Ini</h2>
                        <div className="mt-5 space-y-3">
                            {leaderboard.map((item) => (
                                <div key={item.rank} className="flex items-center justify-between rounded-2xl border border-gray-100 p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 font-black text-red-600">
                                            {item.rank}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-900">{item.name}</p>
                                            <p className="mt-1 text-xs text-gray-500">{item.streak}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-black text-gray-900">{item.xp}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-lg font-black text-gray-900">Campaign & Challenge</h2>
                        <div className="mt-5 space-y-4">
                            {campaigns.map((item) => (
                                <div key={item.name} className="rounded-2xl border border-gray-100 p-4">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <h3 className="text-sm font-black text-gray-900">{item.name}</h3>
                                            <p className="mt-1 text-sm text-gray-500">{item.detail}</p>
                                        </div>
                                        <span className={`rounded-full px-3 py-1 text-xs font-black ${item.status === 'Live' ? 'bg-emerald-50 text-emerald-700' : item.status === 'Scheduled' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <Card>
                    <h2 className="text-lg font-black text-gray-900">Distribusi Streak</h2>
                    <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                        {[
                            { label: '0-2 hari', value: '28%', color: 'bg-gray-300' },
                            { label: '3-6 hari', value: '46%', color: 'bg-red-300' },
                            { label: '7+ hari', value: '26%', color: 'bg-red-600' },
                        ].map((item) => (
                            <div key={item.label} className="rounded-2xl border border-gray-100 p-4">
                                <p className="text-sm font-black text-gray-900">{item.label}</p>
                                <div className="mt-3 h-3 rounded-full bg-gray-100">
                                    <div className={`${item.color} h-3 rounded-full`} style={{ width: item.value }}></div>
                                </div>
                                <p className="mt-3 text-sm font-bold text-gray-500">{item.value} dari learner aktif</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
