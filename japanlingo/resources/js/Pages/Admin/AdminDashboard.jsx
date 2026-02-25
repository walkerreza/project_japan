import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Card from '@/Components/UI/Card';
import Badge from '@/Components/UI/Badge';
import Button from '@/Components/UI/Button';
import Avatar from '@/Components/UI/Avatar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  const sidebarItems = [
    { label: 'Overview', icon: <DashboardIcon sx={{ fontSize: 20 }} /> },
    { label: 'Users', icon: <PeopleIcon sx={{ fontSize: 20 }} /> },
    { label: 'Content', icon: <MenuBookIcon sx={{ fontSize: 20 }} /> },
    { label: 'Analytics', icon: <AssessmentIcon sx={{ fontSize: 20 }} /> },
    { label: 'Settings', icon: <SettingsIcon sx={{ fontSize: 20 }} /> },
  ];

  const stats = [
    { label: 'Total Students', value: '12,840', change: '+12.5%', color: 'blue' },
    { label: 'Active Progress', value: '84%', change: '+3.2%', color: 'green' },
    { label: 'Total Content', value: '450', sub: 'Lessons', color: 'purple' },
    { label: 'Monthly Revenue', value: '$8,420', change: '+18%', color: 'red' },
  ];

  const recentUsers = [
    { name: 'Sarah Jenkins', email: 'sarah.j@example.com', status: 'Active', plan: 'Premium' },
    { name: 'Michael Chen', email: 'm.chen@example.com', status: 'Inactive', plan: 'Basic' },
    { name: 'Jessica Lee', email: 'jess.lee@example.com', status: 'Active', plan: 'Premium' },
    { name: 'Yuki Takahashi', email: 'yuki@domain.jp', status: 'Active', plan: 'Basic' },
  ];

  return (
    <div className="flex h-screen bg-[#F8F9FB] font-sans">
      <Head title="Admin Dashboard - Japanlingo" />

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">JP</div>
            <span className="text-xl font-black tracking-tighter text-gray-900">Japanlingo<span className="text-red-600">.</span></span>
          </div>

          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold text-sm ${activeTab === item.label
                    ? 'bg-red-50 text-red-600'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 pt-0">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all font-bold text-sm">
            <LogoutIcon sx={{ fontSize: 20 }} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 shrink-0">
          <div className="relative w-96 group">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-red-500 transition-colors" sx={{ fontSize: 20 }} />
            <input
              type="text"
              placeholder="Quick search anything..."
              className="w-full h-11 bg-gray-50 border-transparent rounded-xl pl-12 pr-4 text-sm focus:bg-white focus:border-red-100 focus:ring-4 focus:ring-red-500/5 transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
              <NotificationsIcon />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 border-2 border-white rounded-full text-[8px] text-white flex items-center justify-center font-bold">3</span>
            </button>
            <div className="h-8 w-[1px] bg-gray-100"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900 leading-none">Admin User</p>
                <p className="text-[10px] text-gray-400 mt-1 uppercase font-black tracking-widest">Super Admin</p>
              </div>
              <Avatar size="md" className="ring-2 ring-gray-50 group-hover:ring-red-100 transition-all" />
            </div>
          </div>
        </header>

        {/* Dashboard Scroll Area */}
        <div className="flex-1 overflow-y-auto p-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Overview Dashboard</h2>
              <p className="text-sm text-gray-400 mt-1 font-medium">Monitoring your metrics and growth across the platform.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="!rounded-xl shadow-sm">Export Report</Button>
              <Button className="!rounded-xl shadow-lg !bg-gray-900 shadow-gray-200">New Lesson</Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((s, i) => (
              <Card key={i} className="!p-6 !rounded-[1.75rem] border-transparent hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-tighter">{s.label}</p>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gray-50 text-gray-400">
                    <TrendingUpIcon sx={{ fontSize: 16 }} />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight">{s.value}</h3>
                    {s.sub && <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">{s.sub}</p>}
                  </div>
                  {s.change && (
                    <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${s.color === 'green' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                      {s.change}
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Table Area */}
            <div className="lg:col-span-2">
              <Card className="!p-0 !rounded-[2rem] border-transparent shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Recent Enrolled Students</h3>
                  <button className="text-gray-400 hover:text-gray-900"><MoreVertIcon /></button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50/50">
                        <th className="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Student</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Plan</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {recentUsers.map((user, i) => (
                        <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <Avatar size="sm" />
                              <div>
                                <p className="text-sm font-bold text-gray-900 leading-none">{user.name}</p>
                                <p className="text-xs text-gray-400 mt-1">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <Badge color={user.plan === 'Premium' ? 'yellow' : 'blue'} className="!text-[10px]">
                              {user.plan}
                            </Badge>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              <span className="text-xs font-bold text-gray-600">{user.status}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <button className="text-xs font-black text-gray-400 hover:text-red-600 uppercase tracking-widest transition-colors">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-6 bg-gray-50/50 text-center">
                  <button className="text-xs font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors">View All Students</button>
                </div>
              </Card>
            </div>

            {/* Side Area / Quick Actions */}
            <div className="space-y-6">
              <Card className="!bg-red-600 !p-8 !rounded-[2rem] border-transparent text-white relative overflow-hidden shadow-2xl shadow-red-500/20">
                <div className="relative z-10">
                  <h4 className="text-lg font-bold mb-2">Upgrade Storage</h4>
                  <p className="text-sm text-red-100 mb-6">Your current media storage is at 84% capacity. Upgrade now for more space.</p>
                  <Button className="w-full !bg-white !text-red-600 !font-bold">Upgrade Now</Button>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              </Card>

              <Card className="!p-8 !rounded-[2rem] border-transparent bg-white shadow-sm">
                <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  System Status
                </h4>
                <div className="space-y-4">
                  {[
                    { l: 'API Engine', s: 'Operational' },
                    { l: 'Database', s: 'Syncing' },
                    { l: 'CDN Cache', s: 'Operational' },
                  ].map((sys, i) => (
                    <div key={i} className="flex justify-between items-center text-sm font-medium">
                      <span className="text-gray-400">{sys.l}</span>
                      <span className="text-gray-900">{sys.s}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;