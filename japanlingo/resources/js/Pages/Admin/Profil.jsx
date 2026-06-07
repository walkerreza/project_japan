import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import theme from '@/Components/theme/themes';

import PersonIcon from '@mui/icons-material/Person';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import EditIcon from '@mui/icons-material/Edit';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

export default function ProfilAdmin() {
    const { user } = usePage().props.auth;
    const [activeTab, setActiveTab] = useState('settings');
    const [themeMode, setThemeMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'system';
        }
        return 'system';
    });

    const handleThemeChange = (newTheme) => {
        setThemeMode(newTheme);
        localStorage.setItem('theme', newTheme);
        window.dispatchEvent(new Event('storage'));
    };

    const renderTabContent = () => {
        if (activeTab === 'settings') {
            return (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-8">
                    {/* Tampilan (Dark Mode) */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Penampilan</h3>
                        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white">Mode Gelap (Dark Mode)</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Sesuaikan tema dengan sistem Anda.</p>
                            </div>
                            <div className="mt-4 md:mt-0 min-w-[200px]">
                                <select 
                                    value={themeMode}
                                    onChange={(e) => handleThemeChange(e.target.value)}
                                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl px-4 py-2.5 focus:ring-blue-100 focus:border-blue-300 font-bold text-sm cursor-pointer transition-colors"
                                >
                                    <option value="system">Sistem Default</option>
                                    <option value="light">Terang</option>
                                    <option value="dark">Gelap</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <hr className="border-gray-100 dark:border-gray-800" />

                    {/* Alamat Email */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Informasi Kontak Dasar</h3>
                        <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">Alamat Email</label>
                                <input type="email" defaultValue={user.email} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-700 dark:text-gray-300 focus:ring-blue-100 focus:border-blue-300 transition-colors" disabled />
                            </div>
                            <button className="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                Ubah Email
                            </button>
                        </div>
                    </div>
                    
                    <hr className="border-gray-100 dark:border-gray-800" />

                    {/* Kata Sandi */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Keamanan Kata Sandi</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">Sandi Lama</label>
                                <input type="password" placeholder="••••••••" className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:ring-blue-100 focus:border-blue-300 transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">Sandi Baru</label>
                                <input type="password" placeholder="Minimal 8 karakter" className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:ring-blue-100 focus:border-blue-300 transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">Ulangi Sandi Baru</label>
                                <input type="password" placeholder="Konfirmasi sandi" className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:ring-blue-100 focus:border-blue-300 transition-colors" />
                            </div>
                        </div>
                        <button className="px-6 py-3 rounded-xl font-bold text-white dark:text-gray-900 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-white transition-colors shadow-sm">
                            Perbarui Sandi
                        </button>
                    </div>

                </motion.div>
            );
        }

        if (activeTab === 'activity') {
            return (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Aktivitas Terbaru Saya</h3>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 mt-6 p-4 rounded-xl text-center text-xs text-gray-400 dark:text-gray-500 font-medium border border-dashed border-gray-200 dark:border-gray-700 transition-colors">
                        * Modul log aktivitas untuk profil Admin saat ini belum diaktifkan. Log Anda terekam langsung di dashboard sistem Superadmin.
                    </div>
                </motion.div>
            );
        }
    };

    return (
        <AuthenticatedLayout header={false}>
            <Head title="Admin Profil" />

            <div className="min-h-screen bg-[#F8F9FA] dark:bg-gray-950 pb-24 transition-colors duration-300">
                {/* Header Banner - Warna netral kebiruan untuk Admin */}
                <div className={`relative w-full h-64 md:h-80 bg-gradient-to-r from-slate-700 to-blue-900`}>
                    <div className="absolute inset-0 bg-black/20"></div>
                    
                    {/* Foto Profil Avatar Melayang */}
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-16 md:bottom-auto md:top-full md:-translate-y-1/2 md:left-16 lg:left-24 flex items-end">
                        <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-white dark:bg-gray-900 p-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] transition-colors">
                            <div className="w-full h-full rounded-full flex items-center justify-center text-4xl font-black text-white relative overflow-hidden group cursor-pointer bg-gradient-to-br from-blue-500 to-blue-800">
                                {user.username?.charAt(0).toUpperCase()}
                                <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition-all">
                                    <EditIcon sx={{ color: 'white' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 md:mt-12">
                    {/* Block Nama Pengguna & Status Admin */}
                    <div className="md:ml-40 lg:ml-56 mb-10 flex flex-col md:flex-row md:items-center gap-4 py-4 md:py-0">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                                {user.username}
                                <VerifiedUserIcon sx={{ color: '#3b82f6' }} titleAccess="Sistem Terverifikasi" />
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">Berasal sejak Sep 2026</p>
                        </div>
                        <div className="md:ml-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400 font-black rounded-xl text-sm shadow-sm hover:scale-105 transition-transform cursor-default">
                                ⚙️ Staff Admin
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs Interaktif */}
                    <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-gray-800 pb-2">
                        <button 
                            onClick={() => setActiveTab('settings')}
                            className={`w-full sm:w-auto px-5 py-3 rounded-t-2xl font-black text-sm tracking-wide transition-all ${
                                activeTab === 'settings' ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-b-white dark:border-b-gray-900 border-gray-200/60 dark:border-gray-800 translate-y-[2px]' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'
                            }`}
                        >
                            <ManageAccountsIcon sx={{ fontSize: 18, marginRight: 0.5, marginBottom: 0.5 }} /> PENGATURAN
                        </button>
                        <button 
                            onClick={() => setActiveTab('activity')}
                            className={`w-full sm:w-auto px-5 py-3 rounded-t-2xl font-black text-sm tracking-wide transition-all ${
                                activeTab === 'activity' ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-b-white dark:border-b-gray-900 border-gray-200/60 dark:border-gray-800 translate-y-[2px]' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'
                            }`}
                        >
                            <PersonIcon sx={{ fontSize: 18, marginRight: 0.5, marginBottom: 0.5 }} /> LOG AKTIVITAS
                        </button>
                    </div>

                    {/* Rendering Tab Konten Animasi */}
                    <AnimatePresence mode="wait">
                        {renderTabContent()}
                    </AnimatePresence>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
