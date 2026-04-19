import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Card from '@/Components/UI/Card';
import StatCard from '@/Components/Dashboard/StatCard';

const stats = [
    { title: 'Total Student', value: '2,184', icon: '👨‍🎓', change: '8%', changeType: 'up' },
    { title: 'Aktif Mingguan', value: '1,392', icon: '🔥', change: '5%', changeType: 'up' },
    { title: 'Perlu Review', value: '38', icon: '🕵️', change: '3', changeType: 'down' },
    { title: 'Akun Suspended', value: '12', icon: '⛔', change: '1', changeType: 'down' },
];

const users = [
    { name: 'Takumi N3', email: 'takumi@japanlingo.dev', status: 'Aktif', xp: '1,240', level: 'Lv 6', streak: '9 hari', progress: '78%' },
    { name: 'Rei Kanji', email: 'rei@japanlingo.dev', status: 'Aktif', xp: '1,010', level: 'Lv 5', streak: '6 hari', progress: '64%' },
    { name: 'Aiko Study', email: 'aiko@japanlingo.dev', status: 'Review', xp: '420', level: 'Lv 3', streak: '1 hari', progress: '29%' },
    { name: 'Kenji Focus', email: 'kenji@japanlingo.dev', status: 'Suspended', xp: '190', level: 'Lv 2', streak: '0 hari', progress: '11%' },
];

export default function Users() {
    return (
        <AuthenticatedLayout>
            <Head title="Superadmin - Data User" />

            <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-red-600">Superadmin</p>
                        <h1 className="text-2xl font-black text-gray-900">Data User</h1>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Monitoring student, status akun, dan sinyal progres belajar N3 secara cepat.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {['Semua', 'Aktif', 'Review', 'Suspended'].map((item, index) => (
                            <span key={item} className={`rounded-full px-4 py-2 text-sm font-bold ${index === 0 ? 'bg-red-600 text-white' : 'border border-gray-200 bg-white text-gray-600'}`}>
                                {item}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((item) => (
                        <StatCard key={item.title} {...item} />
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <Card padding={false}>
                        <div className="border-b border-gray-100 px-6 py-4">
                            <h2 className="text-lg font-black text-gray-900">Daftar Student</h2>
                            <p className="mt-1 text-sm text-gray-500">Snapshot akun yang paling butuh perhatian operasional.</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-[760px] w-full text-sm">
                                <thead className="bg-gray-50 text-left text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                                    <tr>
                                        <th className="px-6 py-3">User</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">XP</th>
                                        <th className="px-6 py-3">Level</th>
                                        <th className="px-6 py-3">Streak</th>
                                        <th className="px-6 py-3">Progress</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((item) => (
                                        <tr key={item.email} className="border-t border-gray-100">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{item.name}</div>
                                                <div className="mt-1 text-xs text-gray-500">{item.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`rounded-full px-3 py-1 text-xs font-black ${item.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700' : item.status === 'Review' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-900">{item.xp}</td>
                                            <td className="px-6 py-4 text-gray-600">{item.level}</td>
                                            <td className="px-6 py-4 text-gray-600">{item.streak}</td>
                                            <td className="px-6 py-4">
                                                <div className="w-28 rounded-full bg-gray-100">
                                                    <div className="rounded-full bg-red-500 px-2 py-1 text-[10px] font-black text-white" style={{ width: item.progress }}>
                                                        {item.progress}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <h2 className="text-lg font-black text-gray-900">Aksi Cepat</h2>
                            <div className="mt-4 grid grid-cols-1 gap-3">
                                {['Tambah user manual', 'Suspend akun bermasalah', 'Reset password', 'Review progres tertinggal'].map((item) => (
                                    <div key={item} className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card>
                            <h2 className="text-lg font-black text-gray-900">Antrian Review</h2>
                            <div className="mt-4 space-y-3">
                                {[
                                    '12 user tidak login lebih dari 14 hari',
                                    '7 user punya progress rendah tetapi streak tinggi',
                                    '3 akun terdeteksi percobaan login berulang',
                                ].map((item) => (
                                    <div key={item} className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                                        {item}
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
