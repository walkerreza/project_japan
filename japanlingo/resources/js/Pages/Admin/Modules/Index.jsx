import React, { useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';

export default function ModulesIndex({ modules, levels = [], filters = {} }) {
    const [filterLevel, setFilterLevel] = useState('all');
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [expandedModules, setExpandedModules] = useState({});
    const [showModuleModal, setShowModuleModal] = useState(false);
    const [editingModule, setEditingModule] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        level_id: '',
        title: '',
        week_number: '',
        description: '',
    });

    const moduleItems = modules?.data || modules || [];

    const filteredModules = filterLevel === 'all'
        ? moduleItems
        : moduleItems.filter(m => m.level?.id == filterLevel);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.modules.index'), { search: searchQuery }, { preserveState: true });
    };

    const toggleExpand = (id) => {
        setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const openCreateModal = () => {
        reset();
        setEditingModule(null);
        setShowModuleModal(true);
    };

    const openEditModal = (module) => {
        setEditingModule(module);
        setData({
            level_id: module.level?.id || '',
            title: module.title,
            week_number: module.week_number,
            description: module.description || '',
        });
        setShowModuleModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingModule) {
            router.put(route('admin.modules.update', editingModule.id), data, {
                onSuccess: () => { setShowModuleModal(false); reset(); },
            });
        } else {
            router.post(route('admin.modules.store'), data, {
                onSuccess: () => { setShowModuleModal(false); reset(); },
            });
        }
    };

    const handleDelete = (module) => {
        if (module.lesson_count > 0) {
            alert(`Modul tidak dapat dihapus karena masih memiliki ${module.lesson_count} pelajaran`);
            return;
        }
        setDeleteConfirm(module);
    };

    const confirmDelete = () => {
        router.delete(route('admin.modules.destroy', deleteConfirm.id), {
            onSuccess: () => setDeleteConfirm(null),
        });
    };

    const levelColors = { N5: 'bg-green-100 text-green-700 dark:text-green-400', N4: 'bg-blue-100 text-blue-700 dark:text-blue-400', N3: 'bg-yellow-100 text-yellow-700 dark:text-yellow-400', N2: 'bg-orange-100 text-orange-700', N1: 'bg-red-100 text-red-700 dark:text-red-400' };

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Modul - Japanlingo" />
            <div className="min-h-screen bg-[#F8F9FB] font-sans">

                {/* Header */}
                <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#E64A19] rounded-xl flex items-center justify-center text-white">
                            <MenuBookIcon sx={{ fontSize: 20 }} />
                        </div>
                        <div>
                            <h1 className="text-sm font-black text-gray-900 dark:text-white">Manajemen Modul & Materi</h1>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">{modules.length} Modul tersedia</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <form onSubmit={handleSearch} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2">
                            <input 
                                type="text"
                                placeholder="Cari Modul..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-transparent border-none focus:ring-0 outline-none w-32 md:w-48"
                            />
                        </form>
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2">
                            <FilterListIcon sx={{ fontSize: 16 }} className="text-gray-400 dark:text-gray-500" />
                            <select
                                value={filterLevel}
                                onChange={e => setFilterLevel(e.target.value)}
                                className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-transparent border-none focus:ring-0 outline-none"
                            >
                                <option value="all">Semua Level</option>
                                {levels.map(l => <option key={l.id} value={l.id}>{l.level_name}</option>)}
                            </select>
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="bg-[#E64A19] hover:bg-[#D84315] text-white rounded-xl px-5 h-10 text-sm font-bold flex items-center gap-2 shadow-md shadow-orange-500/20 transition-colors"
                        >
                            <AddIcon sx={{ fontSize: 18 }} />
                            Tambah Modul
                        </button>
                    </div>
                </header>

                <main className="max-w-5xl mx-auto p-6 space-y-4">
                    {filteredModules.map(module => (
                        <div key={module.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-4 p-5">
                                <button onClick={() => toggleExpand(module.id)} className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:text-gray-300 transition-colors">
                                    {expandedModules[module.id] ? <ExpandMoreIcon sx={{ fontSize: 22 }} /> : <ChevronRightIcon sx={{ fontSize: 22 }} />}
                                </button>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${levelColors[module.level?.level_name] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                                            {module.level?.level_name || '—'}
                                        </span>
                                        <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">Minggu {module.week_number}</span>
                                    </div>
                                    <h2 className="text-base font-black text-gray-900 dark:text-white truncate">{module.title}</h2>
                                </div>
                                <div className="flex items-center gap-4 shrink-0">
                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 px-3 py-1 rounded-full">
                                        {module.lesson_count} Pelajaran
                                    </span>
                                    <button onClick={() => openEditModal(module)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:bg-blue-900/20">
                                        <EditOutlinedIcon sx={{ fontSize: 18 }} />
                                    </button>
                                    <button onClick={() => handleDelete(module)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-red-600 dark:text-red-400 hover:bg-red-50 dark:bg-red-900/20">
                                        <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                                    </button>
                                </div>
                            </div>

                            {expandedModules[module.id] && (
                                <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                                    <div className="px-5 py-3 flex items-center justify-between">
                                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Daftar Pelajaran</p>
                                        <Link
                                            href={route('admin.modules.builder', module.id)}
                                            className="text-xs font-bold text-[#E64A19] hover:underline flex items-center gap-1"
                                        >
                                            <AddIcon sx={{ fontSize: 14 }} />
                                            Kelola Materi
                                        </Link>
                                    </div>
                                    <div className="px-5 pb-4 space-y-2">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                            {module.lesson_count} pelajaran tersedia.{' '}
                                            <Link href={route('admin.modules.builder', module.id)} className="text-[#E64A19] font-bold hover:underline">
                                                Buka Builder Materi →
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Pagination Links */}
                    {modules?.links && modules.links.length > 3 && (
                        <div className="flex justify-center gap-2 mt-8">
                            {modules.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${link.active ? 'bg-[#E64A19] text-white shadow-md' : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:bg-gray-800/50'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Modal & Delete Confirm (Sama seperti sebelumnya) */}
            {showModuleModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white">
                                {editingModule ? 'Edit Modul' : 'Tambah Modul Baru'}
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Level JLPT <span className="text-red-500">*</span></label>
                                <select
                                    value={data.level_id}
                                    onChange={e => setData('level_id', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E64A19]/30 focus:border-[#E64A19]"
                                    required
                                >
                                    <option value="">Pilih Level</option>
                                    {levels.map(l => <option key={l.id} value={l.id}>{l.level_name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Judul Modul <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E64A19]/30 focus:border-[#E64A19]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Nomor Minggu <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    min="1"
                                    value={data.week_number}
                                    onChange={e => setData('week_number', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E64A19]/30 focus:border-[#E64A19]"
                                    required
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModuleModal(false)} className="flex-1 h-11 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-600 dark:text-gray-400">Batal</button>
                                <button type="submit" disabled={processing} className="flex-1 h-11 rounded-xl bg-[#E64A19] text-white text-sm font-bold">{processing ? 'Menyimpan...' : 'Simpan'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <DeleteOutlineIcon sx={{ fontSize: 28 }} className="text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="text-base font-black text-gray-900 dark:text-white mb-2">Hapus Modul?</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Apakah Anda yakin ingin menghapus modul <strong>"{deleteConfirm.title}"</strong>?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 h-11 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-600 dark:text-gray-400">Batal</button>
                            <button onClick={confirmDelete} className="flex-1 h-11 rounded-xl bg-red-600 text-white text-sm font-bold">Hapus</button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
