import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import LockIcon from '@mui/icons-material/Lock';

const certificates = [
    {
        id: 1,
        title: 'JLPT N5 Proficiency',
        subtitle: 'Basic Japanese Proficiency',
        date: 'January 15, 2026',
        score: 96,
        color: 'from-emerald-500 to-teal-600',
        earned: true,
        badge: '🏅'
    },
    {
        id: 2,
        title: 'JLPT N4 Proficiency',
        subtitle: 'Elementary Japanese Proficiency',
        date: 'March 5, 2026',
        score: 88,
        color: 'from-blue-500 to-indigo-600',
        earned: true,
        badge: '🎖️'
    },
    {
        id: 3,
        title: 'JLPT N3 Grammar Master',
        subtitle: 'Intermediate Grammar Certificate',
        date: null,
        score: null,
        color: 'from-gray-300 to-gray-400',
        earned: false,
        badge: '🔒'
    },
    {
        id: 4,
        title: '30-Day Streak Champion',
        subtitle: 'Consistent Learner Achievement',
        date: 'February 20, 2026',
        score: null,
        color: 'from-amber-500 to-orange-600',
        earned: true,
        badge: '🔥'
    },
];

export default function Certificates() {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><WorkspacePremiumIcon className="text-purple-500" /> My Certificates</h2>}>
            <Head title="Certificates - Japanlingo" />

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                {[
                    { label: 'Earned', value: '3', color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'In Progress', value: '1', color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Locked', value: '4', color: 'text-gray-500', bg: 'bg-gray-50' },
                ].map((s, i) => (
                    <div key={i} className={`${s.bg} rounded-2xl p-5 border border-gray-100 text-center`}>
                        <p className={`text-3xl font-black ${s.color} mb-1`}>{s.value}</p>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Certificate Cards */}
            <div className="grid md:grid-cols-2 gap-6">
                {certificates.map((cert) => (
                    <div key={cert.id} className={`rounded-[2rem] overflow-hidden shadow-sm border ${cert.earned ? 'border-gray-100' : 'border-gray-100 opacity-70'}`}>
                        {/* Certificate Visual Header */}
                        <div className={`bg-gradient-to-br ${cert.color} p-8 relative overflow-hidden`}>
                            <div className="absolute right-4 top-4 text-5xl opacity-20 select-none">{cert.badge}</div>
                            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/10"></div>
                            <div className="relative z-10">
                                <div className="text-5xl mb-4">{cert.badge}</div>
                                <h3 className="text-white font-black text-lg leading-tight">{cert.title}</h3>
                                <p className="text-white/70 text-sm font-medium mt-1">{cert.subtitle}</p>
                            </div>
                        </div>

                        {/* Certificate Details */}
                        <div className="bg-white p-5">
                            {cert.earned ? (
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">Issued on</p>
                                        <p className="text-sm font-bold text-gray-900">{cert.date}</p>
                                        {cert.score && <p className="text-xs text-green-600 font-bold mt-0.5">Score: {cert.score}/100</p>}
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
                                            <ShareIcon sx={{ fontSize: 18 }} />
                                        </button>
                                        <button className="w-9 h-9 rounded-xl bg-red-600 hover:bg-red-700 flex items-center justify-center text-white transition-colors shadow-md shadow-red-500/30">
                                            <DownloadIcon sx={{ fontSize: 18 }} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                                        <LockIcon sx={{ fontSize: 18 }} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-500">Not yet earned</p>
                                        <p className="text-xs text-gray-400">Complete N3 module to unlock</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}
