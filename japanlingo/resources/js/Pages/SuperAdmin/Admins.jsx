import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Card from '@/Components/UI/Card';
import StatCard from '@/Components/Dashboard/StatCard';

const stats = [
    { title: 'Admin Aktif', value: '8', icon: '🛡️', change: '1', changeType: 'up' },
    { title: 'Editor Konten', value: '5', icon: '✍️', change: '2', changeType: 'up' },
    { title: 'Reviewer', value: '2', icon: '🔎', change: '0', changeType: 'down' },
    { title: 'Aksi Hari Ini', value: '47', icon: '⚙️', change: '12%', changeType: 'up' },
];

const admins = [
    { name: 'Maya Content', role: 'Editor', focus: 'Modul & Lesson', updated: '12 menit lalu', status: 'Aktif' },
    { name: 'Yuki Quiz', role: 'Reviewer', focus: 'Quiz & Question', updated: '34 menit lalu', status: 'Aktif' },
    { name: 'Daichi Ops', role: 'Admin', focus: 'Publishing', updated: '1 jam lalu', status: 'Aktif' },
    { name: 'Rina Backup', role: 'Editor', focus: 'Announcement', updated: 'Kemarin', status: 'Nonaktif' },
];

export default function Admins() {
    return (
        <AuthenticatedLayout>
            <Head title="Superadmin - Data Admin" />

            <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-red-600">Superadmin</p>
                        <h1 className="text-2xl font-black text-gray-900">Data Admin</h1>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Pengawasan admin yang mengelola materi, announcement, dan quality control konten.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
                        Role aktif: Editor, Reviewer, Publishing
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((item) => (
                        <StatCard key={item.title} {...item} />
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <Card>
                        <h2 className="text-lg font-black text-gray-900">Roster Admin</h2>
                        <div className="mt-5 space-y-4">
                            {admins.map((item) => (
                                <div key={item.name} className="rounded-2xl border border-gray-100 p-4">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <h3 className="text-sm font-black text-gray-900">{item.name}</h3>
                                            <p className="mt-1 text-sm text-gray-500">{item.focus}</p>
                                        </div>
                                        <span className={`rounded-full px-3 py-1 text-xs font-black ${item.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600">{item.role}</span>
                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">Update terakhir {item.updated}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <h2 className="text-lg font-black text-gray-900">Kontrol Admin</h2>
                            <div className="mt-4 grid grid-cols-1 gap-3">
                                {['Tambah admin baru', 'Edit peran admin', 'Nonaktifkan akses', 'Lihat log admin'].map((item) => (
                                    <div key={item} className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card>
                            <h2 className="text-lg font-black text-gray-900">Aktivitas Terkini</h2>
                            <div className="mt-4 space-y-3">
                                {[
                                    'Maya publish 3 update lesson pagi ini',
                                    'Yuki review 24 soal listening N3',
                                    'Daichi menjadwalkan 2 announcement baru',
                                ].map((item) => (
                                    <div key={item} className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
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
