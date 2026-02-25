import Dropdown from '@/Components/UI/Dropdown';
import NavLink from '@/Components/Navigation/NavLink';
import SidebarLink from '@/Components/Navigation/SidebarLink';
import ResponsiveNavLink from '@/Components/Navigation/ResponsiveNavLink';
import ApplicationLogo from '@/Components/Navigation/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const adminMenu = [
    { href: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { href: '/admin/users', icon: '👥', label: 'Users' },
    { href: '/admin/levels', icon: '📚', label: 'Levels' },
    { href: '/admin/modules', icon: '📦', label: 'Modules' },
    { href: '/admin/lessons', icon: '📝', label: 'Lessons' },
    { href: '/admin/quizzes', icon: '❓', label: 'Quizzes' },
    { href: '/admin/questions', icon: '💡', label: 'Questions' },
];

const userMenu = [
    { href: '/user/dashboard', icon: '🏠', label: 'Dashboard' },
    { href: '/learn', icon: '📚', label: 'My Learning' },
    { href: '/quizzes', icon: '❓', label: 'Quizzes' },
    { href: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
    { href: '/certificates', icon: '🏅', label: 'Certificates' },
    { href: '/progress', icon: '📈', label: 'Progress' },
];

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const isAdmin = user.role === 'admin';
    const menu = isAdmin ? adminMenu : userMenu;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar Desktop */}
            <aside className={`hidden lg:flex flex-col ${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 fixed h-full z-40`}>
                <div className="p-4 border-b border-gray-100">
                    {sidebarOpen ? <ApplicationLogo /> : (
                        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-lg mx-auto">J</div>
                    )}
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {menu.map((item, i) => (
                        <SidebarLink key={i} href={item.href} icon={item.icon} active={window.location.pathname.startsWith(item.href)}>
                            {sidebarOpen && item.label}
                        </SidebarLink>
                    ))}
                </nav>
                <div className="p-3 border-t border-gray-100">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-all">
                        {sidebarOpen ? '← Collapse' : '→'}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`flex-1 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} transition-all duration-300`}>
                {/* Top Navbar */}
                <nav className="border-b border-gray-200 bg-white sticky top-0 z-30">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between">
                            <div className="flex items-center">
                                {/* Mobile menu toggle */}
                                <button onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)} className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition mr-2">
                                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                        <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                        <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <div className="lg:hidden"><ApplicationLogo /></div>
                            </div>

                            <div className="flex items-center gap-4">
                                {isAdmin && (
                                    <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600">
                                        👑 Admin
                                    </span>
                                )}
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition">
                                            <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center text-red-600 text-xs font-bold">
                                                {user.username?.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="hidden sm:inline">{user.username}</span>
                                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' lg:hidden'}>
                        <div className="space-y-1 pb-3 pt-2 px-2">
                            {menu.map((item, i) => (
                                <SidebarLink key={i} href={item.href} icon={item.icon} active={window.location.pathname.startsWith(item.href)}>
                                    {item.label}
                                </SidebarLink>
                            ))}
                        </div>
                    </div>
                </nav>

                {header && (
                    <header className="bg-white border-b border-gray-200">
                        <div className="px-4 py-5 sm:px-6 lg:px-8">{header}</div>
                    </header>
                )}

                <main className="p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
