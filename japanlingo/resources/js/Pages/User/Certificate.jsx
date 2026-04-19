import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { motion } from 'framer-motion';
import theme from '@/Components/theme/themes';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import LockIcon from '@mui/icons-material/Lock';
import DownloadIcon from '@mui/icons-material/Download';

export default function Certificate({ certificates = [] }) {
    return (
        <AuthenticatedLayout header={<h2 className="font-extrabold text-2xl text-gray-900 leading-tight tracking-tight">Koleksi Sertifikat</h2>}>
            <Head title="Sertifikat" />

            <div className="py-12 min-h-screen" style={{ backgroundColor: theme.landingHeroBg }}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl mb-12 relative overflow-hidden"
                    >
                        <div className="absolute -top-10 -right-10 opacity-10 pointer-events-none">
                            <WorkspacePremiumIcon sx={{ fontSize: 280 }} className="text-white" />
                        </div>
                        <div className="relative z-10">
                            <span className="inline-block py-1.5 px-4 rounded-full text-xs font-black tracking-widest uppercase mb-4 text-amber-900 bg-white/30 backdrop-blur-md">
                                HALL OF FAME
                            </span>
                            <h3 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight leading-none">
                                Bukti Keberhasilanmu 🏆
                            </h3>
                            <p className="text-amber-100 font-medium text-base sm:text-lg leading-relaxed max-w-2xl">
                                Selesaikan seluruh materi dan kuis untuk mendapatkan sertifikat resmi JapanLingo. Sertifikat akan terbit otomatis saat progresmu mencapai 100%.
                            </p>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {certificates.map((item, idx) => {
                            const isUnlocked = item.certificate !== null;
                            return (
                                <motion.div
                                    key={item.level_id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`rounded-[2rem] p-8 border-2 transition-all duration-300 ${isUnlocked
                                        ? 'bg-gradient-to-br from-amber-50 to-white border-amber-300 shadow-[0_15px_40px_-15px_rgba(217,170,0,0.3)] hover:-translate-y-2'
                                        : 'bg-slate-50 border-slate-200'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`p-4 rounded-2xl shadow-xl ${isUnlocked ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                            {isUnlocked ? <WorkspacePremiumIcon sx={{ fontSize: 28 }} /> : <LockIcon sx={{ fontSize: 28 }} />}
                                        </div>
                                        <span className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase tracking-widest ${isUnlocked ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                                            {isUnlocked ? 'Diperoleh' : 'Terkunci'}
                                        </span>
                                    </div>

                                    <h4 className={`text-2xl font-black mb-2 leading-tight ${isUnlocked ? 'text-gray-900' : 'text-slate-500'}`}>
                                        Sertifikat {item.level_name}
                                    </h4>
                                    <p className="text-gray-500 font-medium text-sm mb-6">
                                        {isUnlocked
                                            ? `Diterbitkan: ${new Date(item.certificate.issued_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`
                                            : `Selesaikan semua materi ${item.level_name} untuk membuka sertifikat ini.`
                                        }
                                    </p>

                                    <div className="mb-6">
                                        <div className="flex justify-between text-xs font-black mb-2">
                                            <span className={isUnlocked ? 'text-amber-700' : 'text-slate-500'}>Progress</span>
                                            <span className={isUnlocked ? 'text-amber-700' : 'text-slate-500'}>{item.progress}%</span>
                                        </div>
                                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-700 ${isUnlocked ? 'bg-gradient-to-r from-amber-400 to-amber-600' : 'bg-slate-300'}`}
                                                style={{ width: `${item.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {isUnlocked ? (
                                        <Link
                                            href={`/user/certificates/${item.certificate.id}/download`}
                                            className="w-full flex items-center justify-center gap-2 py-4 text-white font-black text-base tracking-wide rounded-2xl transition-all hover:brightness-110 active:translate-y-1 bg-gradient-to-br from-amber-500 to-amber-700"
                                            style={{ boxShadow: '0 6px 0 0 #b45309' }}
                                        >
                                            <DownloadIcon /> LIHAT SERTIFIKAT
                                        </Link>
                                    ) : (
                                        <button disabled className="w-full py-4 bg-slate-100 text-slate-400 font-black tracking-wide rounded-2xl cursor-not-allowed uppercase border border-slate-200">
                                            BELUM TERSEDIA
                                        </button>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
