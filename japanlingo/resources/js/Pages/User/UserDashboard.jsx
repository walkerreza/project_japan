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

const modules = [
    {
        title: 'Basic Particles (Wa, Ga, O)',
        category: 'Grammar',
        categoryColor: 'bg-blue-500',
        time: 'Diakses 7 jam lalu',
        // Card visual
        visualBg: 'bg-slate-50',
        visualContent: (
            <div className="flex flex-col items-center justify-center h-full">
                <span className="font-bold text-gray-800 tracking-widest text-lg">JLPT N5</span>
                <span className="text-[10px] text-red-500 font-bold tracking-widest mt-1 uppercase">Grammar Guide</span>
                <div className="w-8 h-0.5 bg-red-500 mt-2"></div>
            </div>
        )
    },
    {
        title: 'Daily Kanji: Self & Family',
        category: 'Kanji',
        categoryColor: 'bg-red-500',
        time: 'Diakses kemarin',
        visualBg: 'bg-pink-50',
        visualContent: (
            <div className="flex flex-col items-center justify-center h-full text-red-500">
                <span className="text-4xl font-japanese font-black mb-1">私</span>
                <span className="text-xs font-medium tracking-widest">watashi</span>
            </div>
        )
    },
    {
        title: 'N4 Listening: Shopping',
        category: 'Audio',
        categoryColor: 'bg-orange-500',
        time: 'Baru dibuat',
        visualBg: 'bg-gray-50',
        visualContent: (
            <div className="flex flex-col items-center justify-center h-full text-gray-300">
                <div className="w-16 h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-2">
                    <span className="material-icons text-xl">image</span>
                </div>
                <span className="text-[10px] font-bold tracking-wider">Listening Practice</span>
            </div>
        )
    },
    {
        title: 'Week 2: Travel Vocabulary',
        category: 'Vocab',
        categoryColor: 'bg-green-500',
        time: '7 hari lalu',
        visualBg: 'bg-blue-50',
        visualContent: (
            <div className="w-full h-full p-6 flex flex-col justify-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs mb-4">Vocab</div>
                <div className="w-full h-1.5 bg-blue-200 rounded-full mb-2"></div>
                <div className="w-2/3 h-1.5 bg-blue-200 rounded-full"></div>
            </div>
        )
    }
];

const news = [
    {
        badge: 'Teknologi',
        badgeColor: 'bg-red-500',
        imgUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', // Tokyo tower
        time: '2 jam yang lalu',
        title: 'Inovasi Robot Pelayan Baru di Kafe Tokyo Menarik Perhatian Dunia',
        desc: 'Sebuah kafe di distrik Shibuya memperkenalkan robot pelayan AI yang mampu berinteraksi dengan pelanggan dalam 10 bahasa berbeda.',
        source: 'Tokyo Times'
    },
    {
        badge: 'Budaya',
        badgeColor: 'bg-blue-500',
        imgUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', // Kyoto temple
        time: '5 jam yang lalu',
        title: 'Festival Musim Gugur Kyoto Kembali Digelar dengan Meriah',
        desc: 'Setelah dua tahun pembatasan, ribuan turis memadati kuil Kiyomizu-dera untuk menikmati pemandangan daun musim gugur yang spektakuler.',
        source: 'Kyoto News'
    },
    {
        badge: 'Kuliner',
        badgeColor: 'bg-orange-500',
        imgUrl: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', // Ramen
        time: '1 hari yang lalu',
        title: 'Ramen Terpedas di Jepang: Tantangan Baru bagi Pecinta Kuliner',
        desc: 'Sebuah kedai ramen legendaris di Osaka meluncurkan menu \'Level Neraka\' yang menggunakan cabai terpedas di dunia, berani coba?',
        source: 'Osaka Eats'
    }
];

