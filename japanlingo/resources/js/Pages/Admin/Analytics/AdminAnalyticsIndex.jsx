import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Card from '@/Components/UI/Card';
import StatCard from '@/Components/Dashboard/StatCard';

export default function AdminAnalyticsIndex({ summary = {}, lowScoreQuizzes = [], popularModules = [], inactiveStudents = [], recentAttempts = [] }) {
    return (
        <AuthenticatedLayout>
            <Head title="Admin - Analitik Sensei" />

            <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                <div>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-red-600 dark:text-red-400">Sensei Analytics</p>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">Analitik Pembelajaran</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Pantau quiz sulit, murid pasif, dan modul yang paling sering diselesaikan.</p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard title="Total Murid" value={summary.total_students || 0} icon="U" />
                    <StatCard title="Quiz Attempt" value={summary.total_attempts || 0} icon="Q" />
                    <StatCard title="Rata-rata Skor" value={summary.average_score || 0} icon="S" />
                    <StatCard title="Murid Pasif" value={summary.inactive_students || 0} icon="I" />
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <Card>
                        <h2 className="text-lg font-black text-gray-900 dark:text-white">Quiz dengan Skor Rendah</h2>
                        <div className="mt-4 space-y-3">
                            {lowScoreQuizzes.map((item) => (
                                <div key={item.quiz_id} className="rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
                                    <div className="flex justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-black text-gray-900 dark:text-white">{item.lesson || item.quiz_type}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.module || 'Tanpa modul'} - {item.attempts_count} attempt</p>
                                        </div>
                                        <span className="text-sm font-black text-red-600 dark:text-red-400">{item.average_score}</span>
                                    </div>
                                </div>
                            ))}
                            {lowScoreQuizzes.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400">Belum ada attempt quiz.</p>}
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-lg font-black text-gray-900 dark:text-white">Modul Populer</h2>
                        <div className="mt-4 space-y-3">
                            {popularModules.map((item) => (
                                <div key={item.id} className="rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
                                    <div className="mb-2 flex justify-between text-sm">
                                        <span className="font-black text-gray-900 dark:text-white">{item.title}</span>
                                        <span className="text-gray-500 dark:text-gray-400">{item.completions_count} selesai</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                                        <div className="h-full rounded-full bg-red-600" style={{ width: `${Math.min(100, item.completions_count * 10)}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <Card>
                        <h2 className="text-lg font-black text-gray-900 dark:text-white">Murid Pasif</h2>
                        <div className="mt-4 space-y-3">
                            {inactiveStudents.map((student) => (
                                <Link key={student.id} href={route('admin.users.show', student.id)} className="block rounded-2xl border border-gray-100 dark:border-gray-800 p-4 transition-colors hover:border-red-200 dark:hover:border-red-900/40">
                                    <p className="text-sm font-black text-gray-900 dark:text-white">{student.username}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{student.email}</p>
                                    <p className="mt-2 text-xs font-bold text-gray-400">Aktivitas terakhir: {student.last_activity_label}</p>
                                </Link>
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-lg font-black text-gray-900 dark:text-white">Attempt Terbaru</h2>
                        <div className="mt-4 space-y-3">
                            {recentAttempts.map((attempt) => (
                                <div key={attempt.id} className="rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
                                    <div className="flex justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-black text-gray-900 dark:text-white">{attempt.student}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{attempt.lesson || attempt.quiz_type}</p>
                                        </div>
                                        <span className="text-sm font-black text-red-600 dark:text-red-400">{attempt.score}</span>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-400">{attempt.attempted_at}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
