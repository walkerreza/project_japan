import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import SidebarLink from '@/Components/Navigation/SidebarLink';

// Ikon Navigasi Umum
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PostAddIcon from '@mui/icons-material/PostAdd';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import StyleIcon from '@mui/icons-material/Style';
import TranslateIcon from '@mui/icons-material/Translate';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ShieldIcon from '@mui/icons-material/Shield';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import SettingsIcon from '@mui/icons-material/Settings';

// Ikon Bawah
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

export default function AuthenticatedLayout({ children }) {
    const { user } = usePage().props.auth;
    const flash = usePage().props.flash || {};
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [toastAchievements, setToastAchievements] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    
    // Notification variables and handlers
    const notifications = user?.notifications || [];
    const unreadCount = notifications.length;

    const handleMarkAllAsRead = () => {
        router.post(route('notifications.readAll'), {}, { preserveScroll: true, preserveState: true });
    };

    const handleMarkAsRead = (id) => {
        router.post(route('notifications.read', id), {}, { preserveScroll: true, preserveState: true });
    };

    // Ref untuk event klik di luar popup
    const menuRef = useRef(null);

    // Theme Mode Logic
    const [themeMode, setThemeMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'system';
        }
        return 'system';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (themeMode === 'dark' || (themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', themeMode);
        
        const handleStorage = () => {
            setThemeMode(localStorage.getItem('theme') || 'system');
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, [themeMode]);

    useEffect(() => {
        if (flash.newAchievements && flash.newAchievements.length > 0) {
            setToastAchievements(flash.newAchievements);
            const timer = setTimeout(() => setToastAchievements([]), 6000);
            return () => clearTimeout(timer);
        }
    }, [flash.newAchievements]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setProfileMenuOpen(false);
                setNotificationOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const adminMenu = [
        { href: '/admin/dashboard', icon: <DashboardIcon sx={{ fontSize: 24 }} />, label: 'Beranda' },
        { href: '/admin/modules', icon: <LibraryBooksIcon sx={{ fontSize: 24 }} />, label: 'Modul' },
        { href: '/admin/quizzes', icon: <PostAddIcon sx={{ fontSize: 24 }} />, label: 'Kuis' },
        { href: '/admin/vocabulary', icon: <TranslateIcon sx={{ fontSize: 24 }} />, label: 'Kosakata' },
        { href: '/admin/flashcards', icon: <StyleIcon sx={{ fontSize: 24 }} />, label: 'Flashcard' },
        { href: '/admin/presentations', icon: <SlideshowIcon sx={{ fontSize: 24 }} />, label: 'Presentasi' },
        { href: '/admin/kanji', icon: <AutoStoriesIcon sx={{ fontSize: 24 }} />, label: 'Kanji Bank' },
        { href: '/admin/users', icon: <PeopleIcon sx={{ fontSize: 24 }} />, label: 'Data Murid' },
        { href: '/admin/analytics', icon: <ShowChartIcon sx={{ fontSize: 24 }} />, label: 'Analitik' },
        { href: '/admin/gamification', icon: <EmojiEventsIcon sx={{ fontSize: 24 }} />, label: 'Aturan Gim' },
    ];
    
    const userMenu = [
        { href: '/user/dashboard', icon: <DashboardIcon sx={{ fontSize: 24 }} />, label: 'Beranda' },
        { href: '/user/lessons', icon: <AutoStoriesIcon sx={{ fontSize: 24 }} />, label: 'Pelajaran' },
        { href: '/user/quizzes', icon: <HelpCenterIcon sx={{ fontSize: 24 }} />, label: 'Kuis' },
        { href: '/user/flashcards', icon: <StyleIcon sx={{ fontSize: 24 }} />, label: 'Review Kosakata' },
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
        { href: '/superadmin/payments', icon: <WorkspacePremiumIcon sx={{ fontSize: 24 }} />, label: 'Pemasukan' },
        { href: '/superadmin/activity', icon: <ReceiptLongOutlinedIcon sx={{ fontSize: 24 }} />, label: 'Aktivitas' },
        { href: '/superadmin/system', icon: <SettingsIcon sx={{ fontSize: 24 }} />, label: 'Sistem' },
    ];

    const isSuperadmin = user?.role === 'superadmin';
    const isAdmin = user?.role === 'admin' || isSuperadmin;
    const activeMenu = isSuperadmin ? superadminMenu : (isAdmin ? adminMenu : userMenu);

    return (
        <div className="min-h-screen bg-[#F8F9FA] dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col lg:flex-row w-full overflow-x-hidden transition-colors duration-300">
            
            {/* ====== HEADER MOBILE ====== */}
            <div className="lg:hidden flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-3 sticky top-0 z-30 shadow-sm transition-colors duration-300">
                <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setMobileOpen(true)} className="p-1 text-gray-500 hover:text-gray-900 focus:outline-none transition-colors rounded-lg hover:bg-gray-100">
                        <MenuIcon sx={{ fontSize: 26 }} />
                    </button>
                    <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 text-lg tracking-tight">Japanlingo</span>
                </div>
                <button type="button" onClick={() => setMobileOpen(true)} className="w-[34px] h-[34px] rounded-full bg-red-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                    {user?.username?.charAt(0).toUpperCase()}
                </button>
            </div>

            {/* ====== OVERLAY MOBILE ====== */}
            {mobileOpen && (
                <div 
                    className="fixed inset-0 bg-gray-900/40 backdrop-blur-[2px] z-40 lg:hidden transition-opacity"
                    onClick={() => setMobileOpen(false)}
                ></div>
            )}

            {/* ====== SIDEBAR VERTIKAL ====== */}
            <aside className={`flex flex-col bg-[#F2F3F5] dark:bg-gray-900 border-r border-[#E5E7EB] dark:border-gray-800 fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out ${isExpanded ? 'w-[240px]' : 'w-[88px]'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                
                <div className="p-3 flex flex-col items-center justify-center border-b border-gray-100 dark:border-gray-800 mb-4 gap-3">
                    <button 
                        type="button"
                        onClick={() => setMobileOpen(false)}
                        className="lg:hidden w-10 h-10 bg-red-50 rounded-full flex items-center justify-center shadow-sm text-red-600 border border-red-100 transition-colors mt-2"
                    >
                        <CloseIcon sx={{ fontSize: 22 }} />
                    </button>
                    <div 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`flex items-center hover:bg-white dark:hover:bg-gray-800 cursor-pointer transition-all hidden lg:flex ${isExpanded ? 'w-full py-2 px-1 gap-3 rounded-lg' : 'justify-center w-10 h-10 rounded-lg'}`}
                    >
                        <img src="/logo.png" alt="Logo" className={`${isExpanded ? 'w-10 h-10' : 'w-8 h-8'} object-contain transition-all duration-300`} />
                        {isExpanded && (
                            <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 text-lg tracking-tight animate-in fade-in slide-in-from-left-2 duration-300">
                                Japanlingo
                            </span>
                        )}
                    </div>
                </div>

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

                <div className={`p-3 flex flex-col ${isExpanded ? 'gap-2 px-4' : 'items-center'} mt-auto border-t border-gray-200/60 dark:border-gray-800 relative`} ref={menuRef}>
                    
                    {/* Lonceng Notifikasi */}
                    <button 
                        onClick={() => { setNotificationOpen(!notificationOpen); setProfileMenuOpen(false); }}
                        className={`w-full flex items-center ${isExpanded ? 'px-3 justify-start' : 'justify-center'} h-10 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200 transition-colors mb-2 relative group`}
                    >
                        <NotificationsOutlinedIcon sx={{ fontSize: 24 }} />
                        {isExpanded && <span className="ml-3 text-sm font-bold animate-in fade-in slide-in-from-left-2">Notifikasi</span>}
                        {unreadCount > 0 && (
                            <span className={`absolute ${isExpanded ? 'left-7 top-2' : 'top-1.5 right-1.5'} w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white dark:border-gray-900`}></span>
                        )}
                    </button>

                    {/* Popup Notifikasi */}
                    {notificationOpen && (
                        <div className="absolute bottom-[110px] left-3 right-3 w-auto bg-white dark:bg-gray-900 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.25)] border border-gray-100 dark:border-gray-800 overflow-hidden transform origin-bottom-left animate-in fade-in slide-in-from-bottom-5 duration-200 text-left lg:left-[96px] lg:right-auto lg:w-[320px] z-50">
                            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                <h3 className="font-black text-gray-900 dark:text-white">Notifikasi</h3>
                                {unreadCount > 0 && (
                                    <span onClick={handleMarkAllAsRead} className="text-[10px] text-blue-600 font-bold bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">Tandai semua dibaca</span>
                                )}
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                                {unreadCount === 0 ? (
                                    <div className="p-6 text-center text-gray-400 dark:text-gray-500 text-xs">
                                        Tidak ada notifikasi baru.
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <div key={notif.id} onClick={() => handleMarkAsRead(notif.id)} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-50 dark:border-gray-800 cursor-pointer transition-colors relative group">
                                            <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:scale-150 transition-transform"></div>
                                            <p className="text-xs font-bold text-gray-900 dark:text-white mb-1 pr-4">{notif.data.title || 'Pemberitahuan Sistem'}</p>
                                            <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">{notif.data.message || 'Silakan cek pembaruan terbaru di dashboard Anda.'}</p>
                                            <p className="text-[9px] font-black text-blue-500 dark:text-blue-400 mt-2">{notif.created_at}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Avatar Pemicu Popup */}
                    <button 
                        onClick={() => { setProfileMenuOpen(!profileMenuOpen); setNotificationOpen(false); }}
                        className={`w-full flex items-center ${isExpanded ? 'px-2 py-1.5 gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm' : 'justify-center h-[42px]'} rounded-2xl transition-all relative overflow-hidden ring-2 ${profileMenuOpen ? 'ring-gray-300 dark:ring-gray-600 ring-offset-2 dark:ring-offset-gray-900' : 'ring-transparent'}`}
                    >
                        <div className={`shrink-0 ${isExpanded ? 'w-8 h-8 text-sm' : 'w-[42px] h-[42px] text-xl'} rounded-full bg-red-600 text-white font-black flex items-center justify-center shadow-sm transition-all`}>
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        {isExpanded && (
                            <div className="flex-1 text-left truncate animate-in fade-in slide-in-from-left-2">
                                <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">{user?.username}</p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate mt-0.5">Pengaturan Akun</p>
                            </div>
                        )}
                    </button>

                    {profileMenuOpen && (
                        <div className="absolute bottom-16 left-3 right-3 w-auto bg-white dark:bg-gray-900 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.25)] border border-gray-100 dark:border-gray-800 overflow-hidden transform origin-bottom-left animate-in fade-in slide-in-from-bottom-5 duration-200 text-left lg:left-[96px] lg:right-auto lg:w-[300px]">
                            
                            <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400">{user?.username}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{user?.email}</p>
                                    </div>
                                </div>
                                <KeyboardArrowRightIcon sx={{ fontSize: 18 }} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                            </div>

                            <div className="h-px bg-gray-100 dark:bg-gray-800 w-full"></div>

                            <div className="py-2">
                                <Link href={user?.role === 'superadmin' ? route('superadmin.profile') : user?.role === 'admin' ? route('admin.profile') : route('profile.edit')} className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors">
                                    <div className="flex items-center gap-3"><SettingsOutlinedIcon sx={{ fontSize: 18 }} className="text-gray-500 dark:text-gray-400" /> Pengaturan profil</div>
                                </Link>
                            </div>

                            <div className="h-px bg-gray-100 dark:bg-gray-800 w-full my-1"></div>

                            <div className="py-1">
                                <Link 
                                    href={route('logout')} 
                                    method="post" 
                                    as="button"
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 font-bold"
                                >
                                    <LogoutOutlinedIcon sx={{ fontSize: 18 }} /> Keluar Akun
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            <div className={`flex-1 w-full transition-all duration-300 ${isExpanded ? 'lg:ml-[240px]' : 'lg:ml-[88px]'}`}>
                <main className="min-h-screen bg-white dark:bg-gray-950 shadow-[-5px_0_30px_-10px_rgba(0,0,0,0.05)] relative z-10 transition-colors duration-300">
                    {children}
                </main>
            </div>

            {toastAchievements.length > 0 && (
                <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 animate-in">
                    {toastAchievements.map((ach, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.25)] border-2 border-amber-300 p-5 flex items-center gap-4 min-w-[320px]" style={{ animation: `fade-in-slide-up 0.4s ${i * 0.15}s both` }}>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-3xl shadow-lg shadow-amber-400/30 shrink-0">
                                {ach.icon || '🏆'}
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Lencana Terbuka!</p>
                                <p className="font-black text-gray-900 text-sm">{ach.name}</p>
                                <p className="text-xs text-gray-500 font-medium">{ach.description}</p>
                                {ach.xp_reward > 0 && <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-1 inline-block">+{ach.xp_reward} XP</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

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
