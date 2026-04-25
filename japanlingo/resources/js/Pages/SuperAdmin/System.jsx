import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Card from '@/Components/UI/Card';
import StatCard from '@/Components/Dashboard/StatCard';

const defaultStats = [
    { title: 'Status App', value: 'Stabil', icon: '🟢', change: '99.9%', changeType: 'up' },
    { title: 'Queue', value: '12 job', icon: '📬', change: '2', changeType: 'down' },
    { title: 'Cache Health', value: 'Normal', icon: '🧠', change: '0', changeType: 'up' },
    { title: 'Storage Usage', value: '68%', icon: '💾', change: '4%', changeType: 'up' },
];

export default function System({
    stats = defaultStats,
}) {
    return (
        <AuthenticatedLayout>
            <Head title="Superadmin - Sistem" />

            <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-red-600">Superadmin</p>
                        <h1 className="text-2xl font-black text-gray-900">Sistem</h1>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Ringkasan kesehatan aplikasi, maintenance notice, dan konfigurasi global ringan.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
                        Environment lokal dipantau sebagai snapshot UI
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((item) => (
                        <StatCard key={item.title} {...item} />
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
                    <Card>
                        <h2 className="text-lg font-black text-gray-900">Maintenance Notice</h2>
                        <div className="mt-4 space-y-3">
                            {[
                                'Tidak ada maintenance terjadwal hari ini',
                                'Banner maintenance dapat digunakan untuk pemberitahuan user',
                                'Mode maintenance penuh belum diaktifkan',
                            ].map((item, index) => (
                                <div key={item} className={`rounded-2xl px-4 py-3 text-sm font-medium ${index === 0 ? 'border border-emerald-100 bg-emerald-50 text-emerald-700' : 'border border-gray-200 bg-gray-50 text-gray-600'}`}>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-lg font-black text-gray-900">Konfigurasi Global</h2>
                        <div className="mt-4 space-y-3">
                            {[
                                ['Aplikasi', 'Japanlingo'],
                                ['Scope aktif', 'N3 + gamification'],
                                ['Queue mode', 'database'],
                                ['Filesystem', 'public'],
                            ].map(([label, value]) => (
                                <div key={label} className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3 text-sm">
                                    <span className="font-bold text-gray-500">{label}</span>
                                    <span className="font-black text-gray-900">{value}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <Card>
                    <h2 className="text-lg font-black text-gray-900">Catatan Operasional</h2>
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                        {[
                            'Audit trail detail belum sepenuhnya tersambung ke backend.',
                            'Queue, cache, dan storage saat ini hanya ditampilkan sebagai summary UI.',
                            'Kontrol sistem berat sengaja belum dibuka agar scope tetap aman.',
                        ].map((item) => (
                            <div key={item} className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm font-medium text-gray-600">
                                {item}
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
