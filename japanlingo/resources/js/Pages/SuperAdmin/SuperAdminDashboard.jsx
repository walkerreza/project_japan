import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import StatCard from '@/Components/Dashboard/StatCard';
import ChartCard from '@/Components/Dashboard/ChartCard';
import Card from '@/Components/UI/Card';

export default function SuperadminDashboard({ 
    totalUsers = 125430, 
    activeUsers = 42100, 
    totalAdmins = 15, 
    totalRevenue = "¥45.2M",
    totalModules = 850,
    totalQuestions = 12500
}) {
    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Superadmin Global Dashboard</h2>}
        >
            <Head title="Superadmin HQ Dashboard" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Platform Overview */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900 border-l-4 border-red-600 pl-3">Platform Overview</h3>
                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">HQ Tokyo</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard title="Total Users" value={totalUsers.toLocaleString()} icon="👥" trend="+12%" />
                            <StatCard title="Active Users" value={activeUsers.toLocaleString()} icon="🔥" trend="+5%" />
                            <StatCard title="Total Admins" value={totalAdmins} icon="🛡️" />
                            <StatCard title="Total Revenue" value={totalRevenue} icon="💰" trend="+18%" />
                            <StatCard title="Total Modules" value={totalModules} icon="📦" />
                            <StatCard title="Total Questions" value={totalQuestions.toLocaleString()} icon="❓" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* User Growth Chart */}
                        <ChartCard title="User Growth (New vs Returning)">
                            <div className="h-64 flex items-end justify-between px-4 pb-2 space-x-2">
                                {/* Dummy bars for visual */}
                                {[40, 60, 45, 70, 50, 80, 65, 90, 75, 100].map((h, i) => (
                                    <div key={i} className="w-full flex flex-col justify-end gap-1">
                                        <div className="w-full bg-red-200 rounded-t" style={{ height: `${h * 0.4}%` }}></div>
                                        <div className="w-full bg-red-600 rounded-t" style={{ height: `${h * 0.6}%` }}></div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-600 rounded"></div> New Users</span>
                                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-200 rounded"></div> Returning</span>
                            </div>
                        </ChartCard>

                        {/* Revenue Growth Chart */}
                        <ChartCard title="Revenue Growth (MRR)">
                            <div className="h-64 flex items-end justify-between px-4 pb-2 space-x-4">
                                {/* Dummy line chart visual represented by bars for now */}
                                {[30, 40, 35, 50, 45, 60, 55, 70, 65, 85].map((h, i) => (
                                    <div key={i} className="w-full bg-green-500 rounded-t opacity-80" style={{ height: `${h}%` }}></div>
                                ))}
                            </div>
                        </ChartCard>
                    </div>

                    {/* Active & System Status */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="col-span-1 lg:col-span-2">
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-gray-900 border-l-4 border-red-600 pl-3 mb-4">Recent System Alerts</h3>
                                <div className="space-y-4">
                                    {[
                                        { time: '10 mins ago', msg: 'High load detected on DB Cluster 02', type: 'warning' },
                                        { time: '1 hour ago', msg: 'New Admin "Sensei_Yuki" created by Root', type: 'info' },
                                        { time: '3 hours ago', msg: 'Pricing Plan "Premium Pro" updated', type: 'success' },
                                        { time: '1 day ago', msg: 'Failed login attempts spike from IP 192.168.x.x', type: 'danger' },
                                    ].map((alert, i) => (
                                        <div key={i} className={`p-3 rounded-lg border-l-4 text-sm flex justify-between
                                            ${alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400 text-yellow-800' : 
                                              alert.type === 'danger' ? 'bg-red-50 border-red-500 text-red-800' : 
                                              alert.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' : 
                                              'bg-blue-50 border-blue-400 text-blue-800'}`}
                                        >
                                            <span>{alert.msg}</span>
                                            <span className="text-xs opacity-70">{alert.time}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 text-right border-t pt-3">
                                    <Link href="#" className="text-sm font-medium text-red-600 hover:text-red-800">View All activity &rarr;</Link>
                                </div>
                            </div>
                        </Card>
                        
                        <Card className="col-span-1 border-t-4 border-t-red-600">
                            <div className="p-4">
                                <h3 className="font-bold text-gray-900 mb-2">System Status</h3>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="relative">
                                        <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                        <div className="absolute top-0 left-0 w-4 h-4 rounded-full bg-green-500 animate-ping"></div>
                                    </div>
                                    <span className="font-medium text-green-700">All Systems Operational</span>
                                </div>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between"><span>Version</span> <span>v2.4.0</span></div>
                                    <div className="flex justify-between"><span>Uptime</span> <span>99.98%</span></div>
                                    <div className="flex justify-between"><span>Server Load</span> <span>24%</span></div>
                                </div>
                                <div className="mt-6 pt-4 border-t border-gray-100">
                                    <Link href="#" className="w-full block text-center py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium transition">
                                        Run Diagnostics
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
