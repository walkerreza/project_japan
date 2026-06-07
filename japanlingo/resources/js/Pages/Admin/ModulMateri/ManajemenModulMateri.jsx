import React, { useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SearchIcon from '@mui/icons-material/Search';

function StatusBadge({ status }) {
    const isDraft = status === 'draft';

    return (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wider ${isDraft ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'}`}>
            {status || 'published'}
        </span>
    );
}

function LevelBadge({ level }) {
    return (
        <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-black text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {level?.level_name || '-'}
        </span>
    );
}

export default function ModulesIndex({ modules, levels = [], filters = {} }) {
    const [filterLevel, setFilterLevel] = useState('all');
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [showModuleModal, setShowModuleModal] = useState(false);
    const [editingModule, setEditingModule] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const { data, setData, processing, reset } = useForm({
        level_id: '',
        title: '',
        week_number: '',
        description: '',
        status: 'published',
    });

    const moduleItems = modules?.data || modules || [];
    const filteredModules = filterLevel === 'all'
        ? moduleItems
        : moduleItems.filter((module) => module.level?.id == filterLevel);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.modules.index'), { search: searchQuery }, { preserveState: true });
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
            status: module.status || 'published',
        });
        setShowModuleModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const options = { onSuccess: () => { setShowModuleModal(false); reset(); } };

        if (editingModule) {
            router.put(route('admin.modules.update', editingModule.id), data, options);
            return;
        }

        router.post(route('admin.modules.store'), data, options);
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

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Modul - Japanlingo" />

            <div className="min-h-screen bg-[#F8F9FB] dark:bg-gray-950">
                <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                    <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                            <div className="flex items-start gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E64A19] text-white">
                                    <MenuBookIcon sx={{ fontSize: 22 }} />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-[0.28em] text-[#E64A19]">Content Admin</p>
                                    <h1 className="mt-1 text-2xl font-black text-gray-900 dark:text-white">Manajemen Modul & Materi</h1>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{filteredModules.length} modul ditampilkan dari {moduleItems.length} total data halaman ini.</p>
                                </div>
                            </div>

                            <button
                                onClick={openCreateModal}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#E64A19] px-5 text-sm font-black text-white shadow-sm shadow-orange-500/20 transition-colors hover:bg-[#D84315]"
                            >
                                <AddIcon sx={{ fontSize: 18 }} />
                                Tambah Modul
                            </button>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
                            <form onSubmit={handleSearch} className="relative">
                                <SearchIcon sx={{ fontSize: 18 }} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari modul..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm font-medium text-gray-700 outline-none transition focus:border-[#E64A19] focus:bg-white focus:ring-4 focus:ring-orange-500/10 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300 dark:focus:bg-gray-900"
                                />
                            </form>
                            <select
                                value={filterLevel}
                                onChange={(e) => setFilterLevel(e.target.value)}
                                className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-bold text-gray-700 outline-none focus:border-[#E64A19] focus:ring-4 focus:ring-orange-500/10 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300"
                            >
                                <option value="all">Semua Level</option>
                                {levels.map((level) => <option key={level.id} value={level.id}>{level.level_name}</option>)}
                            </select>
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="hidden overflow-x-auto lg:block">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs font-black uppercase tracking-wider text-gray-400 dark:bg-gray-800/50">
                                    <tr>
                                        <th className="px-6 py-4">Modul</th>
                                        <th className="px-6 py-4">Level</th>
                                        <th className="px-6 py-4">Minggu</th>
                                        <th className="px-6 py-4">Pelajaran</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {filteredModules.map((module) => (
                                        <tr key={module.id} className="transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-800/40">
                                            <td className="px-6 py-5">
                                                <p className="font-black text-gray-900 dark:text-white">{module.title}</p>
                                                <p className="mt-1 line-clamp-1 text-sm text-gray-500 dark:text-gray-400">{module.description || 'Tidak ada deskripsi.'}</p>
                                            </td>
                                            <td className="px-6 py-5"><LevelBadge level={module.level} /></td>
                                            <td className="px-6 py-5 text-sm font-bold text-gray-600 dark:text-gray-300">Minggu {module.week_number}</td>
                                            <td className="px-6 py-5 text-sm font-bold text-gray-600 dark:text-gray-300">{module.lesson_count} lesson</td>
                                            <td className="px-6 py-5"><StatusBadge status={module.status} /></td>
                                            <td className="px-6 py-5">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={route('admin.modules.builder', module.id)} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-black text-[#E64A19] transition-colors hover:border-[#E64A19] dark:border-gray-700">
                                                        Builder
                                                    </Link>
                                                    <button onClick={() => openEditModal(module)} className="rounded-lg border border-gray-200 p-2 text-gray-500 transition-colors hover:border-blue-200 hover:text-blue-600 dark:border-gray-700">
                                                        <EditOutlinedIcon sx={{ fontSize: 17 }} />
                                                    </button>
                                                    <button onClick={() => handleDelete(module)} className="rounded-lg border border-gray-200 p-2 text-gray-500 transition-colors hover:border-red-200 hover:text-red-600 dark:border-gray-700">
                                                        <DeleteOutlineIcon sx={{ fontSize: 17 }} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="space-y-3 p-4 lg:hidden">
                            {filteredModules.map((module) => (
                                <div key={module.id} className="rounded-2xl border border-gray-100 p-4 dark:border-gray-800">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <h2 className="truncate text-base font-black text-gray-900 dark:text-white">{module.title}</h2>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{module.lesson_count} lesson - Minggu {module.week_number}</p>
                                        </div>
                                        <StatusBadge status={module.status} />
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <LevelBadge level={module.level} />
                                    </div>
                                    <div className="mt-4 flex flex-wrap justify-end gap-2">
                                        <Link href={route('admin.modules.builder', module.id)} className="rounded-lg bg-[#E64A19] px-3 py-2 text-xs font-black text-white">Builder</Link>
                                        <button onClick={() => openEditModal(module)} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-black text-gray-600 dark:border-gray-700 dark:text-gray-300">Edit</button>
                                        <button onClick={() => handleDelete(module)} className="rounded-lg border border-red-100 px-3 py-2 text-xs font-black text-red-600 dark:border-red-900/40">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredModules.length === 0 && (
                            <div className="px-6 py-16 text-center text-sm font-bold text-gray-400">Belum ada modul yang cocok.</div>
                        )}
                    </section>

                    {modules?.links && modules.links.length > 3 && (
                        <div className="flex flex-wrap justify-center gap-2">
                            {modules.links.map((link, index) => (
                                <Link
                                    key={`${link.label}-${index}`}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${link.active ? 'bg-[#E64A19] text-white shadow-md' : 'border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400'} ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {showModuleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
                        <div className="border-b border-gray-100 p-6 dark:border-gray-800">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white">{editingModule ? 'Edit Modul' : 'Tambah Modul Baru'}</h3>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4 p-6">
                            <div>
                                <label className="mb-1.5 block text-sm font-bold text-gray-700 dark:text-gray-300">Level JLPT</label>
                                <select value={data.level_id} onChange={(e) => setData('level_id', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white" required>
                                    <option value="">Pilih Level</option>
                                    {levels.map((level) => <option key={level.id} value={level.id}>{level.level_name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-bold text-gray-700 dark:text-gray-300">Judul Modul</label>
                                <input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white" required />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-bold text-gray-700 dark:text-gray-300">Nomor Minggu</label>
                                <input type="number" min="1" value={data.week_number} onChange={(e) => setData('week_number', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white" required />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-bold text-gray-700 dark:text-gray-300">Status Publish</label>
                                <select value={data.status} onChange={(e) => setData('status', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white">
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModuleModal(false)} className="h-11 flex-1 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 dark:border-gray-700 dark:text-gray-400">Batal</button>
                                <button type="submit" disabled={processing} className="h-11 flex-1 rounded-xl bg-[#E64A19] text-sm font-bold text-white">{processing ? 'Menyimpan...' : 'Simpan'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl dark:bg-gray-900">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                            <DeleteOutlineIcon sx={{ fontSize: 28 }} className="text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="mb-2 text-base font-black text-gray-900 dark:text-white">Hapus Modul?</h3>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Apakah Anda yakin ingin menghapus modul <strong>"{deleteConfirm.title}"</strong>?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="h-11 flex-1 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 dark:border-gray-700 dark:text-gray-400">Batal</button>
                            <button onClick={confirmDelete} className="h-11 flex-1 rounded-xl bg-red-600 text-sm font-bold text-white">Hapus</button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
