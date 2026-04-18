import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Card from '@/Components/UI/Card';
import Badge from '@/Components/UI/Badge';
import Avatar from '@/Components/UI/Avatar';

export default function Users() {
    // Dummy Data
    const students = [
        { id: 1, name: 'Taro Yamada', email: 'taro.y@example.com', jlpt: 'N4', progress: 65, role: 'user', status: 'Active' },
        { id: 2, name: 'Sakura Tanaka', email: 's.tanaka@example.com', jlpt: 'N5', progress: 100, role: 'user', status: 'Active' },
        { id: 3, name: 'John Doe', email: 'john@domain.com', jlpt: 'N3', progress: 12, role: 'admin', status: 'Active' },
        { id: 4, name: 'Kenji Sato', email: 'kenjis@domain.jp', jlpt: 'N5', progress: 8, role: 'user', status: 'Suspended' },
    ];

    const [search, setSearch] = useState('');

    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(search.toLowerCase()) || 
        student.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Student Directory</h2>}>
            <Head title="Admin - Student Directory" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <Card className="!p-0 !rounded-2xl border-transparent shadow-sm overflow-hidden bg-white">
                        <div className="px-4 py-5 sm:px-6 lg:px-8 lg:py-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h3 className="font-bold text-gray-900 text-lg">Manage Students</h3>
                            <div className="relative w-full sm:w-auto">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full sm:w-80 h-10 bg-gray-50 border-transparent rounded-xl pl-10 pr-4 text-sm focus:bg-white focus:border-red-100 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[720px] text-left">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-4 py-4 sm:px-6 lg:px-8 text-xs font-bold uppercase text-gray-500 tracking-wider">Student</th>
                                        <th className="px-4 py-4 sm:px-6 lg:px-8 text-xs font-bold uppercase text-gray-500 tracking-wider">JLPT Progress</th>
                                        <th className="px-4 py-4 sm:px-6 lg:px-8 text-xs font-bold uppercase text-gray-500 tracking-wider">Role</th>
                                        <th className="px-4 py-4 sm:px-6 lg:px-8 text-xs font-bold uppercase text-gray-500 tracking-wider">Status</th>
                                        <th className="px-4 py-4 sm:px-6 lg:px-8 text-xs font-bold uppercase text-gray-500 tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredStudents.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-4 py-5 sm:px-6 lg:px-8">
                                                <div className="flex items-center gap-3">
                                                    <Avatar size="sm" />
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-gray-900 leading-none">{user.name}</p>
                                                        <p className="text-xs text-gray-500 mt-1 truncate">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-5 sm:px-6 lg:px-8">
                                                <div className="flex flex-col gap-1 w-32">
                                                    <div className="flex justify-between text-xs font-bold">
                                                        <span className="text-red-600">{user.jlpt}</span>
                                                        <span className="text-gray-500">{user.progress}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                        <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${user.progress}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-5 sm:px-6 lg:px-8">
                                                <Badge color={user.role === 'admin' ? 'purple' : 'gray'} className="!text-xs">
                                                    {user.role}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-5 sm:px-6 lg:px-8">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                    <span className={`text-xs font-bold ${user.status === 'Active' ? 'text-green-700' : 'text-red-700'}`}>
                                                        {user.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-5 sm:px-6 lg:px-8 text-right space-x-3 whitespace-nowrap">
                                                <button className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">Edit</button>
                                                {user.status === 'Active' ? (
                                                    <button className="text-xs font-bold text-red-600 hover:text-red-800 transition-colors">Suspend</button>
                                                ) : (
                                                    <button className="text-xs font-bold text-green-600 hover:text-green-800 transition-colors">Activate</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredStudents.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-8 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
                                                No students found matching your search.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
