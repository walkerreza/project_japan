import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import SidebarLink from '@/Components/Navigation/SidebarLink';

// Ikon Navigasi Umum (Campuran Untuk Semua Role)
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PostAddIcon from '@mui/icons-material/PostAdd';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ShieldIcon from '@mui/icons-material/Shield';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import PaymentsIcon from '@mui/icons-material/Payments';
import SettingsIcon from '@mui/icons-material/Settings';

// Ikon Bawah
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ContrastOutlinedIcon from '@mui/icons-material/ContrastOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AppsIcon from '@mui/icons-material/Apps';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

export default function AuthenticatedLayout({ children }) {
    const { user } = usePage().props.auth;
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const menuRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    // Kembalikan Struktur Role-Based Menu (Diadaptasi menjadi Icon Besar Canva Style)
    const adminMenu = [
        { href: '/admin/dashboard', icon: <DashboardIcon sx={{ fontSize: 24 }} />, label: 'Beranda' },
        { href: '/admin/modules', icon: <LibraryBooksIcon sx={{ fontSize: 24 }} />, label: 'Modul' },
        { href: '/admin/quizzes', icon: <PostAddIcon sx={{ fontSize: 24 }} />, label: 'Kuis' },
        { href: '/admin/users', icon: <PeopleIcon sx={{ fontSize: 24 }} />, label: 'Data Murid' },
        { href: '/admin/gamification', icon: <EmojiEventsIcon sx={{ fontSize: 24 }} />, label: 'Aturan Gim' },
    ];
    
    const userMenu = [
        { href: '/user/dashboard', icon: <DashboardIcon sx={{ fontSize: 24 }} />, label: 'Beranda' },
        { href: '/user/lessons', icon: <AutoStoriesIcon sx={{ fontSize: 24 }} />, label: 'Pelajaran' },
        { href: '/user/quizzes', icon: <HelpCenterIcon sx={{ fontSize: 24 }} />, label: 'Kuis' },
        { href: '/user/leaderboard', icon: <EmojiEventsIcon sx={{ fontSize: 24 }} />, label: 'Peringkat' },
        { href: '/user/certificates', icon: <WorkspacePremiumIcon sx={{ fontSize: 24 }} />, label: 'Sertifikat' },
        { href: '/user/progress', icon: <ShowChartIcon sx={{ fontSize: 24 }} />, label: 'Progress' },
    ];
    
    const superadminMenu = [
        { href: '/superadmin/dashboard', icon: <DashboardIcon sx={{ fontSize: 24 }} />, label: 'Beranda' },
        { href: '/superadmin/users', icon: <PeopleIcon sx={{ fontSize: 24 }} />, label: 'Data User' },
        { href: '/superadmin/admins', icon: <ShieldIcon sx={{ fontSize: 24 }} />, label: 'Data Admin' },
        { href: '/superadmin/content', icon: <MonitorHeartIcon sx={{ fontSize: 24 }} />, label: 'Konten' },
        { href: '/superadmin/gamification', icon: <EmojiEventsIcon sx={{ fontSize: 24 }} />, label: 'Gamifikasi' },
        { href: '/superadmin/pricing', icon: <PaymentsIcon sx={{ fontSize: 24 }} />, label: 'Pemasukan' },
        { href: '/superadmin/system', icon: <SettingsIcon sx={{ fontSize: 24 }} />, label: 'Sistem' },
    ];

    const isSuperadmin = user.role === 'superadmin';
    const isAdmin = user.role === 'admin' || isSuperadmin;
    const activeMenu = isSuperadmin ? superadminMenu : (isAdmin ? adminMenu : userMenu);

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col lg:flex-row w-full overflow-x-hidden">
            
            {/* ====== HEADER MOBILE ====== */}
            <div className="lg:hidden flex items-center justify-between bg-white border-b border-gray-200 p-3 sticky top-0 z-30 shadow-sm">
                <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setMobileOpen(true)} className="p-1 text-gray-500 hover:text-gray-900 focus:outline-none transition-colors rounded-lg hover:bg-gray-100">
                        <MenuIcon sx={{ fontSize: 26 }} />
                    </button>
                    <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 text-lg tracking-tight">Japanlingo</span>
                </div>
                <button type="button" onClick={() => setMobileOpen(true)} className="w-[34px] h-[34px] rounded-full bg-red-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                    {user.username?.charAt(0).toUpperCase()}
                </button>
            </div>

            {/* ====== OVERLAY MOBILE ====== */}
            {mobileOpen && (
                <div 
                    className="fixed inset-0 bg-gray-900/40 backdrop-blur-[2px] z-40 lg:hidden transition-opacity"
                    onClick={() => setMobileOpen(false)}
                ></div>
            )}

            {/* ====== SIDEBAR VERTIKAL ALA CANVA (MODES: MINI & EXPANDED) ====== */}
            <aside className={`flex flex-col bg-[#F2F3F5] border-r border-[#E5E7EB] fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out ${isExpanded ? 'w-[240px]' : 'w-[88px]'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                
                {/* Logo Singkat & Tombol Tutup Mobile */}
                <div className="p-3 flex flex-col items-center justify-center border-b border-gray-100 mb-4 gap-3">
                    <button 
                        type="button"
                        onClick={() => setMobileOpen(false)}
                        className="lg:hidden w-10 h-10 bg-red-50 rounded-full flex items-center justify-center shadow-sm text-red-600 border border-red-100 transition-colors mt-2"
                    >
                        <CloseIcon sx={{ fontSize: 22 }} />
                    </button>
                    <div 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`flex items-center hover:bg-white cursor-pointer transition-all hidden lg:flex ${isExpanded ? 'w-full py-2 px-1 gap-3' : 'justify-center w-10 h-10'}`}
                    >
                        <img src="/logo.png" alt="Logo" className={`${isExpanded ? 'w-10 h-10' : 'w-8 h-8'} object-contain transition-all duration-300`} />
                        {isExpanded && (
                            <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 text-lg tracking-tight animate-in fade-in slide-in-from-left-2 duration-300">
                                Japanlingo
                            </span>
                        )}
                    </div>
                </div>

                {/* Menu Navigasi Tengah */}
                <nav className="flex-1 px-3 space-y-2 overflow-y-auto hide-scrollbar" onClick={() => setMobileOpen(false)}>
                    {activeMenu.map((item, idx) => (
                        <SidebarLink 
                            key={idx} 
                            href={item.href} 
                            icon={item.icon} 
                            active={window.location.pathname.startsWith(item.href)}
                            badge={item.badge}
                            isExpanded={isExpanded}
                        >
                            {item.label}
                        </SidebarLink>
                    ))}
                </nav>

                {/* Notifikasi & Profil Pop-up di Bawah */}
                <div className={`p-3 flex flex-col ${isExpanded ? 'gap-2 px-4' : 'items-center'} mt-auto border-t border-gray-200/60 relative`} ref={menuRef}>
                    
                    {/* Lonceng Notifikasi */}
                    <button className={`w-full flex items-center ${isExpanded ? 'px-3 justify-start' : 'justify-center'} h-10 rounded-xl text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors mb-2 relative group`}>
                        <NotificationsOutlinedIcon sx={{ fontSize: 24 }} />
                        {isExpanded && <span className="ml-3 text-sm font-bold animate-in fade-in slide-in-from-left-2">Notifikasi</span>}
                        <span className={`absolute ${isExpanded ? 'left-7 top-2' : 'top-1.5 right-1.5'} w-2 h-2 rounded-full bg-red-500 border-2 border-[#F2F3F5]`}></span>
                    </button>

                    {/* Avatar Pemicu Popup */}
                    <button 
                        onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                        className={`w-full flex items-center ${isExpanded ? 'px-2 py-1.5 gap-3 bg-white border border-gray-200 shadow-sm' : 'justify-center h-[42px]'} rounded-2xl transition-all relative overflow-hidden ring-2 ${profileMenuOpen ? 'ring-gray-300 ring-offset-2' : 'ring-transparent'}`}
                    >
                        <div className={`shrink-0 ${isExpanded ? 'w-8 h-8 text-sm' : 'w-[42px] h-[42px] text-xl'} rounded-full bg-red-600 text-white font-black flex items-center justify-center shadow-sm transition-all`}>
                            {user.username?.charAt(0).toUpperCase()}
                        </div>
                        {isExpanded && (
                            <div className="flex-1 text-left truncate animate-in fade-in slide-in-from-left-2">
                                <p className="text-xs font-bold text-gray-900 leading-tight">{user.username}</p>
                                <p className="text-[10px] text-gray-500 truncate mt-0.5">Pengaturan Akun</p>
                            </div>
                        )}
                    </button>

                    {/* Pop-up Menu Profil Ala Canva */}
                    {profileMenuOpen && (
                        <div className="absolute bottom-16 left-[96px] w-[300px] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.25)] border border-gray-100 overflow-hidden transform origin-bottom-left animate-in fade-in slide-in-from-bottom-5 duration-200 text-left">
                            
                            {/* Header Akun */}
                            <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
                                        {user.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 leading-tight group-hover:text-blue-600">{user.username}</p>
                                        <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                                    </div>
                                </div>
                                <KeyboardArrowRightIcon sx={{ fontSize: 18 }} className="text-gray-400 group-hover:text-gray-600" />
                            </div>

                            <div className="h-px bg-gray-100 w-full"></div>

                            {/* Daftar Tautan Menu Aktif */}
                            <div className="py-2">
                                <Link href="/user/profile" className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium">
                                    <div className="flex items-center gap-3"><SettingsOutlinedIcon sx={{ fontSize: 18 }} className="text-gray-500" /> Pengaturan profil</div>
                                </Link>
                            </div>

                            <div className="h-px bg-gray-100 w-full my-1"></div>

                            {/* Aksi Keluar */}
                            <div className="py-1">
                                <Link 
                                    href={route('logout')} 
                                    method="post" 
                                    as="button"
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-bold"
                                >
                                    <LogoutOutlinedIcon sx={{ fontSize: 18 }} /> Keluar Akun
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

            </aside>

            <div className={`flex-1 w-full transition-all duration-300 ${isExpanded ? 'lg:ml-[240px]' : 'lg:ml-[88px]'}`}>
                <main className="min-h-screen bg-white shadow-[-5px_0_30px_-10px_rgba(0,0,0,0.05)] relative z-10">
                    {children}
                </main>
            </div>

            {/* Gaya CSS Helper untuk Hide-Scrollbar dan Animasi pop-up */}
            <style dangerouslySetInnerHTML={{__html:`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes fade-in-slide-up {
                    0% { opacity: 0; transform: translateY(10px) scale(0.98); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-in { animation: fade-in-slide-up 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `}} />
        </div>
    );
}
