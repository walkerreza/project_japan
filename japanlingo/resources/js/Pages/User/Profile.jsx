import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import theme from '@/Components/theme/themes';

import PersonIcon from '@mui/icons-material/Person';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import EditIcon from '@mui/icons-material/Edit';
import DiamondIcon from '@mui/icons-material/Diamond';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

// Dummy Mock Data Transaksi
const MOCK_INVOICES = [
    { id: 'INV-JPN-102', date: '10 Nov 2026', plan: 'Quarterly Premium', price: 'Rp 299.000', status: 'Success' },
    { id: 'INV-JPN-101', date: '08 Agu 2026', plan: 'Monthly Premium', price: 'Rp 119.000', status: 'Success' },
    { id: 'INV-JPN-099', date: '01 Agu 2026', plan: 'Monthly Premium', price: 'Rp 119.000', status: 'Failed' },
];

export default function Profile() {
    const { user } = usePage().props.auth;
    const [activeTab, setActiveTab] = useState('stats');

    const renderTabContent = () => {
        if (activeTab === 'stats') {
            return (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                            <h4 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Total XP Terkumpul</h4>
                            <span className="text-4xl font-black text-amber-500">12,450</span>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                            <h4 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Peringkat Liga</h4>
                            <div className="flex items-center gap-2">
                                <span className="text-4xl font-black text-purple-600">Amethyst</span>
                                <DiamondIcon sx={{ fontSize: 32, color: '#9333ea' }} />
                            </div>
                        </div>
                    </div>
                </motion.div>
            );
        }

        if (activeTab === 'settings') {
            return (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
                    {/* Alamat Email */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Informasi Kontak Dasar</h3>
                        <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-gray-500 mb-1">Alamat Email</label>
                                <input type="email" defaultValue={user.email} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:ring-red-100 focus:border-red-300" disabled />
                            </div>
                            <button className="px-6 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                                Ubah Email
                            </button>
                        </div>
                    </div>
                    
                    <hr className="border-gray-100" />

                    {/* Kata Sandi */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Keamanan Kata Sandi</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-500 mb-1">Sandi Lama</label>
                                <input type="password" placeholder="••••••••" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-red-100 focus:border-red-300" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-500 mb-1">Sandi Baru</label>
                                <input type="password" placeholder="Minimal 8 karakter" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-red-100 focus:border-red-300" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-500 mb-1">Ulangi Sandi Baru</label>
                                <input type="password" placeholder="Konfirmasi sandi" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-red-100 focus:border-red-300" />
                            </div>
                        </div>
                        <button className="px-6 py-3 rounded-xl font-bold text-white bg-gray-900 hover:bg-gray-800 transition-colors shadow-sm">
                            Perbarui Sandi
                        </button>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Zona Bahaya */}
                    <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                        <h3 className="text-lg font-bold text-red-900 mb-2">Zona Berbahaya</h3>
                        <p className="text-sm text-red-700 mb-4">Jika Anda menghapus akun ini, seluruh rekam jejak XP, Sertifikat, dan langganan akan hangus secara permanen. Tidak dapat dipulihkan.</p>
                        <button className="px-6 py-3 rounded-xl font-bold text-red-600 border border-red-200 bg-white hover:bg-red-50 hover:text-red-700 transition-colors shadow-sm">
                            Hapus Akun Saya
                        </button>
                    </div>
                </motion.div>
            );
        }

        if (activeTab === 'billing') {
            return (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Riwayat Tagihan & Langganan</h3>
                    </div>

                    {/* Tabel Transaksi Desktop */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-gray-100">
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tanggal</th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">ID Faktur</th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tipe Paket</th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Nominal Tagihan</th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status Pembayaran</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_INVOICES.map((inv, idx) => (
                                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-5 px-4 text-sm font-medium text-gray-600">{inv.date}</td>
                                        <td className="py-5 px-4 text-sm font-bold text-blue-600 underline cursor-pointer">{inv.id}</td>
                                        <td className="py-5 px-4 text-sm font-bold text-gray-900">{inv.plan}</td>
                                        <td className="py-5 px-4 text-sm font-bold text-gray-900">{inv.price}</td>
                                        <td className="py-5 px-4">
                                            {inv.status === 'Success' ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-black uppercase tracking-widest">
                                                    Berhasil
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-black uppercase tracking-widest">
                                                    Ditolak
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Placeholder Kosong saat Database Belum Di-Migrate */}
                    <div className="bg-gray-50 mt-6 p-4 rounded-xl text-center text-xs text-gray-400 font-medium border border-dashed border-gray-200">
                        * Data tagihan di atas sementara masih menggunakan visual mock (*dummy*) karena fungsionalitas Backend Superadmin Pembayaran sedang dikembangkan.
                    </div>
                </motion.div>
            );
        }
    };

    return (
        <AuthenticatedLayout header={false}>
            <Head title="Profil Pengguna" />

            <div className="min-h-screen bg-[#F8F9FA] pb-24">
                {/* Header Banner Kolosal - Dinamis Tema Gamifikasi */}
                <div className={`relative w-full h-64 md:h-80 bg-gradient-to-r ${theme.ctaBg}`}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    
                    {/* Foto Profil Avatar Melayang */}
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-16 md:bottom-auto md:top-full md:-translate-y-1/2 md:left-16 lg:left-24 flex items-end">
                        <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-white p-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)]">
                            <div className="w-full h-full rounded-full flex items-center justify-center text-4xl font-black text-white bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden group cursor-pointer">
                                {user.username?.charAt(0).toUpperCase()}
                                <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition-all">
                                    <EditIcon sx={{ color: 'white' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 md:mt-12">
                    {/* Block Nama Pengguna & Status Premium */}
                    <div className="md:ml-40 lg:ml-56 mb-10 flex flex-col md:flex-row md:items-center gap-4 py-4 md:py-0">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                                {user.username}
                                <VerifiedUserIcon sx={{ color: '#0ea5e9' }} titleAccess="Terverifikasi" />
                            </h1>
                            <p className="text-gray-500 font-medium">Berasal sejak Sep 2026</p>
                        </div>
                        <div className="md:ml-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 border border-yellow-200 text-yellow-700 font-bold rounded-xl text-sm shadow-sm hover:scale-105 transition-transform cursor-pointer">
                                👑 Sabuk Premium (Aktif)
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs Interaktif */}
                    <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-2">
                        <button 
                            onClick={() => setActiveTab('stats')}
                            className={`w-full sm:w-auto px-5 py-3 rounded-t-2xl font-black text-sm tracking-wide transition-all ${
                                activeTab === 'stats' ? 'bg-white text-gray-900 border-2 border-b-white border-gray-200/60 translate-y-[2px]' : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
                            }`}
                        >
                            <PersonIcon sx={{ fontSize: 18, marginRight: 0.5, marginBottom: 0.5 }} /> INFOGRAFIS
                        </button>
                        <button 
                            onClick={() => setActiveTab('settings')}
                            className={`w-full sm:w-auto px-5 py-3 rounded-t-2xl font-black text-sm tracking-wide transition-all ${
                                activeTab === 'settings' ? 'bg-white text-gray-900 border-2 border-b-white border-gray-200/60 translate-y-[2px]' : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
                            }`}
                        >
                            <ManageAccountsIcon sx={{ fontSize: 18, marginRight: 0.5, marginBottom: 0.5 }} /> PENGATURAN
                        </button>
                        <button 
                            onClick={() => setActiveTab('billing')}
                            className={`w-full sm:w-auto px-5 py-3 rounded-t-2xl font-black text-sm tracking-wide transition-all ${
                                activeTab === 'billing' ? 'bg-white text-gray-900 border-2 border-b-white border-gray-200/60 translate-y-[2px]' : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
                            }`}
                        >
                            <ReceiptLongIcon sx={{ fontSize: 18, marginRight: 0.5, marginBottom: 0.5 }} /> RIWAYAT PEMBELIAN
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
