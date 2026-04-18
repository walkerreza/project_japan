import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import StarsIcon from '@mui/icons-material/Stars';

export default function Leaderboard({ players = [] }) {
    // Menambahkan badge dan warna berdasarkan rank
    const formattedPlayers = players.map(p => {
        let badge = p.rank.toString();
        let color = 'text-gray-400';
        if (p.rank === 1) { badge = '🥇'; color = 'text-amber-500'; }
        else if (p.rank === 2) { badge = '🥈'; color = 'text-slate-400'; }
        else if (p.rank === 3) { badge = '🥉'; color = 'text-amber-700'; }
        
        return { ...p, badge, color };
    });

    const topThree = formattedPlayers.filter(p => p.rank <= 3);
    const podiumReady = topThree.length >= 3;

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><EmojiEventsIcon className="text-amber-500" /> Leaderboard</h2>}>
            <Head title="Leaderboard - Japanlingo" />

            {/* Top 3 Podium */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] p-8 mb-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 pointer-events-none select-none text-[200px] font-black flex items-center justify-center leading-none">🏆</div>
                <h2 className="text-center text-lg font-black uppercase tracking-widest text-gray-400 mb-8">This Week's Champions</h2>

                <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:items-end sm:gap-4">
                    {/* 2nd */}
                    {topThree[1] && (
                        <div className="flex flex-col items-center gap-3">
                            <div className="relative">
                                <img src={`https://ui-avatars.com/api/?name=${topThree[1].avatar}&background=64748b&color=fff&size=80`} className="w-16 h-16 rounded-full border-4 border-slate-400 shadow-xl" />
                                <span className="absolute -top-2 -right-2 text-xl">🥈</span>
                            </div>
                            <div className="text-center w-20">
                                <p className="font-bold text-sm leading-tight truncate">{topThree[1].name}</p>
                                <p className="text-gray-400 text-xs">{topThree[1].xp.toLocaleString()} XP</p>
                            </div>
                            <div className="bg-slate-500 rounded-t-xl w-20 h-16 flex items-center justify-center text-2xl font-black text-white">2</div>
                        </div>
                    )}
                    {/* 1st */}
                    {topThree[0] && (
                        <div className="flex flex-col items-center gap-3 sm:-mt-8">
                            <StarsIcon className="text-amber-400" sx={{ fontSize: 28 }} />
                            <div className="relative">
                                <img src={`https://ui-avatars.com/api/?name=${topThree[0].avatar}&background=f59e0b&color=fff&size=96`} className="w-20 h-20 rounded-full border-4 border-amber-400 shadow-2xl shadow-amber-400/30" />
                                <span className="absolute -top-2 -right-2 text-2xl">🥇</span>
                            </div>
                            <div className="text-center w-24">
                                <p className="font-black text-sm leading-tight truncate">{topThree[0].name}</p>
                                <p className="text-amber-400 text-xs font-bold">{topThree[0].xp.toLocaleString()} XP</p>
                            </div>
                            <div className="bg-amber-500 rounded-t-xl w-24 h-24 flex items-center justify-center text-3xl font-black text-white">1</div>
                        </div>
                    )}
                    {/* 3rd */}
                    {topThree[2] && (
                        <div className="flex flex-col items-center gap-3">
                            <div className="relative">
                                <img src={`https://ui-avatars.com/api/?name=${topThree[2].avatar}&background=92400e&color=fff&size=80`} className="w-16 h-16 rounded-full border-4 border-amber-700 shadow-xl" />
                                <span className="absolute -top-2 -right-2 text-xl">🥉</span>
                            </div>
                            <div className="text-center w-20">
                                <p className="font-bold text-sm leading-tight truncate">{topThree[2].name}</p>
                                <p className="text-gray-400 text-xs">{topThree[2].xp.toLocaleString()} XP</p>
                            </div>
                            <div className="bg-amber-800 rounded-t-xl w-20 h-12 flex items-center justify-center text-2xl font-black text-white">3</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Full Ranking Table */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-black text-gray-900">All Rankings</h3>
                    <div className="flex flex-wrap gap-2">
                        {['Weekly', 'Monthly', 'All Time'].map((t, i) => (
                            <button key={i} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${i === 0 ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-50'}`}>{t}</button>
                        ))}
                    </div>
                </div>

                <div className="divide-y divide-gray-50">
                    {formattedPlayers.map((p, i) => (
                        <div key={i} className={`flex flex-wrap items-center gap-4 px-6 py-4 transition-colors hover:bg-gray-50 sm:flex-nowrap ${p.isMe ? 'bg-red-50/60 border-l-4 border-red-600' : ''}`}>
                            <span className={`w-8 text-center font-black text-lg ${p.color}`}>{p.rank <= 3 ? p.badge : p.rank}</span>
                            <img src={`https://ui-avatars.com/api/?name=${p.avatar}&background=random&size=48`} className="w-11 h-11 rounded-full border-2 border-white shadow-sm shrink-0" />
                            <div className="min-w-0 flex-1">
                                <p className={`font-bold text-sm ${p.isMe ? 'text-red-600' : 'text-gray-900'}`}>{p.name}</p>
                                <p className="text-xs text-gray-400 font-medium">{p.level}</p>
                            </div>
                            <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold sm:ml-auto">
                                <LocalFireDepartmentIcon sx={{ fontSize: 14 }} />{p.streak}d
                            </div>
                            <div className="w-full text-left sm:w-auto sm:text-right">
                                <p className="font-black text-gray-900 text-sm">{p.xp.toLocaleString()}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">XP</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
