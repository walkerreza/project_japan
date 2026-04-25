import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Card from '@/Components/UI/Card';
import StatCard from '@/Components/Dashboard/StatCard';

const defaultStats = [
    { title: 'Module Aktif', value: '14', icon: '📚', change: '2', changeType: 'up' },
    { title: 'Lesson Publish', value: '76', icon: '📝', change: '6%', changeType: 'up' },
    { title: 'Quiz Siap Pakai', value: '28', icon: '❓', change: '4%', changeType: 'up' },
    { title: 'News Aktif', value: '5', icon: '📣', change: '1', changeType: 'up' },
];

const defaultNews = [
    { title: 'Challenge Pekan Kanji N3', status: 'Pinned', audience: 'Semua student', schedule: 'Publish hari ini' },
    { title: 'Maintenance singkat hari Minggu', status: 'Scheduled', audience: 'Semua role', schedule: 'Besok 22:00' },
    { title: 'Module Bunpou Bab 6 tersedia', status: 'Draft', audience: 'Student N3', schedule: 'Menunggu review' },
];

const defaultUpdates = [
    { item: 'Lesson Listening Bab 3', by: 'Maya Content', state: 'Published' },
    { item: 'Quiz Kanji Drill Set B', by: 'Yuki Quiz', state: 'Review' },
    { item: 'News Weekend XP Boost', by: 'Rina Backup', state: 'Draft' },
];

export default function Content({
    stats = defaultStats,
    news = defaultNews,
    updates = defaultUpdates,
}) {
    return (
        <AuthenticatedLayout>
            <Head title="Superadmin - Konten" />

            <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-red-600">Superadmin</p>
                        <h1 className="text-2xl font-black text-gray-900">Konten</h1>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Monitoring materi pembelajaran dan news yang tampil di dashboard student.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
                        Fokus saat ini: materi N3, berita dashboard, dan status publish
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((item) => (
                        <StatCard key={item.title} {...item} />
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <Card>
                        <div className="flex flex-col gap-1">
                            <h2 className="text-lg font-black text-gray-900">News Portal</h2>
                            <p className="text-sm text-gray-500">Berita yang mengisi dashboard student dan notifikasi platform.</p>
                        </div>
                        <div className="mt-5 space-y-4">
                            {news.map((item) => (
                                <div key={item.title} className="rounded-2xl border border-gray-100 p-4">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <h3 className="text-sm font-black text-gray-900">{item.title}</h3>
                                            <p className="mt-1 text-sm text-gray-500">{item.audience}</p>
                                        </div>
                                        <span className={`rounded-full px-3 py-1 text-xs font-black ${item.status === 'Pinned' ? 'bg-red-50 text-red-600' : item.status === 'Scheduled' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">{item.schedule}</p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <h2 className="text-lg font-black text-gray-900">Status Konten</h2>
                            <div className="mt-4 space-y-3">
                                {[
                                    '3 lesson menunggu sinkronisasi media',
                                    '2 quiz masih belum punya explanation final',
                                    '1 news dijadwalkan untuk akhir pekan',
                                ].map((item) => (
                                    <div key={item} className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card>
                            <h2 className="text-lg font-black text-gray-900">Update Terbaru</h2>
                            <div className="mt-4 space-y-3">
                                {updates.map((item) => (
                                    <div key={item.item} className="rounded-2xl border border-gray-100 p-4">
                                        <p className="text-sm font-black text-gray-900">{item.item}</p>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">{item.by}</span>
                                            <span className={`rounded-full px-3 py-1 text-xs font-black ${item.state === 'Published' ? 'bg-emerald-50 text-emerald-700' : item.state === 'Review' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {item.state}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
