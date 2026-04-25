import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import StatCard from '@/Components/Dashboard/StatCard';
import ChartCard from '@/Components/Dashboard/ChartCard';
import Card from '@/Components/UI/Card';

const defaultMetrics = [
    { title: 'Total Student', value: '2,184', icon: '👥', change: '8%', changeType: 'up' },
    { title: 'Learner Aktif', value: '1,392', icon: '🔥', change: '5%', changeType: 'up' },
    { title: 'Total Admin', value: '8', icon: '🛡️', change: '1', changeType: 'up' },
    { title: 'Quiz Attempt', value: '6,420', icon: '❓', change: '11%', changeType: 'up' },
    { title: 'XP Terdistribusi', value: '48,220', icon: '⚡', change: '9%', changeType: 'up' },
    { title: 'News Aktif', value: '5', icon: '📣', change: '2', changeType: 'up' },
];

const defaultAlerts = [
    { tone: 'red', text: '2 alert keamanan butuh review login history.' },
    { tone: 'amber', text: '3 lesson masih menunggu sinkronisasi media.' },
    { tone: 'blue', text: 'Campaign Weekend XP Boost dijadwalkan aktif malam ini.' },
];

const defaultActivities = [
    'Maya Content mem-publish update lesson Listening Bab 3',
    'Root Superadmin reset password admin.yuki',
    'News Challenge Pekan Kanji dipin ke dashboard student',
];

const defaultLearningBars = [
    { label: 'D1', lesson: 42, quiz: 50 },
    { label: 'D2', lesson: 56, quiz: 64 },
    { label: 'D3', lesson: 48, quiz: 54 },
    { label: 'D4', lesson: 68, quiz: 78 },
    { label: 'D5', lesson: 61, quiz: 70 },
    { label: 'D6', lesson: 74, quiz: 85 },
    { label: 'D7', lesson: 79, quiz: 91 },
];

export default function SuperadminDashboard({
    metrics = defaultMetrics,
    alerts = defaultAlerts,
    activities = defaultActivities,
    learningBars = defaultLearningBars,
}) {
    return (
        <AuthenticatedLayout>
            <Head title="Superadmin - Beranda" />

            <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-red-600">Superadmin</p>
                        <h1 className="text-2xl font-black text-gray-900">Beranda Platform</h1>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Ringkasan operasional Japanlingo untuk user, konten, gamifikasi, news, dan sistem.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
                        Fokus aktif: N3 learning loop + gamification
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {metrics.map((item) => (
                        <StatCard key={item.title} {...item} />
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <ChartCard title="Aktivitas Belajar 7 Hari" subtitle="Lesson selesai vs quiz attempt">
                        <div className="flex h-64 items-end gap-2">
                            {learningBars.map((item) => (
                                <div key={item.label} className="flex flex-1 flex-col justify-end gap-1">
                                    <div className="rounded-t-xl bg-red-200" style={{ height: `${Math.min(item.lesson, 100) * 0.45}%` }}></div>
                                    <div className="rounded-t-xl bg-red-600" style={{ height: `${Math.min(item.quiz, 100) * 0.55}%` }}></div>
                                    <p className="pt-2 text-center text-[11px] font-bold text-gray-400">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </ChartCard>

                    <ChartCard title="Distribusi Fokus Platform" subtitle="User, content, gamification, system">
                        <div className="space-y-4">
                            {[
                                ['User operations', '34%', 'bg-red-600'],
                                ['Content oversight', '28%', 'bg-red-400'],
                                ['Gamification', '24%', 'bg-amber-400'],
                                ['System & logs', '14%', 'bg-gray-300'],
                            ].map(([label, value, color]) => (
                                <div key={label}>
                                    <div className="mb-2 flex items-center justify-between text-sm">
                                        <span className="font-bold text-gray-700">{label}</span>
                                        <span className="font-black text-gray-900">{value}</span>
                                    </div>
                                    <div className="h-3 rounded-full bg-gray-100">
                                        <div className={`h-3 rounded-full ${color}`} style={{ width: value }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ChartCard>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <Card>
                        <h2 className="text-lg font-black text-gray-900">Recent Alerts</h2>
                        <div className="mt-4 space-y-3">
                            {alerts.map((item) => (
                                <div key={item.text} className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                                    item.tone === 'red'
                                        ? 'border-red-100 bg-red-50 text-red-700'
                                        : item.tone === 'amber'
                                        ? 'border-amber-100 bg-amber-50 text-amber-700'
                                        : 'border-blue-100 bg-blue-50 text-blue-700'
                                }`}>
                                    {item.text}
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-lg font-black text-gray-900">Aktivitas Terkini</h2>
                        <div className="mt-4 space-y-3">
                            {activities.map((item) => (
                                <div key={item} className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
                                    {item}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
