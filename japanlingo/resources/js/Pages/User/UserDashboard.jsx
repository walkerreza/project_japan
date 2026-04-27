import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import theme from '@/Components/theme/themes';
import MountFujiBg from '../../../Images/Mount-Fuji-New.jpg';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune'; // For filter icon
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

// Social Badges Data
const socials = [
    { icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png', label: 'Instagram', handle: '@japanlingo' },
    { icon: 'https://cdn4.iconfinder.com/data/icons/social-media-flat-7/64/Social-media_Tiktok-512.png', label: 'TikTok', handle: '@japanlingo' },
    { icon: 'https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png', label: 'YouTube', handle: '@japanlingo' },
    { icon: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg', label: 'Twitter', handle: '@japanlingo' },
];

// Data statis telah dihapus, sekarang menggunakan props dari backend

export default function UserDashboard({ user = {}, recentProgress = [], availableLevels = [], rewardHistory = [], news = [] }) {
    return (
        <AuthenticatedLayout header={false}>
            <Head title="Beranda Utama" />

            <div className="w-full bg-white dark:bg-gray-950 min-h-screen pb-16 transition-colors duration-300">
                
                {/* HERO SECTION - Mount Fuji Background with Fade Overlay */}
                <div 
                    className="relative w-full pt-16 pb-12 bg-cover bg-center"
                    style={{ backgroundImage: `url(${MountFujiBg})` }}
                >
                    {/* Efek Fade gradasi dari gambar asli (atas) meredup ke putih pekat (bawah) tempat konten halaman dimulai */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/70 to-white dark:from-gray-950/30 dark:via-gray-950/70 dark:to-gray-950 pointer-events-none transition-colors duration-300"></div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
                        
                        <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">
                            Mau belajar apa hari ini?
                        </h1>
                        
                        {/* SEARCH BAR */}
                        <div className="w-full max-w-2xl relative mb-6">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                                <SearchIcon sx={{ fontSize: 24 }} />
                            </div>
                            <input 
                                type="text"
                                className="w-full pl-14 pr-12 py-4 rounded-full border-0 bg-white dark:bg-gray-900 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_15px_-3px_rgba(0,0,0,0.2)] text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/50 transition-all text-sm md:text-base outline-none"
                                placeholder="Cari grammar, kanji, atau kosakata..."
                            />
                            <div className="absolute inset-y-0 right-0 pr-5 flex items-center cursor-pointer text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                                <TuneIcon sx={{ fontSize: 22 }} />
                            </div>
                        </div>

                        {/* USER GAMIFICATION STATS BUBBLES */}
                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-sm border border-gray-100/50 dark:border-gray-800 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black shadow-inner">
                                    Lv.{user.level || 1}
                                </div>
                                <div className="text-left leading-tight">
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Total XP</p>
                                    <p className="text-base font-black text-gray-900 dark:text-white">{user.xp || 0}</p>
                                </div>
                            </div>
                            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-sm border border-gray-100/50 dark:border-gray-800 flex items-center gap-3">
                                <div className="text-3xl filter drop-shadow-sm">🔥</div>
                                <div className="text-left leading-tight">
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Beruntun</p>
                                    <p className="text-base font-black text-gray-900 dark:text-white">{user.streak_count || 0} Hari</p>
                                </div>
                            </div>
                            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-sm border border-gray-100/50 dark:border-gray-800 flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-black shadow-inner ${user.subscription_status === 'premium' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                                    {user.subscription_status === 'premium' ? '👑' : '🆓'}
                                </div>
                                <div className="text-left leading-tight">
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Status Akses</p>
                                    <p className={`text-base font-black ${user.subscription_status === 'premium' ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-900 dark:text-white'}`}>{user.subscription_status === 'premium' ? 'Premium' : 'Gratis'}</p>
                                </div>
                            </div>
                        </div>

                        {user.subscription_status !== 'premium' && (
                            <Link href={route('pricing')} className="mb-8 inline-block bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                                🚀 Upgrade ke Premium Sekarang!
                            </Link>
                        )}

                        {/* SOCIAL BADGES */}
                        <div className="flex flex-wrap justify-center gap-3">
                            {socials.map((social, idx) => (
                                <a key={idx} href="#" className="flex items-center justify-center gap-2 bg-white dark:bg-gray-900 px-4 py-2.5 rounded-full shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow text-xs font-bold text-gray-700 dark:text-gray-300 w-full sm:w-auto">
                                    <img src={social.icon} alt={social.label} className="w-4 h-4 object-contain" />
                                    {social.label} {social.handle}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT AREA */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-16">

                    {/* Modul Terbaru Section */}
                    <section>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">Modul Terbaru</h2>
                            <select className="bg-transparent dark:bg-gray-950 border-0 text-gray-500 dark:text-gray-400 font-medium text-sm focus:ring-0 cursor-pointer pr-8 hover:text-gray-900 dark:hover:text-white">
                                <option>Semua jenis</option>
                                <option>Grammar</option>
                                <option>Kanji</option>
                            </select>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {availableLevels.map((level, idx) => (
                                level.modules && level.modules.length > 0 && (
                                    <Link href={route('user.lessons.index')} key={idx} className="group block">
                                        {/* Visual Thumbnail */}
                                        <div className={`w-full aspect-[4/3] rounded-2xl bg-slate-50 dark:bg-gray-800/50 mb-4 overflow-hidden border border-gray-100/50 dark:border-gray-800 group-hover:shadow-md transition-all duration-300 relative`}>
                                            {level.is_premium && (
                                                <div className="absolute top-3 right-3 bg-yellow-400 dark:bg-yellow-500/20 text-yellow-900 dark:text-yellow-500 text-[10px] font-black px-2 py-1 rounded-md shadow-sm z-10 flex items-center gap-1">
                                                    👑 PREMIUM
                                                </div>
                                            )}
                                            <div className="flex flex-col items-center justify-center h-full">
                                                <span className="font-bold text-gray-800 dark:text-gray-200 tracking-widest text-lg">JLPT {level.level_name}</span>
                                                <span className="text-[10px] text-red-500 font-bold tracking-widest mt-1 uppercase">{level.modules.length} Modul Tersedia</span>
                                                <div className="w-8 h-0.5 bg-red-500 mt-2"></div>
                                            </div>
                                        </div>
                                        
                                        {/* Info */}
                                        <h3 className="font-bold text-gray-900 dark:text-white leading-snug mb-2 group-hover:text-red-500 transition-colors line-clamp-2">
                                            {level.modules[0].title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                                            <div className="flex items-center gap-1.5">
                                                <span className={`w-1.5 h-1.5 rounded-full bg-blue-500`}></span>
                                                {level.modules[0].category || 'General'}
                                            </div>
                                        </div>
                                    </Link>
                                )
                            ))}
                            {availableLevels.length === 0 && (
                                <p className="text-gray-500 text-sm">Belum ada modul yang tersedia.</p>
                            )}
                        </div>
                    </section>


                    {/* Portal Berita Jepang Section */}
                    <section>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">Berita Terkini Jepang</h2>
                            <Link href={route('user.news.index')} className="text-red-500 font-bold text-sm hover:underline">
                                Lihat semua berita
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {news && news.length > 0 ? news.map((item, idx) => (
                                <Link href={route('user.news.show', item.id)} key={item.id || idx} className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.1)] dark:shadow-none dark:hover:border-gray-700 transition-all duration-300 flex flex-col h-full group">
                                    <div className="aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800">
                                        {item.thumbnail_url || item.cover_url ? (
                                            <img src={item.thumbnail_url || item.cover_url} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-red-50 to-gray-100 text-3xl font-black text-red-200 dark:from-gray-800 dark:to-gray-900 dark:text-gray-700">
                                                JP
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        {item.is_pinned && (
                                            <div className="mb-3">
                                                <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-bold px-2 py-1 rounded-md tracking-wider uppercase">
                                                    PIN Disematkan
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium mb-3">
                                            <AccessTimeIcon sx={{ fontSize: 14 }} />
                                            {item.published_at
                                                ? new Date(item.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                                                : 'Japanlingo News'}
                                        </div>
                                        <h3 className="font-extrabold text-gray-900 dark:text-white text-lg leading-snug mb-3 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                                            {item.excerpt || (item.body ? item.body.replace(/<[^>]*>/g, '').substring(0, 100) + '...' : 'Baca update terbaru dari Japanlingo.')}
                                        </p>
                                        <div className="mt-auto flex items-center gap-2 text-sm font-black text-red-600 dark:text-red-400">
                                            Baca selengkapnya
                                            <ArrowRightAltIcon sx={{ fontSize: 20 }} />
                                        </div>
                                    </div>
                                </Link>
                            )) : (
                                <p className="text-gray-500 dark:text-gray-400 text-sm col-span-3">Belum ada berita terbaru.</p>
                            )}
                        </div>
                    </section>
                    {/* Riwayat Perolehan XP */}
                    {rewardHistory.length > 0 && (
                        <section>
                            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-6">Riwayat Perolehan XP</h2>
                            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                                <div className="divide-y divide-gray-50 dark:divide-gray-800">
                                    {rewardHistory.map((log, idx) => (
                                        <div key={idx} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black ${
                                                    log.source_type === 'lesson' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                                    log.source_type === 'quiz' ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                                    log.source_type === 'achievement' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                                                    'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                                }`}>
                                                    {log.source_type === 'lesson' ? '📖' : log.source_type === 'quiz' ? '📝' : log.source_type === 'achievement' ? '🏆' : '⚡'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white text-sm">{log.description || log.source_type}</p>
                                                    <p className="text-[11px] text-gray-400 font-medium">{new Date(log.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                            </div>
                                            <span className="font-black text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-lg text-sm">+{log.xp_amount} XP</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