export default function UserDashboard({ user = {}, recentProgress = [] }) {
    return (
        <AuthenticatedLayout header={false}>
            <Head title="Beranda Utama" />

            <div className="w-full bg-white min-h-screen pb-16">
                
                {/* HERO SECTION - Mount Fuji Background with Fade Overlay */}
                <div 
                    className="relative w-full pt-16 pb-12 bg-cover bg-center"
                    style={{ backgroundImage: `url(${MountFujiBg})` }}
                >
                    {/* Efek Fade gradasi dari gambar asli (atas) meredup ke putih pekat (bawah) tempat konten halaman dimulai */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/70 to-white pointer-events-none"></div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
                        
                        <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 tracking-tight">
                            Mau belajar apa hari ini?
                        </h1>
                        
                        {/* SEARCH BAR */}
                        <div className="w-full max-w-2xl relative mb-6">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400">
                                <SearchIcon sx={{ fontSize: 24 }} />
                            </div>
                            <input 
                                type="text"
                                className="w-full pl-14 pr-12 py-4 rounded-full border-0 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-red-100 focus:border-red-100 transition-all text-sm md:text-base outline-none"
                                placeholder="Cari grammar, kanji, atau kosakata..."
                            />
                            <div className="absolute inset-y-0 right-0 pr-5 flex items-center cursor-pointer text-gray-400 hover:text-gray-600">
                                <TuneIcon sx={{ fontSize: 22 }} />
                            </div>
                        </div>

                        {/* USER GAMIFICATION STATS BUBBLES */}
                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            <div className="bg-white/90 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-sm border border-gray-100/50 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black shadow-inner">
                                    Lv.{user.level || 1}
                                </div>
                                <div className="text-left leading-tight">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total XP</p>
                                    <p className="text-base font-black text-gray-900">{user.xp || 0}</p>
                                </div>
                            </div>
                            <div className="bg-white/90 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-sm border border-gray-100/50 flex items-center gap-3">
                                <div className="text-3xl filter drop-shadow-sm">🔥</div>
                                <div className="text-left leading-tight">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Beruntun</p>
                                    <p className="text-base font-black text-gray-900">{user.streak_count || 0} Hari</p>
                                </div>
                            </div>
                        </div>

                        {/* SOCIAL BADGES */}
                        <div className="flex flex-wrap justify-center gap-3">
                            {socials.map((social, idx) => (
                                <a key={idx} href="#" className="flex items-center justify-center gap-2 bg-white px-4 py-2.5 rounded-full shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-xs font-bold text-gray-700 w-full sm:w-auto">
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
                            <h2 className="text-xl md:text-2xl font-black text-gray-900">Modul Terbaru</h2>
                            <select className="bg-transparent border-0 text-gray-500 font-medium text-sm focus:ring-0 cursor-pointer pr-8 hover:text-gray-900">
                                <option>Semua jenis</option>
                                <option>Grammar</option>
                                <option>Kanji</option>
                            </select>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {modules.map((mod, idx) => (
                                <Link href="#" key={idx} className="group block">
                                    {/* Visual Thumbnail */}
                                    <div className={`w-full aspect-[4/3] rounded-2xl ${mod.visualBg} mb-4 overflow-hidden border border-gray-100/50 group-hover:shadow-md transition-all duration-300`}>
                                        {mod.visualContent}
                                    </div>
                                    
                                    {/* Info */}
                                    <h3 className="font-bold text-gray-900 leading-snug mb-2 group-hover:text-red-500 transition-colors line-clamp-2">
                                        {mod.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <span className={`w-1.5 h-1.5 rounded-full ${mod.categoryColor}`}></span>
                                            {mod.category}
                                        </div>
                                        <span>•</span>
                                        <span>{mod.time}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>


                    {/* Berita Terkini Jepang Section */}
                    <section>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                            <h2 className="text-xl md:text-2xl font-black text-gray-900">Berita Terkini Jepang</h2>
                            <Link href="#" className="text-red-500 font-bold text-sm hover:underline">
                                Lihat semua berita
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {news.map((item, idx) => (
                                <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col h-full group">
                                    {/* Image with Badge */}
                                    <div className="relative w-full aspect-video overflow-hidden">
                                        <div className="absolute top-4 left-4 z-10">
                                            <span className={`${item.badgeColor} text-white text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wider uppercase shadow-sm`}>
                                                {item.badge}
                                            </span>
                                        </div>
                                        <img 
                                            src={item.imgUrl} 
                                            alt={item.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium mb-3">
                                            <AccessTimeIcon sx={{ fontSize: 14 }} />
                                            {item.time}
                                        </div>
                                        <h3 className="font-extrabold text-gray-900 text-lg leading-snug mb-3 group-hover:text-red-600 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                                            {item.desc}
                                        </p>
                                        
                                        {/* Footer */}
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mt-auto pt-4 border-t border-gray-50">
                                            <span className="text-xs font-bold text-gray-400">{item.source}</span>
                                            <Link href="#" className="font-bold text-red-500 text-xs flex items-center gap-1 hover:text-red-700 transition-colors group/link">
                                                Baca selengkapnya <ArrowRightAltIcon sx={{ fontSize: 18 }} className="group-hover/link:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
