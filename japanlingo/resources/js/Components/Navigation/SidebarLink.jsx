import { Link } from '@inertiajs/react';

export default function SidebarLink({ href, icon, children, active = false, badge, className = '' }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${active
                    ? 'bg-red-50 text-red-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } ${className}`}
        >
            {icon && <span className="text-lg">{icon}</span>}
            <span className="flex-1">{children}</span>
            {badge && (
                <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {badge}
                </span>
            )}
        </Link>
    );
}
