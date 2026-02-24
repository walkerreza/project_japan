import ApplicationLogo from '@/Components/Navigation/ApplicationLogo';

const footerLinks = {
    learn: [
        { href: '#', label: 'Hiragana & Katakana' },
        { href: '#', label: 'JLPT N5 Course' },
        { href: '#', label: 'JLPT N4 Course' },
        { href: '#', label: 'JLPT N3 Course' },
    ],
    company: [
        { href: '#', label: 'About Us' },
        { href: '#', label: 'Careers' },
        { href: '#', label: 'Blog' },
        { href: '#', label: 'Contact' },
    ],
    legal: [
        { href: '#', label: 'Privacy Policy' },
        { href: '#', label: 'Terms of Service' },
        { href: '#', label: 'Cookie Policy' },
    ],
};

const socials = [
    { href: '#', icon: 'f' },
    { href: '#', icon: '✉' },
];

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 px-6 lg:px-20 pt-14 pb-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
                <div className="col-span-2 lg:col-span-1">
                    <div className="mb-3"><ApplicationLogo /></div>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">Making Japanese learning accessible, fun, and effective for everyone.</p>
                    <div className="flex gap-3">
                        {socials.map((s, i) => (
                            <a key={i} href={s.href} className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all no-underline">
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>
                {Object.entries(footerLinks).map(([title, links]) => (
                    <div key={title}>
                        <h4 className="text-sm font-bold mb-4 text-gray-900 capitalize">{title}</h4>
                        <ul className="space-y-2.5 list-none p-0">
                            {links.map((link, i) => (
                                <li key={i}>
                                    <a href={link.href} className="text-sm text-gray-500 hover:text-red-600 transition-colors no-underline">{link.label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-between text-xs text-gray-400">
                <span>© 2026 Japanlingo. All rights reserved.</span>
            </div>
        </footer>
    );
}
