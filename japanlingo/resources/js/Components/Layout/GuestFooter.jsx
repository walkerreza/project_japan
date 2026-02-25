import ApplicationLogo from '@/Components/Navigation/ApplicationLogo';
import { Link } from '@inertiajs/react';

const footerLinks = {
    Produk: [
        { href: '/roadmap', label: 'Kursus JLPT' },
        { href: '#', label: 'E-book Kanji' },
        { href: '#', label: 'Live Class' },
        { href: '#', label: 'Simulasi Ujian' },
    ],
    Perusahaan: [
        { href: '#', label: 'Tentang Kami' },
        { href: '#', label: 'Karir' },
        { href: '#', label: 'Blog' },
        { href: '#', label: 'Kebijakan Privasi' },
    ],
};

const socials = [
    { href: '#', icon: '🌐', label: 'Website' },
    { href: '#', icon: '✉', label: 'Email' },
    { href: '#', icon: '👥', label: 'Community' },
];

export default function Footer() {
    return (
        <footer className="bg-[#0D1117] border-t border-white/5 px-6 lg:px-20 pt-14 pb-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div className="col-span-2 lg:col-span-2">
                        <div className="mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-lg">J</div>
                            <span className="text-xl font-extrabold text-white">Japanlingo</span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
                            Platform belajar Bahasa Jepang nomor satu di Indonesia dengan kurikulum standar internasional.
                        </p>
                        <div className="flex gap-3">
                            {socials.map((s, i) => (
                                <a
                                    key={i}
                                    href={s.href}
                                    aria-label={s.label}
                                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all no-underline text-sm"
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="text-xs font-bold mb-5 text-white uppercase tracking-widest">{title}</h4>
                            <ul className="space-y-3 list-none p-0">
                                {links.map((link, i) => (
                                    <li key={i}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-gray-400 hover:text-white transition-colors no-underline"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
                    <span>© 2024 Japanlingo. Seluruh hak cipta dilindungi.</span>
                    <div className="flex gap-5">
                        <a href="#" className="hover:text-white transition-colors no-underline">Syarat & Ketentuan</a>
                        <a href="#" className="hover:text-white transition-colors no-underline">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
