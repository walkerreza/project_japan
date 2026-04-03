import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import StatCard from '@/Components/Dashboard/StatCard';
import ChartCard from '@/Components/Dashboard/ChartCard';
import Card from '@/Components/UI/Card';

export default function AdminDashboard({ 
    totalModules = 0,
    totalLessons = 0,
    totalQuizzes = 0,
    totalQuestions = 0,
    totalUsers = 0,
    activeUsers = 0,
}) {
    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Overview</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Platform Overview */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900 border-l-4 border-red-600 pl-3">Performance Overview</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard title="Total Murid" value={totalUsers.toLocaleString()} icon="👥" />
                            <StatCard title="Total Modul" value={totalModules} icon="📦" />
                            <StatCard title="Total Pelajaran" value={totalLessons} icon="📖" />
                            <StatCard title="Total Pertanyaan" value={totalQuestions} icon="❓" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* User Growth Chart */}
                        <ChartCard title="Student Growth (Last 30 Days)">
                            <div className="h-64 flex items-end justify-between px-4 pb-2 space-x-2">
                                {/* Dummy bars for visual */}
                                {[20, 30, 25, 40, 45, 60, 50, 75, 70, 95].map((h, i) => (
                                    <div key={i} className="w-full flex flex-col justify-end gap-1">
                                        <div className="w-full bg-red-200 rounded-t" style={{ height: `${h * 0.3}%` }}></div>
                                        <div className="w-full bg-red-600 rounded-t" style={{ height: `${h * 0.7}%` }}></div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-600 rounded"></div> New Enrollments</span>
                                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-200 rounded"></div> Returning</span>
                            </div>
                        </ChartCard>

                        {/* Module Popularity */}
                        <ChartCard title="Popular Modules">
                            <div className="space-y-4 pt-4">
                                {[
                                    { name: 'N5 Grammar Basics', students: 1205, progress: 85 },
                                    { name: 'N4 Kanji Recognition', students: 840, progress: 62 },
                                    { name: 'N5 Vocabulary 101', students: 1540, progress: 92 },
                                    { name: 'N3 Reading Comprehension', students: 430, progress: 45 },
                                ].map((mod, i) => (
                                    <div key={i} className="flex flex-col gap-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium text-gray-700">{mod.name}</span>
                                            <span className="text-gray-500">{mod.students} stds</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div className="bg-red-500 h-2 rounded-full" style={{ width: `${mod.progress}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ChartCard>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}