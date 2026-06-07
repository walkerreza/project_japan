import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

import SecurityIcon from '@mui/icons-material/Security';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import EditIcon from '@mui/icons-material/Edit';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

export default function ProfilSuperAdmin() {
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
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Penampilan Root</h3>
                        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white">Mode Gelap (Dark Mode)</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Paksa atur visibilitas UI backend global.</p>
                            </div>
                            <div className="mt-4 md:mt-0 min-w-[200px]">
                                <select 
                                    value={themeMode}
                                    onChange={(e) => handleThemeChange(e.target.value)}
                                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl px-4 py-2.5 focus:ring-red-100 focus:border-red-300 font-bold text-sm cursor-pointer transition-colors"
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
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Autentikasi Utama</h3>
                        <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">Email Root</label>
                                <input type="email" defaultValue={user.email} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-700 dark:text-gray-300 focus:ring-red-100 focus:border-red-300 transition-colors" disabled />
                            </div>
                            <button className="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                Validasi Token
                            </button>
                        </div>
                    </div>
                    
                    <hr className="border-gray-100 dark:border-gray-800" />

                    {/* Kata Sandi */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Master Password Override</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">Sandi Lama Root</label>
                                <input type="password" placeholder="••••••••" className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:ring-red-100 focus:border-red-300 transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">Sandi Baru</label>
                                <input type="password" placeholder="Minimal 12 karakter khusus" className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:ring-red-100 focus:border-red-300 transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">Konfirmasi</label>
                                <input type="password" placeholder="Konfirmasi sandi root" className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:ring-red-100 focus:border-red-300 transition-colors" />
                            </div>
                        </div>
                        <button className="px-6 py-3 rounded-xl font-bold text-white dark:text-gray-900 bg-red-600 dark:bg-red-400 hover:bg-red-700 dark:hover:bg-red-500 transition-colors shadow-sm">
                            Paksakan Perbarui Sandi
                        </button>
                    </div>

                </motion.div>
            );
        }

        if (activeTab === 'security') {
            return (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Protokol Keamanan Level Sistem</h3>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/10 mt-6 p-6 rounded-2xl border border-red-100 dark:border-red-900/30 transition-colors">
                        <h3 className="text-lg font-bold text-red-900 dark:text-red-400 mb-2">Self-Destruct & Maintenance</h3>
                        <p className="text-sm text-red-700 dark:text-red-300 mb-4">Opsi ini hanya diperuntukkan untuk superadmin. Jika server dalam keadaan darurat, Anda dapat mengaktifkan mode pemeliharaan paksa dari profil Anda.</p>
                        <button className="px-6 py-3 rounded-xl font-black text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 bg-white dark:bg-transparent hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-300 transition-colors shadow-sm">
                            Aktifkan Mode Maintenance
                        </button>
                    </div>
                </motion.div>
            );
        }
    };

    return (
        <AuthenticatedLayout header={false}>
            <Head title="Superadmin Profil" />

            <div className="min-h-screen bg-[#F8F9FA] dark:bg-gray-950 pb-24 transition-colors duration-300">
                {/* Header Banner - Warna gelap dan tegas untuk Superadmin */}
                <div className={`relative w-full h-64 md:h-80 bg-gradient-to-r from-gray-900 to-red-950`}>
                    <div className="absolute inset-0 bg-black/40"></div>
                    
                    {/* Foto Profil Avatar Melayang */}
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-16 md:bottom-auto md:top-full md:-translate-y-1/2 md:left-16 lg:left-24 flex items-end">
                        <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-white dark:bg-gray-900 p-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] transition-colors">
                            <div className="w-full h-full rounded-full flex items-center justify-center text-4xl font-black text-white relative overflow-hidden group cursor-pointer bg-gradient-to-br from-red-600 to-red-900">
                                {user.username?.charAt(0).toUpperCase()}
                                <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition-all">
                                    <EditIcon sx={{ color: 'white' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 md:mt-12">
                    {/* Block Nama Pengguna & Status Superadmin */}
                    <div className="md:ml-40 lg:ml-56 mb-10 flex flex-col md:flex-row md:items-center gap-4 py-4 md:py-0">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                                {user.username}
                                <VerifiedUserIcon sx={{ color: '#ef4444' }} titleAccess="Sistem Terverifikasi" />
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">Berasal sejak Root Genesis</p>
                        </div>
                        <div className="md:ml-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 font-black rounded-xl text-sm shadow-sm hover:scale-105 transition-transform cursor-default">
                                🛡️ Root Superadmin
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
                            <ManageAccountsIcon sx={{ fontSize: 18, marginRight: 0.5, marginBottom: 0.5 }} /> SETELAN ROOT
                        </button>
                        <button 
                            onClick={() => setActiveTab('security')}
                            className={`w-full sm:w-auto px-5 py-3 rounded-t-2xl font-black text-sm tracking-wide transition-all ${
                                activeTab === 'security' ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-b-white dark:border-b-gray-900 border-gray-200/60 dark:border-gray-800 translate-y-[2px]' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'
                            }`}
                        >
                            <SecurityIcon sx={{ fontSize: 18, marginRight: 0.5, marginBottom: 0.5 }} /> PROTOKOL KEAMANAN
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
